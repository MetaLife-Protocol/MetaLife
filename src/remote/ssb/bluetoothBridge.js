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

export const bluetoothBridge = function (options) {
  var localHost = '127.0.0.1';
  console.log('bluetoothBridge init');
  DeviceEventEmitter.addListener('commandPop', () => {
    var commandResponse = commandResponseBuffer.shift();
    if (commandResponse !== undefined) {
      var jsonString = JSON.stringify(commandResponse);
      var sendBuffer = Buffer.from(jsonString);
      clientControll.write(sendBuffer);
    }
  });
  var peripheralEmitter = new NativeEventEmitter(BLEPeripheral);
  var centralEmitter = new NativeEventEmitter(NativeModules.BleManager);
  BLEWormhole.CreateNativeEventEmitter(centralEmitter, peripheralEmitter);
  BLEWormhole.ReceiveHandler = characteristic => {
    if (characteristic !== undefined) {
      if (characteristic.uuid === controlCharaUUID) {
        var jsonString = Buffer.from(characteristic.data).toString();
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
          if (deviceName !== undefined) {
            if (deviceName === BLEWormhole.deviceUUID) {
            } else {
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

  BLEWormhole.DiscoverDeviceHandler = device => {
    if (deviceID_Name[device.deviceID] === undefined) {
      deviceID_Name[device.deviceID] = device.name;
    }

    if (deviceInfos[device.name] !== undefined) {
      deviceInfos[device.name] = device;
      var deviceProperty = {
        remoteAddress: device.deviceID,
        displayName: device.name,
      };
      deviceProperties.push(deviceProperty);

      if (connectedDevices[deviceProperty.remoteAddress] === undefined) {
        BLEWormhole.Connect(device.deviceID, bleServiceUUID, connectCharaUUIDs)
          .then(res => {
            console.log(res);
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

  BLEWormhole.ScanStopHandler = () => {
    commandResponseBuffer.push({
      command: 'dicovered',
      arguments: {devices: deviceProperties},
    });
    DeviceEventEmitter.emit('commandPop');
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

  let clientControll = TcpSocket.createConnection(
    {port: options.controlPort, host: localHost},
    () => {
      console.log('connect controller');

    },
  );
  clientControll.on('error', function (error) {
    console.log('clientControll error:', error);
  });
  clientControll.on('data', function (data) {
    var jsonString = Buffer.from(data).toString();
    var jsonData = JSON.parse(jsonString);
    var command = jsonData.command;
    console.log('data:', data);
    var dicoveredSeconds = 3;
    if (command === 'connect') {
      var remoteAddress = data.arguments.remoteAddress;

      // awaitingOutgoingConnection.push(remoteAddress);
    } else if (command === 'discoverDevices') {
      deviceProperties = [];
      BLEWormhole.Scan([bleServiceUUID], dicoveredSeconds);
    } else if (command === 'makeDiscoverable') {
      BLEWormhole.StartCentral()
        .then(res => {
          commandResponseBuffer.push({
            command: 'discoverable',
            arguments: {error: false, discoverableUntil: dicoveredSeconds},
          });
          DeviceEventEmitter.emit('commandPop');
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
    } else if (command === 'isEnabled') {
      BLEWormhole.CheckState();
      needAddIsEnableCmd = true;
    } else if (command === 'startMetadataService') {
      BLEWormhole.StartPeripheral()
        .then(res => {
          commandResponseBuffer.push({
            command: 'metadataService',
            arguments: {error: false, availableUntil: -1},
          });
          DeviceEventEmitter.emit('commandPop');
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
    } else if (command === 'getMetadata') {
      //ssb-mobile-bluetooth-manager need change
      var remoteAddress = data.arguments.remoteAddress;
      var displayName = data.arguments.displayName;
      BLEWormhole.SendBuffer(
        displayName,
        remoteAddress,
        bleServiceUUID,
        controlCharaUUID,
      );
    } else {
    }
  });

  let clientIncoming = TcpSocket.createConnection(
    {port: options.incomingPort, host: localHost},
    () => {},
  );
  clientIncoming.on('error', function (error) {
    console.log('clientIncoming error:', error);
  });
  clientIncoming.on('data', function (data) {
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

  let clientOutgoing = TcpSocket.createConnection(
    {port: options.outgoingPort, host: localHost},
    () => {},
  );
  clientOutgoing.on('error', function (error) {
    console.log('clientOutgoing error:', error);
  });
  clientOutgoing.on('data', function (data) {
    for (let disconnectedDeviceID in connectedDevices) {
      if (!connectedDevices.hasOwnProperty(disconnectedDeviceID)) {
        continue;
      }

      let disconnectedDeviceName = connectedDevices[disconnectedDeviceID];
      if (disconnectedDeviceName !== undefined) {
        BLEWormhole.SendBuffer(
          disconnectedDeviceName,
          disconnectedDeviceID,
          bleServiceUUID,
          outgoingCharaUUID,
          data,
        );
      }
    }
  });
  BLEWormhole.GenerateDeviceID().then(res => {
    BLEWormhole.CreatServer(bleServiceUUID, connectCharaUUIDs, res);
  });
};
