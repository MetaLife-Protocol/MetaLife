import TcpSocket from 'react-native-tcp-socket';
import {BLEWormhole} from 'react-native-ble-wormhole';
import {Buffer} from 'buffer';
import BleManager from 'react-native-ble-manager/BleManager';
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

// let awaitingOutgoingConnection = []

let deviceInfos = {};
let deviceID_Name = {};

let connectedDevices = {};

let deviceProperties = [];

let commandResponseBuffer = [];

let needAddIsEnableCmd = false;

let IsStartCentral = false;
let IsStartPeripheral = false;
let payloadData = {};

export const bluetoothBridge = function (options) {
  var localHost = '127.0.0.1';
  console.log('bluetoothBridge init');
  let clientIncoming;
  let clientOutgoing;
  function createConnection() {
    clientIncoming = TcpSocket.createConnection(
      {port: options.incomingPort, host: localHost},
      () => {},
    );
    clientIncoming.on('error', function (error) {
      console.log('clientIncoming error:', error);
    });
    clientIncoming.on('data', function (data) {
      console.log('Received Incoming', data);
      for (let connectedDeviceID in connectedDevices) {
        if (!connectedDevices.hasOwnProperty(connectedDeviceID)) {
          continue;
        }

        let connectedDeviceName = connectedDevices[connectedDeviceID];
        if (connectedDeviceName !== undefined) {
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
  BLEWormhole.ReceiveHandler = characteristic => {
    if (characteristic !== undefined) {
      if (
        characteristic.uuid.toLowerCase() === controlCharaUUID.toLowerCase()
      ) {
        console.log('characteristic', characteristic);
        var jsonString = Buffer.from(characteristic.value).toString();
        console.log('json', jsonString);
        var dataCommand = JSON.parse(jsonString);
        if (dataCommand.command === 'metaData') {
          var metaData = dataCommand.arguments.metadata;
          var errInfo = dataCommand.arguments.error;
          if (errInfo === undefined) {
            commandResponseBuffer.push({
              command: 'getMetadata',
              arguments: {metaData: metaData, error: false},
            });
            DeviceEventEmitter.emit('commandPop');
          } else {
            commandResponseBuffer.push({
              command: 'getMetadata',
              arguments: {
                errorCode: 'errorGettingMetadata',
                error: true,
                description: errInfo,
              },
            });
            DeviceEventEmitter.emit('commandPop');
          }
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
              if (clientIncoming === undefined) {
                createConnection();
              }
              if (connectedDevices[deviceID] === undefined) {
                commandResponseBuffer.push({
                  command: 'connected',
                  arguments: {remoteAddress: deviceID, isIncoming: true},
                });
                DeviceEventEmitter.emit('commandPop');
                connectedDevices[deviceID] = deviceName;
              } else {
                commandResponseBuffer.push({
                  command: 'connectionFailure',
                  arguments: {
                    remoteAddress: deviceID,
                    isIncoming: true,
                    reason: 'Already connected.',
                  },
                });
                DeviceEventEmitter.emit('commandPop');
              }
            }
          }
        }
      } else if (characteristic.uuid === incomingCharaUUID) {
        clientIncoming.write(characteristic.data);
      } else if (characteristic.uuid === outgoingCharaUUID) {
        clientOutgoing.write(characteristic.data);
      } else {
      }
    } else {
    }
  };

  BLEWormhole.DiscoverDeviceStopHandler = () => {
    console.log('stop scan');
    commandResponseBuffer.push({
      command: 'discovered',
      arguments: {devices: deviceProperties},
    });
    DeviceEventEmitter.emit('commandPop');
  };

  BLEWormhole.DiscoverDeviceHandler = device => {
    deviceID_Name[device.deviceID] = device.name;

    console.log('device', device, deviceID_Name[device.deviceID]);

    if (deviceInfos[device.name] === undefined) {
      deviceInfos[device.name] = device;
      var deviceProperty = {
        remoteAddress: device.deviceID,
        displayName: device.name,
      };
      deviceProperties.push(deviceProperty);

      if (connectedDevices[deviceProperty.remoteAddress] === undefined) {
        console.log('connecting', device.deviceID);
        BLEWormhole.Connect(device.deviceID, bleServiceUUID, connectCharaUUIDs)
          .then(res => {
            console.log('connect:' + res.characteristic);
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

      // awaitingOutgoingConnection.push(remoteAddress);
    } else if (command === 'ownMacAddress') {
      commandResponseBuffer.push({
        command: 'ownMacAddress',
        arguments: {address: BLEWormhole.deviceUUID},
      });
      DeviceEventEmitter.emit('commandPop');
    } else if (command === 'discoverDevices') {
      deviceProperties = [];
      BLEWormhole.Scan([bleServiceUUID], dicoveredSeconds);
    } else if (command === 'makeDiscoverable') {
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
      if (IsStartPeripheral) {
        commandResponseBuffer.push({
          command: 'metadataService',
          arguments: {error: false, availableUntil: -1},
        });
        DeviceEventEmitter.emit('commandPop');
        payloadData = cmd_arguments.payload;
        deviceProperties = [];
        BLEWormhole.Scan([bleServiceUUID], dicoveredSeconds);
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
      var remoteAddress = cmd_arguments.remoteAddress;
      var displayName = deviceID_Name[remoteAddress];

      var jsonData = {
        command: 'getMetadata',
        arguments: {
          error: true,
          metaData: payloadData,
        },
      };
      var jsonString = JSON.stringify(jsonData);
      var sendBuffer = Buffer.from(jsonString);
      BLEWormhole.SendBuffer(
        displayName,
        remoteAddress,
        bleServiceUUID,
        controlCharaUUID,
        sendBuffer,
      );
    } else {
    }
  }

  BLEWormhole.GenerateDeviceID().then(res => {
    BLEWormhole.CreatServer(bleServiceUUID, connectCharaUUIDs, res);

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

    clientOutgoing = TcpSocket.createConnection(
      {port: options.outgoingPort, host: localHost},
      () => {},
    );
    clientOutgoing.on('error', function (error) {
      console.log('clientOutgoing error:', error);
    });
    clientOutgoing.on('data', function (data) {
      if (data !== undefined) {
        for (let disconnectedDeviceID in connectedDevices) {
          if (!connectedDevices.hasOwnProperty(disconnectedDeviceID)) {
            continue;
          }

          let disconnectedDeviceName = connectedDevices[disconnectedDeviceID];
          if (disconnectedDeviceName !== undefined) {
            var sendBuffer = Buffer.from(data);
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
  });
};
