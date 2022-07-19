import TcpSocket from 'react-native-tcp-socket';
import {BLEWormhole} from 'react-native-ble-wormhole';
import {Buffer} from 'buffer';
import BLEPeripheral from 'react-native-ble-peripheral';
import {
  NativeEventEmitter,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
const toPull = require('stream-to-pull-stream');
const pull = require('pull-stream');
const Pushable = require('pull-pushable');
const pullJson = require('pull-json-doubleline');
let controlSocketSource = Pushable();

const bleServiceUUID = 'C4FB2349-72FE-1BA2-94D6-1F3CB16311EE';

const incomingCharaUUID = 'D4FB2349-72FE-1BA2-94D6-1F3CB16311EE';
const outgoingCharaUUID = 'E4FB2349-72FE-1BA2-94D6-1F3CB16311EE';
const controlCharaUUID = 'F4FB2349-72FE-1BA2-94D6-1F3CB16311EE';

const connectCharaUUIDs = [
  incomingCharaUUID,
  outgoingCharaUUID,
  controlCharaUUID,
];

let deviceInfos = {};
let deviceID_Name = {};
let deviceName_ID = {};

let connectedDevices = {};

let deviceProperties = [];
let devicePayloads = {};

let commandResponseBuffer = [];

let needAddIsEnableCmd = false;

let IsStartCentral = false;
let IsStartPeripheral = false;
let payloadData = {};
let IsStopScan = false;

export const bluetoothBridge = function (options) {
  var localHost = '127.0.0.1';
  console.log('bluetoothBridge init');
  let clientIncomings = {};
  let clientOutgoings = {};

  function createControllConnection() {
    let clientControll = TcpSocket.createConnection(
      {port: options.controlPort, host: localHost},
      () => {
        var duplexConnection = toPull.duplex(clientControll);

        // Send commands to the control server
        pull(
          controlSocketSource,
          pullJson.stringify(),
          pull.map(mapCommand),
          duplexConnection.sink,
        );

        // Receive and process commands from the control server
        pull(duplexConnection.source, pullJson.parse(), pull.drain(doCommand));
      },
    );

    clientControll.on('error', function (error) {
      console.log('clientControll error:', error);
    });
    clientControll.on('close', function (error) {
      console.log('clientControll close:', error);
    });
  }

  function createIncommingConnection(remoteAddress, cb) {
    if (clientIncomings[remoteAddress]) {
      cb && cb();
      return;
    }
    console.log('createIncommingConnection', remoteAddress);

    let clientIncoming = TcpSocket.createConnection(
      {port: options.incomingPort, host: localHost},
      () => {
        cb && cb();
      },
    );
    clientIncoming.on('error', function (error) {
      console.log('clientIncoming error:', error);
    });
    clientIncoming.on('close', function (error) {
      console.log('clientIncoming close:', error);
    });
    clientIncoming.on('data', function (data) {
      console.log('clientIncoming receive:', data);
      for (let connectedDeviceID in connectedDevices) {
        if (!connectedDevices.hasOwnProperty(connectedDeviceID)) {
          continue;
        }

        let connectedDeviceName = connectedDevices[connectedDeviceID];
        if (connectedDeviceName !== undefined) {
          console.log('clientIncoming sendBle');

          BLEWormhole.SendBuffer(
            connectedDeviceName,
            connectedDeviceID,
            bleServiceUUID,
            incomingCharaUUID,
            data,
          );
        }
      }
    });
    clientIncomings[remoteAddress] = clientIncoming;

    if (clientIncomings[remoteAddress]) {
      commandResponseBuffer.push({
        command: 'connected',
        arguments: {remoteAddress: remoteAddress, isIncoming: true},
      });
      DeviceEventEmitter.emit('commandPop');
    } else {
      commandResponseBuffer.push({
        command: 'connectionFailure',
        arguments: {
          remoteAddress: remoteAddress,
          isIncoming: true,
          reason: 'Already connected.',
        },
      });
      DeviceEventEmitter.emit('commandPop');
    }
  }

  function createOutgoingConnection(remoteAddress) {
    if (clientOutgoings[remoteAddress]) {
      return;
    }
    console.log('createOutgoingConnection', remoteAddress);
    let clientOutgoing = TcpSocket.createConnection(
      {port: options.outgoingPort, host: localHost},
      () => {},
    );
    clientOutgoing.on('error', function (error) {
      console.log('clientOutgoing error:', error);
    });
    clientOutgoing.on('close', function (error) {
      console.log('clientOutgoing close:', error);
    });
    clientOutgoing.on('data', function (data) {
      console.log('clientOutgoing receive:', data);

      if (data !== undefined) {
        for (let disconnectedDeviceID in connectedDevices) {
          if (!connectedDevices.hasOwnProperty(disconnectedDeviceID)) {
            continue;
          }
          let disconnectedDeviceName = connectedDevices[disconnectedDeviceID];
          if (disconnectedDeviceName !== undefined) {
            var sendBuffer = Buffer.from(data);
            console.log('clientOutgoing sendBle');

            BLEWormhole.SendBuffer(
              disconnectedDeviceName,
              disconnectedDeviceID,
              bleServiceUUID,
              outgoingCharaUUID,
              sendBuffer,
            );
          }
        }
      }
    });

    clientOutgoings[remoteAddress] = clientOutgoing;
  }

  DeviceEventEmitter.addListener('commandPop', () => {
    var commandResponse = commandResponseBuffer.shift();
    if (commandResponse !== undefined) {
      controlSocketSource.push(commandResponse);
    }
  });
  var peripheralEmitter = new NativeEventEmitter(BLEPeripheral);
  var centralEmitter = new NativeEventEmitter(NativeModules.BleManager);
  BLEWormhole.CreateNativeEventEmitter(centralEmitter, peripheralEmitter);
  BLEWormhole.DisconnectHandler = deviceID => {
    console.log('disconnect', deviceID);
    if (connectedDevices[deviceID] !== undefined) {
      let deviceName = connectedDevices[deviceID];
      delete connectedDevices[deviceID];
      if (clientIncomings[deviceName]) {
        clientIncomings[deviceName].destroy();
        delete clientIncomings[deviceName];
      }
      if (clientOutgoings[deviceName]) {
        clientOutgoings[deviceName].destroy();
        delete clientOutgoings[deviceName];
      }
    }
  };
  BLEWormhole.ReceiveHandler = characteristic => {
    if (characteristic !== undefined) {
      console.log('characteristic', characteristic);
      if (
        characteristic.uuid.toLowerCase() === controlCharaUUID.toLowerCase()
      ) {
        var jsonString = Buffer.from(characteristic.value).toString();
        console.log('json', jsonString);
        var dataCommand = JSON.parse(jsonString);
        if (dataCommand.command === 'getMetadata') {
          var metaData = dataCommand.arguments.metadata;
          var errInfo = dataCommand.arguments.error;

          devicePayloads[dataCommand.requestId] = metaData;

          if (errInfo === undefined || errInfo === false) {
            commandResponseBuffer.push({
              command: 'getMetadata',
              arguments: {metadata: metaData, error: false},
              requestId: dataCommand.requestId,
            });
          } else {
            commandResponseBuffer.push({
              command: 'getMetadata',
              arguments: {
                errorCode: 'errorGettingMetadata',
                error: true,
                description: errInfo,
              },
              requestId: dataCommand.requestId,
            });
          }
          DeviceEventEmitter.emit('commandPop');
        }
        if (dataCommand.command === 'getMetadataBle') {
          console.log('payloadData', payloadData);

          var deviceID = characteristic.device;
          var displayName = deviceID_Name[deviceID];

          var tmpArguments = {};
          if (payloadData === undefined) {
            tmpArguments = {
              errorCode: 'errorGettingMetadata',
              error: true,
              description: 'not find payloadData',
            };
          } else {
            tmpArguments = {
              metadata: payloadData,
              error: false,
            };
          }
          var jsonData = {
            command: 'getMetadata',
            arguments: tmpArguments,
            requestId: dataCommand.requestId,
          };
          var jsonString = JSON.stringify(jsonData);
          var sendBuffer = Buffer.from(jsonString);
          BLEWormhole.SendBuffer(
            displayName,
            deviceID,
            bleServiceUUID,
            controlCharaUUID,
            sendBuffer,
          );
        }
        if (dataCommand.command === 'incoming') {
          var deviceID = characteristic.device;
          var deviceName = deviceID_Name[deviceID];
          console.log('command incoming', characteristic);
          setTimeout(() => {
            while (deviceName === undefined) {}
          }, 5000);
          console.log('command incoming', deviceName, BLEWormhole.deviceUUID);
          if (deviceName !== undefined) {
            if (deviceName === BLEWormhole.deviceUUID) {
            } else {
              connectedDevices[deviceID] = deviceName;
            }
          }
        }
      } else if (
        characteristic.uuid.toLowerCase() === incomingCharaUUID.toLowerCase()
      ) {
        var deviceID = characteristic.device;
        var deviceName = deviceID_Name[deviceID];

        if (characteristic.value === undefined) {
          console.log('incoming no data');
        } else {
          console.log('incoming send data');

          let succes = clientOutgoings[deviceName].write(
            Buffer.from(characteristic.value),
          );
          console.log('clientOutgoing write', succes);
        }
      } else if (
        characteristic.uuid.toLowerCase() === outgoingCharaUUID.toLowerCase()
      ) {
        var deviceID = characteristic.device;
        var deviceName = deviceID_Name[deviceID];

        if (characteristic.value === undefined) {
          console.log('outgoing no data');
        } else {
          console.log('outgoing send data');
          createIncommingConnection(deviceName, () => {
            let succes = clientIncomings[deviceName].write(
              Buffer.from(characteristic.value),
            );
            console.log('clientIncoming write', succes);
          });
        }
      } else {
      }
    } else {
    }
  };

  BLEWormhole.DiscoverDeviceStopHandler = () => {
    console.log('stop scan');
    if (IsStopScan) {
      return;
    }
    commandResponseBuffer.push({
      command: 'discovered',
      arguments: {devices: deviceProperties},
    });
    DeviceEventEmitter.emit('commandPop');
  };

  BLEWormhole.DiscoverDeviceHandler = device => {
    deviceID_Name[device.deviceID] = device.name;
    deviceName_ID[device.name] = device.deviceID;
    var deviceProperty;
    if (deviceInfos[device.name] === undefined && device.name !== undefined) {
      console.log('device', device);

      deviceInfos[device.name] = device;
      deviceProperty = {
        remoteAddress: device.name,
        displayName: device.deviceID,
      };
      deviceProperties.push(deviceProperty);

      if (connectedDevices[deviceProperty.displayName] === undefined) {
        console.log('connecting', device.deviceID);
        BLEWormhole.Connect(device.deviceID, bleServiceUUID, connectCharaUUIDs)
          .then(res => {
            console.log('connect:' + res.characteristic, deviceProperty);
            var commandData = {command: 'incoming', arguments: deviceProperty};
            var jsonString = JSON.stringify(commandData);
            BLEWormhole.SendBuffer(
              device.name,
              device.deviceID,
              bleServiceUUID,
              controlCharaUUID,
              Buffer.from(jsonString),
            );
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        console.log('connect find', device.deviceID);
        commandResponseBuffer.push({
          command: 'connected',
          arguments: {
            remoteAddress: deviceProperty.remoteAddress,
            isIncoming: true,
          },
        });
        DeviceEventEmitter.emit('commandPop');
      }
    }
  };

  BLEWormhole.BluetoothStateHandler = res => {
    var bluetoothEnable = false;
    if (res.state === 'on') {
      bluetoothEnable = true;
    }

    if (needAddIsEnableCmd) {
      commandResponseBuffer.push({
        command: 'isEnabled',
        arguments: {enabled: bluetoothEnable},
      });
      DeviceEventEmitter.emit('commandPop');
    } else {
      commandResponseBuffer.push({
        command: 'bluetoothState',
        arguments: {error: false, isEnabled: bluetoothEnable},
      });
      DeviceEventEmitter.emit('commandPop');
    }
  };
  function mapCommand(command) {
    console.log('mapCommand', command);

    return command;
  }
  function doCommand(command) {
    var jsonData = command;
    console.log('doCommand', jsonData);

    var command = jsonData.command;
    var cmd_arguments = jsonData.arguments;
    var dicoveredSeconds = 10;
    if (command === 'connect') {
      var remoteAddress = cmd_arguments.remoteAddress;

      commandResponseBuffer.push({
        command: 'connected',
        arguments: {
          remoteAddress: remoteAddress,
          isIncoming: false,
        },
      });
      DeviceEventEmitter.emit('commandPop');
      createOutgoingConnection(remoteAddress);
    } else if (command === 'ownMacAddress') {
      commandResponseBuffer.push({
        command: 'ownMacAddress',
        arguments: {address: BLEWormhole.deviceUUID},
      });
      DeviceEventEmitter.emit('commandPop');
    } else if (command === 'discoverDevices') {
      // deviceProperties = [];
      BLEWormhole.Scan([bleServiceUUID], dicoveredSeconds, true);
    } else if (command === 'makeDiscoverable') {
      if (IsStopScan) {
        return;
      }
      IsStopScan = false;
      setTimeout(() => {
        IsStopScan = true;
      }, cmd_arguments.forTime);

      if (IsStartCentral) {
        commandResponseBuffer.push({
          command: 'discoverable',
          arguments: {error: false, discoverableUntil: dicoveredSeconds},
        });
        DeviceEventEmitter.emit('commandPop');
      } else {
        BLEWormhole.StartCentral()
          .then(res => {
            commandResponseBuffer.push({
              command: 'discoverable',
              arguments: {error: false, discoverableUntil: dicoveredSeconds},
            });
            DeviceEventEmitter.emit('commandPop');
            IsStartCentral = true;
          })
          .catch(err => {
            commandResponseBuffer.push({
              command: 'discoverable',
              arguments: {
                error: true,
                errorCode: 'appNotVisible',
                description: err,
              },
            });
            DeviceEventEmitter.emit('commandPop');
          });
      }
    } else if (command === 'isEnabled') {
      BLEWormhole.CheckState();
      needAddIsEnableCmd = true;
    } else if (command === 'startMetadataService') {
      payloadData = cmd_arguments.payload;

      if (IsStartPeripheral) {
        commandResponseBuffer.push({
          command: 'metadataService',
          arguments: {error: false, availableUntil: -1},
        });
        DeviceEventEmitter.emit('commandPop');
        // deviceProperties = [];
        BLEWormhole.Scan([bleServiceUUID], dicoveredSeconds, true);
      } else {
        BLEWormhole.StartPeripheral()
          .then(res => {
            commandResponseBuffer.push({
              command: 'metadataService',
              arguments: {error: false, availableUntil: -1},
            });
            DeviceEventEmitter.emit('commandPop');
            IsStartPeripheral = true;
          })
          .catch(err => {
            commandResponseBuffer.push({
              command: 'metadataService',
              arguments: {
                error: true,
                errorCode: 'errorStarting',
                description: err,
              },
            });
            DeviceEventEmitter.emit('commandPop');
          });
      }
    } else if (command === 'getMetadata') {
      //ssb-mobile-bluetooth-manager need change
      var remoteAddress = cmd_arguments.remoteDevice;
      var deviceID = deviceName_ID[remoteAddress];

      var displayName = cmd_arguments.remoteDevice;

      var jsonData = {
        command: 'getMetadataBle',
        arguments: cmd_arguments,
        requestId: jsonData.requestId,
      };
      var jsonString = JSON.stringify(jsonData);
      var sendBuffer = Buffer.from(jsonString);
      BLEWormhole.SendBuffer(
        displayName,
        deviceID,
        bleServiceUUID,
        controlCharaUUID,
        sendBuffer,
      );
    } else {
    }
  }

  BLEWormhole.GenerateDeviceID().then(res => {
    BLEWormhole.CreatServer(bleServiceUUID, connectCharaUUIDs, res);

    createControllConnection();
  });
};
