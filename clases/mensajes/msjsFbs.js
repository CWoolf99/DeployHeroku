const admin = require("firebase-admin");
const {errorLogger} = require("../../logger")

const serviceAccount= require("../../public/proyecto-backend-24c56-firebase-adminsdk-wl3rh-84a973e766.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)});
      const db = admin.firestore();

class MsjsFbs {
    constructor(collection){
        this.collection=db.collection(collection)
    }
    async save(obj) {
        try {
            let objeto = await this.collection.doc('xcTstLxigFw6gOCQDUEv').update({entities:obj.entities , result:obj.result})
            console.log ( {...obj, id: objeto.id})
        } 
        catch (err) {
            errorLogger.error('error al guardar en firebase')
            return undefined
        }
    };

    async getAll () {
        try {
            let result = [];
            let contenido = await this.collection.get()
            contenido.docs.forEach(doc => {
                result.push({ ...doc.data() })
            })
            return result
            }
        catch (err) {
            errorLogger.error('error en la lectura')
        }
    };
}

module.exports=MsjsFbs;