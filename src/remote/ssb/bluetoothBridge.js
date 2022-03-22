import TcpSocket from 'react-native-tcp-socket';
import { BLEWormhole } from 'react-native-ble-wormhole';

const bleServiceUUID = 'C4FB2349-72FE-1BA2-94D6-1F3CB16311EE'

const incomingCharaUUID = 'D4FB2349-72FE-1BA2-94D6-1F3CB16311EE'
const outgoingCharaUUID = 'E4FB2349-72FE-1BA2-94D6-1F3CB16311EE'
const controlCharaUUID  = 'F4FB2349-72FE-1BA2-94D6-1F3CB16311EE'

const connectCharaUUIDs = [incomingCharaUUID,outgoingCharaUUID,controlCharaUUID]

// let awaitingOutgoingConnection = []

let deviceInfos={}
let deviceID_Name={}

let connectedDevices={}

let deviceProperties = [];

let commandResponseBuffer = [];

let needAddIsEnableCmd = false;

export const bluetoothBridge=function(options){
    var localHost='127.0.0.1';
    console.log('bluetoothBridge init');
    BLEWormhole.ReceiveHandler=(characteristic)=>{
        if(characteristic!=undefined){
            if(characteristic.uuid == controlCharaUUID){
                var jsonString = Buffer.from(characteristic.data).toString();
                var dataCommand = JSON.parse(jsonString);
                if(dataCommand.command=='metaData'){
                    var metaData = dataCommand.arguments.metadata;
                    var errInfo = dataCommand.arguments.error;
                    if(errInfo == undefined){
                        commandResponseBuffer.push({'command':'getMetadata','arguments':{'metaData':metaData,'error':false}})
                    }
                    else{
                        commandResponseBuffer.push({'command':'getMetadata','arguments':{'errorCode':'errorGettingMetadata','error':true,'description':errInfo}})
                    }
                }
                if(dataCommand.command=='incoming'){
                    var deviceID = characteristic.device;
                    var deviceName = deviceID_Name[deviceID];
                    if(deviceName!=undefined){
                        if(deviceName == BLEWormhole.deviceUUID){
    
                        }
                        else{
                            if(connectedDevices[deviceID]==undefined){
                                commandResponseBuffer.push({'command':'connected','arguments':{'remoteAddress':deviceID,'isIncoming':true}})
                                connectedDevices[deviceID]=deviceName;
                            }
                            else{
                                commandResponseBuffer.push({'command':'connectionFailure','arguments':{'remoteAddress':deviceID,'isIncoming':true,'reason':'Already connected.'}})
                                
                            }
                        }
                    }
                }
            }
            else if(characteristic.uuid == incomingCharaUUID){
                clientIncoming.write(characteristic.data);
            }
            else if(characteristic.uuid == outgoingCharaUUID){
                clientOutgoing.write(characteristic.data);
            }
            else{

            }
        }
        else{

        }
    }


    BLEWormhole.DiscoverDeviceHandler=(device)=>{
        if(deviceID_Name[device.deviceID]==undefined){
            deviceID_Name[device.deviceID]=device.name;
        }

        if(deviceInfos[device.name]!=undefined){
            deviceInfos[device.name]=device;
            var deviceProperty = {'remoteAddress':device.deviceID,'displayName':device.name};
            deviceProperties.push(deviceProperty)

            if(connectedDevices[deviceProperty.remoteAddress]==undefined){
                BLEWormhole.Connect(device.deviceID,bleServiceUUID,connectCharaUUIDs)
                .then(res=>{
                    console.log(res);
                    var commandData = {'command':'incoming','arguments':deviceProperty}
                    var jsonString = JSON.stringify(commandData);
                    BLEWormhole.SendBuffer(device.name,device.deviceID,bleServiceUUID,controlCharaUUID,Buffer.from(jsonString));
                })
                .catch(err=>{
                    console.error(err);
                })
            }
            else{
                commandResponseBuffer.push({'command':'connected','arguments':{'remoteAddress':deviceProperty.remoteAddress,'isIncoming':true}})
            }
        }
        
    }

    BLEWormhole.ScanStopHandler=()=>{
        commandResponseBuffer.push({'command':'dicovered','arguments':{'devices':deviceProperties}})
    }

    BLEWormhole.BluetoothStateHandler=(res)=>{
        var bluetoothEnable=false;
        if(res.state=='on'){
            bluetoothEnable=true;
        }

        if(needAddIsEnableCmd){
            commandResponseBuffer.push({'command':'isEnabled','arguments':{'enabled':bluetoothEnable}});
        }
        else{
            commandResponseBuffer.push({'command':'bluetoothState','arguments':{'error':false, 'isEnabled':bluetoothEnable}});
        }
    }

    let clientControll = TcpSocket.createConnection({port:options.controlPort,host:localHost}, () => {
        // Write on the socket
        while(true){
            var commandResponse=commandResponseBuffer.shift();
            if(commandResponse!=undefined){
                var jsonString = JSON.stringify(commandResponse);
                var commandResponseBuffer=Buffer.from(jsonString);
                clientControll.write(commandResponseBuffer);
            }
        }
    });

    clientControll.on('data', function(data) {


        var jsonString = Buffer.from(data).toString();
        var jsonData = JSON.parse(jsonString);
        var command = jsonData.command;

        var dicoveredSeconds = 3;
        if (command == 'connect'){
            var remoteAddress = data.arguments.remoteAddress;

            // awaitingOutgoingConnection.push(remoteAddress);
            
        }
        else if(command == 'discoverDevices'){
            deviceProperties=[];
            BLEWormhole.Scan([bleServiceUUID],dicoveredSeconds);
        }
        else if(command == 'makeDiscoverable'){
        
            BLEWormhole.StartCentral()
            .then(res=>{
                commandResponseBuffer.push({'command':'discoverable','arguments':{'error':false,'discoverableUntil':dicoveredSeconds}})
            })
            .catch(err=>{
                commandResponseBuffer.push({'command':'discoverable','arguments':{'error':true,'errorCode':'appNotVisible','description':err}})
            });
            
        }
        else if(command == 'isEnabled'){

            BLEWormhole.CheckState();
            needAddIsEnableCmd = true;
            
        }
        else if(command == 'startMetadataService'){
            BLEWormhole.StartPeripheral()
            .then(res=>{
                commandResponseBuffer.push({'command':'metadataService','arguments':{'error':false,'availableUntil':-1}})
            })
            .catch(err=>{
                commandResponseBuffer.push({'command':'metadataService','arguments':{'error':true,'errorCode':'errorStarting','description':err}})
            });
        }
        else if(command == 'getMetadata'){
            //ssb-mobile-bluetooth-manager need change
            var remoteAddress = data.arguments.remoteAddress;
            var displayName = data.arguments.displayName;
            BLEWormhole.SendBuffer(displayName,remoteAddress,bleServiceUUID,controlCharaUUID);

        }
        else{

            
        }

    });


    let clientIncoming = TcpSocket.createConnection({port:options.incomingPort,host:localHost}, () => {

    });

    clientIncoming.on('data', function(data) {
        for(let connectedDeviceID in connectedDevices) {
            if(!connectedDevices.hasOwnProperty(connectedDeviceID)) continue;
            
            let connectedDeviceName = connectedDevices[connectedDeviceID]
            if(connectedDeviceName!=undefined){
                BLEWormhole.SendBuffer(connectedDeviceName,connectedDeviceID,bleServiceUUID,incomingCharaUUID,data);
            }
        }
    });

    
    let clientOutgoing = TcpSocket.createConnection({port:options.outgoingPort,host:localHost}, () => {

    });

    clientOutgoing.on('data', function(data) {
        for(let disconnectedDeviceID in connectedDevices) {
            if(!connectedDevices.hasOwnProperty(disconnectedDeviceID)) continue;

            let disconnectedDeviceName = connectedDevices[disconnectedDeviceID];
            if(disconnectedDeviceName!=undefined){
                BLEWormhole.SendBuffer(disconnectedDeviceName,disconnectedDeviceID,bleServiceUUID,outgoingCharaUUID,data);
            }
        }

    });

    BLEWormhole.CreatServer(bleServiceUUID,connectCharaUUIDs);
}

 