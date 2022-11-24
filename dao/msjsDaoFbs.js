const MsjsFbs = require("../clases/mensajes/msjsFbs")

class MsjsDaoFbs extends MsjsFbs {
    constructor(){
        super('mensajesDesafio')
    }
    async save(obj){
        await super.save(obj)
    }

    async getAll(){
        const final = await super.getAll()
        if (final[0].entitioes === undefined){
            return 0
        } else{
        return final[0]
        }
    }
}

module.exports=MsjsDaoFbs;