const {faker} = require('@faker-js/faker')
const express = require('express')
faker.locale='es'

let id = 1;
function subirId(){
    return id++
}
function generarProducto(id){
    return {
        id,
        nombre:faker.commerce.product(),
        imagen:faker.image.image(),
        precio:faker.commerce.price()
        }
}

function crearProds(cant){
    const productos=[]
    for(let i=0;1<cant;i++){
        productos.push(generarProducto(subirId()))
    }
}
const app = express()

app.get('/api/productos-test', (req,res)=>{
    const productos= crearProds(5)
    listaProductos(productos).then(html => {
        document.getElementById('listaProds').innerHTML=html
        res.send(console.log('productos generados'))
    })
})

function listaProductos(prods) {
    return prods.map(prods => {
        return (`
            <div>
                <b style="color:blue;">${prods.nombre}</b>
                [<span style="color:brown;">${prods.imagen}</span>] :
                <i style="color:green;">${prods.precio}</i>
            </div>
        `)
    }).join(" ");
};


app.use(express.static('index.html'))

const PORT =8080
const connectedServer = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))