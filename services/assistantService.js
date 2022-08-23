const uuid = require('uuid')

class assistantService {
    async renameFile(name) {
        let fs = require('fs');
        console.log('nameee   '+name)
        const arr = name.split(".");
        const randomname = uuid.v4()
        console.log(randomname)
        const newName = randomname +'.'+ arr[arr.length - 1]
        fs.rename('/testtask/site/server/images/'+name, '/testtask/site/server/images/'+newName, err => {
            if (err) throw err;
            console.log('Файл успешно переименован');
        });
        return newName
    }
}
module.exports = new assistantService();
