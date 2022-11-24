const ContenedorMsjsMongo = require("../clases/mensajes/msjsMong")

class MsjsDaoMongo extends ContenedorMsjsMongo {
    constructor(){
        super('mensajes', {
            entities: { type:{} , required:true},
            result:{type:{}, required:true}
        })
    }
    async save (obj){
        await super.save(obj)
    }

    async getAll(){
        const final = [...await super.getAll()]
        if (final.length === 0){
            return 0
        } else{
        return final[0]///cambia a 0
        }
    }
}

module.exports = MsjsDaoMongo;