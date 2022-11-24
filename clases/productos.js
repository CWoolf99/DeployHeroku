const knex = require('knex');
class Contenedor {
    constructor(options) {
        this.knex = knex(options);
    }
    crearTabla() {
        return this.knex.schema.hasTable('productos').then((exists) => {
          if (!exists) {
            return this.knex.schema.createTable("productos", (table) => {
              table.string("nombre", 50).notNullable();
              table.float("precio").notNullable();
              table.string("imagen").notNullable();
              table.increments("id").primary();
            })
          }
        });
    
      };

    guardar(producto) {
        const productos = this.listaproductos();
        const id = productos.length;
        const nuevoproducto = {...producto, id: id}
        return this.knex("productos").insert(nuevoproducto)
    }

    listaproductos() {
        return this.knex("productos").select("*")
    }

    buscarproducto(id) {
        return this.productos.find((valor) => valor.id == id )
    }

    actualizaproducto(id, producto) {
        if(this.productos.find((valor) => valor.id == id)){
        this.productos = this.productos.filter((producto) => producto.id != id)
        const productoA = {...producto, id: id} 
        this.productos.push(productoA)
        return productoA;
        } else{
            return undefined
        }
    }

    eliminaproducto(id) {
        return this.knex("productos").del("*")
    }
}
module.exports = Contenedor;