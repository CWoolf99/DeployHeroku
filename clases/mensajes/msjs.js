const {promises:fs} = require('fs');
const {errorLogger} = require("../../logger") 
class ContenedorMensajes{
    constructor( archivo ){
        this.archivo=archivo;
    }


    async save(obj) { 
        try {
            await fs.writeFile(`${this.archivo}`, JSON.stringify(obj))
            console.log('se guardo exitosamente')
        } 
        catch (err) {

            errorLogger.error('error al guardar')
        }
    }

    async getAll () {
        try {

            const contenido = await fs.readFile(`${this.archivo}`, 'utf-8')
            //console.log(`se leyó el texto exitosamente` , JSON.parse(contenido))
            return JSON.parse(contenido); 
        }
        catch (err) {
            errorLogger.error('error en la lectura')
        }
    };
}


module.exports = ContenedorMensajes; 

