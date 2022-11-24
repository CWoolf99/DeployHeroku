const socket = io.connect();

/*const agregarProducto = document.getElementById('formProductos')
agregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        nombre: agregarProducto[0].value,
        precio: agregarProducto[1].value,
        imagen: agregarProducto[2].value
    }
    socket.emit('update', producto);
    agregarProducto.reset()
});

socket.on('productos', productos => {
    listaProductos(productos).then(html => {
        document.getElementById('productos').innerHTML = html
    })
});

function listaProductos(prods) {
    return fetch('/lista.hbs')
        .then(respuesta => respuesta.text())
        .then(texto => {
            const listahbs = Handlebars.compile(texto);
            const lista = listahbs({ prods })
            return lista
        })
}*/

const formMensaje = document.getElementById('formMensajes')
formMensaje.addEventListener('submit', e => {
    e.preventDefault()
    const data = { 
        autor: {id: formMensaje[0].value, 
        nombre: formMensaje[1].value,
        apellido: formMensaje[2].value,
        edad: formMensaje[3].value,
        alias: formMensaje[4].value,
        avatar: formMensaje[5].value},
        texto: formMensaje[6].value,
        fyh: new Date().toLocaleString()
    }
    socket.emit('nuevoMensaje', data);
    formMensaje.reset()
})

socket.on('mensajes', (mensajes) => {
    const html = listaMensajes(mensajes)
    //document.getElementsByid('')
    document.getElementById('mensajes').innerHTML = html;
})

function listaMensajes(mensajes) {
    return mensajes.map(mensaje => {
        return (`
            <div>
                <b style="color:blue;">${mensaje.autor.id}</b>
                [<span style="color:brown;">${mensaje.fyh}</span>] :
                <i style="color:green;">${mensaje.texto}</i>
            </div>
        `)
    }).join(" ");
};

