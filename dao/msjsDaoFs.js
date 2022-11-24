const ContenedorMensajes = require("../clases/mensajes/msjs")

class MsjsDaoFs extends ContenedorMensajes{
    constructor(){
        super('./mensajes.txt')
    }

    async save (obj){
        await super.save(obj)
    }

    async getAll (){
        const final = [await super.getAll()]
        //console.log(final)
        if (final[0].entities === undefined){
            return 0
        } else{
        return final[0]///cambia a 0
        }
    }
}

module.exports= MsjsDaoFs;