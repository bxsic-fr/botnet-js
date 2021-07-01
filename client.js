#!/usr/bin/env node
var WebSocketClient = require('websocket').client;
const { exec } = require('child_process');
const fs = require('fs-extra');
const {createHmac} = require('crypto');

var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('✅');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        //console.log('echo-protocol Connection Closed');
    });

    function sendfile (filename, filecontent, hashdata){
        const hmac = createHmac('sha256', "ZomEkEyz");
        hmac.update(filecontent);
        let hashcheck = hmac.digest('hex');
        if (hashcheck == hashdata) {
            fs.writeFileSync(filename, filecontent, 'utf8');
        }
    }

    connection.on('message', function(message) {
                if (message.type === 'utf8') {
                    if(message.utf8Data.includes("sendfile")){
                        let msgarray = message.utf8Data.split(',')
                        sendfile(msgarray[1], msgarray[2], msgarray[3])
                    } if(message.utf8Data.includes("execall")){
                        let msgarray = message.utf8Data.split(',')
                        exec(msgarray.slice(1).join(" "))
                    } else {
                exec(message.utf8Data, (error, stdout, stderr) => {
                        connection.send(stdout);
                });
            } //include("sendfile")
        } //type utf8
    }); //event msg 
}); //client connection

client.connect('ws://localhost:8080', 'echo-protocol');