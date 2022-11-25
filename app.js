const express = require("express");
const { Server : Httpserver } = require("http");
const { Server : IOServer } = require("socket.io");
const handlebars = require('express-handlebars')
const {normalize , denormalize , schema} = require("normalizr");
const session = require("express-session");
const mongoose = require("mongoose")
const passport = require("passport");
require('dotenv').config()
const parseArgs = require("minimist");
const { fork } = require('child_process');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const compression = require("compression");

const args = parseArgs(process.argv.slice(2)) 
const Contenedor = require("./clases/productos");
const { options } = require("./options/mariaDB");
const MsjsDaoFs = require("./dao/msjsDaoFs");
const checkAuthentication = require("./auth/auth");
const {signup , login }= require("./controllers/controllers");
const {infoLogger , warnLogger} = require("./logger")
//const MsjsDaoFbs = require("./dao/msjsDaoFbs");
async function connect(){ 
    await mongoose.connect(process.env.MONGO,{serverSelectionTimeoutMS: 5000,})
    return console.log("mongo conectado")};

connect();

const modo = args._[1] == 'Cluster'

const contenedor = new Contenedor(options);
const contenedorMensajes = new MsjsDaoFs();

const autor = new schema.Entity('autores', {} , {idAttribute:'id'});
const mensaje = new schema.Entity('mensajes',{autor:autor},);

const app = express();
const httpServer = new Httpserver(app);
const io = new IOServer(httpServer);


let id = 1;
function getNextId(){
    return id++
}

io.on('connection', async socket => {
    //infoLogger.info('Nuevo cliente conectado!');

   /* contenedor.crearTabla().then((prods) => {
        contenedor.listaproductos().then((prods) => {
          socket.emit("productos", prods);
        })
      })

      socket.on("update", async (data) => {
        await contenedor.guardar(data).then((data) => {
          contenedor.listaproductos().then((productos) => {
            console.log(productos);
            io.sockets.emit("productos", productos);
          })
        })
    });*/

    contenedorMensajes.getAll().then((msjs)=>{
        let denormalizeMsjs;
        if (msjs === 0){
            denormalizeMsjs=[];
        } else{
            denormalizeMsjs = denormalize(msjs.result , [mensaje] , msjs.entities)
        }
        socket.emit('mensajes',  denormalizeMsjs);
    })

    socket.on('nuevoMensaje', async msjs => {
        msjs.id = JSON.stringify(getNextId())
       const mensajesA = await contenedorMensajes.getAll()
        let normalizeMsjs;
        if(mensajesA === 0){
            normalizeMsjs = normalize([msjs], [mensaje])
        } else {
            const denormalizeMsjsA = denormalize(mensajesA.result , [mensaje] , mensajesA.entities)
            const mensajeDesN = [...denormalizeMsjsA,msjs]
            normalizeMsjs = normalize(mensajeDesN, [mensaje]) 
        }
        await contenedorMensajes.save(normalizeMsjs).then((msjs)=>{
            contenedorMensajes.getAll().then((msjs)=>{
                const denormalizeMsjs = denormalize(msjs.result , [mensaje] , msjs.entities)
                io.sockets.emit('mensajes', denormalizeMsjs);
            })
        })
    })
});


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('views'))
app.use(compression())

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
        layoutsDir:__dirname + '/views/layouts',
        partialsDir:__dirname + '/views/partials'
    })
);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(session({
    secret: 'shhhhhhhhhhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 600000
    }
}))

app.use(passport.initialize());
app.use(passport.session());

//Rutas /////////////////

//Home//////////////////
app.get('/' , checkAuthentication , (req,res) => {
    const {url , method} = req
    infoLogger.info(`Ruta ${method} ${url} recibida`)
    res.render('logged', {nombre:req.user.username})
    
});
//Sign up///////
app.get('/signup', (req,res) => {
    const {url , method} = req
    infoLogger.info(`Ruta ${method} ${url} recibida`)
    res.render('signUp.hbs')
});
app.post('/signup', passport.authenticate('signup', {failureRedirect:'/errorSignUp'}), signup);
app.get('/errorSignUp', (req,res) => {
    const {url , method} = req
    infoLogger.info(`Ruta ${method} ${url} recibida`)
    res.render('errorSignUp')
})

//log in////////
app.get('/login' , (req,res) => {
    if(req.isAuthenticated()){
        res.redirect('/')
    } else {
    const {url , method} = req
    infoLogger.info(`Ruta ${method} ${url} recibida`)
    res.render('formLogin')
}
});

app.post('/login' , passport.authenticate('login', {failureRedirect:'/errorLogIn'}),  login); 
app.get('/errorLogIn', (req,res) => {
    const {url , method} = req
    infoLogger.info(`Ruta ${method} ${url} recibida`)
    res.render('errorLogIn')
})
//log out//////////
app.get('/logout' , (req,res) => {
    let nombre = req.user.username
    req.logout(err => {
    if (!err) {
        const {url , method} = req
        infoLogger.info(`Ruta ${method} ${url} recibida`)
        res.render('logout', {nombre:nombre}) 
         
    } else {
        res.redirect('/login')
    }}); 
})

// info/////////
app.get('/info', (req, res) => {
    const {url , method} = req
    infoLogger.info(`Ruta ${method} ${url} recibida`)
    //console.log(process.argv.slice(2), process.platform,process.version,process.memoryUsage().rss,process.execPath,process.pid,process.cwd())
	res.json({
		argumentos_de_entrada: process.argv.slice(2),
		nombre_sistema_operativo: process.platform,
		version_node: process.version,
		memoria_total_reservada: process.memoryUsage().rss,
		path_de_ejecucion: process.execPath,
		process_id: process.pid,
		carpeta_del_proyecto: process.cwd()
	});
});
// randoms ////////
app.get('/api/randoms', (req, res) => {
    const {url , method} = req
    infoLogger.info(`Ruta ${method} ${url} recibida`)
	const forked = fork('./controllers/randoms.js');

	let { cantidad } = req.query;
	let obj = {};
	cantidad
		? forked.send({ cantidad, obj })
		: forked.send({ cantidad: 500000000, obj });
	forked.on('message', msg => res.json(msg));
});

//Inexistentes///////////
app.get('*', ( req , res ) => {
    const {url , method} = req
    warnLogger.warn(`Ruta ${method} ${url} no está implementada`)
    res.send(`Ruta ${method} ${url} no está implementada`)
})

const PORT = process.env.PORT || 8080

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
    const connectedServer = httpServer.listen(PORT, () => {
        console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}-PID ${process.pid}`)
    })
    connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
    
  }
