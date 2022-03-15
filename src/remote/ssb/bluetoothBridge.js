import BLEWormhole from 'react-native-ble-wormhole/src/BLEWormhole';
import TcpSocket from 'react-native-tcp-socket';

const bleServiceUUID = 'C4FB2349-72FE-1BA2-94D6-1F3CB16311EE'

const incomingCharaUUID = 'D4FB2349-72FE-1BA2-94D6-1F3CB16311EE'
const outgoingCharaUUID = 'E4FB2349-72FE-1BA2-94D6-1F3CB16311EE'
const controlCharaUUID  = 'F4FB2349-72FE-1BA2-94D6-1F3CB16311EE'

const connectCharaUUIDs = [incomingCharaUUID,outgoingCharaUUID,controlCharaUUID]

let awaitingOutgoingConnection = []

let deviceInfos={}

let deviceProperties = [];

let commandResponseBuffer = [];

const bluetoothBridge=function(options){
    
    BLEWormhole.DiscoverDeviceHandler=(device)=>{
        if(deviceInfos[device.name]!=undefined){
            deviceInfos[device.name]=device;

            deviceProperties.push({'remoteAddress':device.deviceID,'displayName':device.name})

            BLEWormhole.Connect(device.deviceID,bleServiceUUID,connectCharaUUIDs)
            .then(res=>{
                console.log(res);
            })
            .catch(err=>{
                console.error(err);
            })

        }
        
    }

    BLEWormhole.ScanStopHandler=()=>{
        commandResponseBuffer.push({'command':'dicovered','arguments':{'devices':deviceProperties}})
    }

    let client = TcpSocket.createConnection(options, (err,stream) => {
        // Write on the socket

    });

    client.on('data', function(data) {
        var command = data.command;
        if (command == 'connect'){
            var remoteAddress = data.arguments.remoteAddress;

            awaitingOutgoingConnection.push(remoteAddress);
            
        }
        else if(command == 'discoverDevices'){
            deviceProperties=[];
            BLEWormhole.Scan([bleServiceUUID],3);
        }
        else if(command == 'makeDiscoverable'){
            deviceProperties=[];
            BLEWormhole.Scan([bleServiceUUID],3);
        }
        else{

        }


        console.log('message was received', data);


    });



    BLEWormhole.CreatServer(bleServiceUUID,connectCharaUUIDs);

    client.write(window.ssb.id);
}