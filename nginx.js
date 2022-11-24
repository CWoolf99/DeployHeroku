const express = require("express");
require('dotenv').config()
const parseArgs = require("minimist");
const { fork } = require('child_process');
const cluster = require('cluster');

const app = express();
const args = parseArgs(process.argv.slice(2)) 
const PORT = args._[0] || 8080
const modo = args._[1] == 'Cluster'
app.get('/api/randoms', (req, res) => {
	const forked = fork('./controllers/randoms.js');

	let { cantidad } = req.query;
	let obj = {};
	cantidad
		? forked.send({ cantidad, obj })
		: forked.send({ cantidad: 500000000, obj });
	forked.on('message', msg => res.send(JSON.stringify(msg)+`Port=${PORT}`));
});



if(modo && cluster.isPrimary) {
    console.log(`Número de procesadores: ${numCPUs}`)
    console.log(`PID MASTER ${process.pid}`)
  
    for(let i=0; i<numCPUs; i++) {
        cluster.fork()
    }
  
    cluster.on('exit', worker => {
        console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })
  }
  else {
    const connectedServer = app.listen(PORT, () => {
        console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}-PID ${process.pid}`)
    })
    connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
    
  }