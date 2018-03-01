const crc8 = require ('./uartCommCRC8');

const dgram = require('dgram');
const dsComm = dgram.createSocket("udp4");
dsComm.bind(8888);

let discoveredDS = []; // Put in all discovered DS.

function sendCommand(ip, command){
    let header = [0xFC, (command.length + 1)];
    let data = header.concat(command);
    data.push(crc8.calculate(data));
    //printHex(data)
    let message = new Buffer(data);
    dsComm.on('listening', function(){
        dsComm.setBroadcast(true);
        dsComm.send(message, 0, message.length, 8888, ip);
    });
}

function isObject (a) {
	return (!!a) && (a.constructor === Object);
};


dsComm.on('message', (msg, rinfo) => {

    console.log(`server got message from ${rinfo.address}:${rinfo.port}`);
    console.log('Start of pckt:  0x' + msg[0].toString(16));
    console.log('pckt length:      ' + msg[1]);
    console.log('Group Address:  0x' + msg[2].toString(16));
    console.log('Flag hex:       0x' + msg[3].toString(16));
    console.log('Command Upper:  0x' + msg[4].toString(16));
    console.log('Command Lower:  0x' + msg[5].toString(16));
    console.log('Hardware Type:    ' + msg[msg.length - 1]);
    
    if (msg[3] == 96) {

        if ( msg[msg.length - 1] == 1){ console.log('Detected DreamScreen HD');};
        if ( msg[msg.length - 1] == 2){ console.log('Detected DreamScreen 4K');};
        if ( msg[msg.length - 1] == 3){ console.log('Detected SideKick');};
        // Cleanup code above and add else. and test.... (unsupported device).


        //Adding HD or 4K
        const devicename = subBufferString(6,16,msg);
        if (!isObject(discoveredDS[devicename])){ //If the device is "new"
            discoveredDS[devicename] = newDsObject(devicename);
        }

        discoveredDS[devicename].groupname = subBufferString(6,16,msg);
        discoveredDS[devicename].groupnumber = msg[38];
        discoveredDS[devicename].mode = msg[39];
        discoveredDS[devicename].brightness = msg[40];
        discoveredDS[devicename].ambientr = msg[46];
        discoveredDS[devicename].ambientg = msg[47];
        discoveredDS[devicename].ambientb = msg[48];
        discoveredDS[devicename].ambientscene = msg[68];
        discoveredDS[devicename].hdmiinput = msg[79];
        discoveredDS[devicename].hdminame1 = subBufferString(81,16,msg);
        discoveredDS[devicename].hdminame2 = subBufferString(97,16,msg);
        discoveredDS[devicename].hdminame3 = subBufferString(113,16,msg);
        discoveredDS[devicename].hdmiactive = msg[135];
        discoveredDS[devicename].lastseen = Date.now();
        discoveredDS[devicename].reachable = true;
    }
    console.log('');

});  

function newDsObject(devicename){
    return {
        devicetype:0,
        devicename,
        groupname:"",
        groupnumber:0,
        mode:0,
        brightness:0,
        ambientr:0,
        ambientg:0,
        ambientb:0,
        ambientscene:0,
        hdmiinput:0,
        hdminame1:"",
        hdminame2:"",
        hdminame3:"",
        hdmiactive:"",
        lastseen:0,
        reachable:false
    }
}

function subBufferString(_startIndex, _length, _data){
    let data = "";
    for (var i=_startIndex; i<_startIndex+_length; i++) {
        data = data + String.fromCharCode(_data[i]);
    }
    return data;
}

function printHex(data){
    let strData = '';
    for (i in data){
        let hx='0'+data[i].toString(16);
        strData = strData + hx.substring(hx.length - 2);
    }
    console.log ('Sending data: '+strData);
}

function ds_Discover() {
    sendCommand('255.255.255.255', [0xFF,0x30,0x01,0x0a]);
}

function ds_Video(ip) {
    sendCommand(ip, [0xFF,0x11,0x03,0x01,0x01]);
}

ds_Discover();
//ds_Video('10.2.1.223');

//
//  sendCommand( IP, [A, B, C, D, E] );
//
//  IP  Ipaddress       i.e. 10.2.1.1
//  A:  Group Address,  i.e. 0x00
//  B:  flags?!         i.e. 0x11
//  C:  command upper   i.e. 0x03
//  D:  command lowwer  i.e. 0x01
//  E:  payload         i.e. 0x03
//

// Sends mode Video
sendCommand('10.2.1.223', [0x00,0x11,0x03,0x01,0x01]);

// Sends mode Music
//sendCommand('10.2.1.1', [0x00,0x11,0x03,0x01,0x02]);

// Sends mode Ambient
//sendCommand('10.2.1.223', [0x00,0x11,0x03,0x01,0x01]);

//sendCommand('10.2.1.223', [0x00,0x11,0x03,0x01,0x01]);

//sendCommand('10.2.1.223', [0x00,0x11,0x03,0x02,0x64]);
// Sends mode Sleep
//sendCommand('10.2.1.1', [0x00,0x11,0x03,0x01,0x00]);

// Low Brightness (20) -> 0x14
// sendCommand('10.2.1.1', [0x00,0x11,0x03,0x02,0x14]);

// High Brightness (100) -> 0x64
 sendCommand('10.2.1.223', [0x00,0x11,0x03,0x02,0x64]);

/* Ambient Mode Type
0x03    0x08    0x00 - RGB Color
                0x01 - Scene

Ambient Scene
0x03    0x0D    0x00 - Random Color
                0x01 - Fireside
                0x02 - Twinkle
                0x03 - Ocean
                0x04 - Rainbow
                0x05 - July 4th
                0x06 - Holiday
                0x07 - Pop
                0x08 - Enchanted Forest

HDMI Input
0x03    0x20    0x00 - Channel 1
                0x01 - Channel 2
                0x02 - Channel 3
 */
sendCommand('10.2.1.223', [0x00,0x11,0x03,0x20,0x00]);

