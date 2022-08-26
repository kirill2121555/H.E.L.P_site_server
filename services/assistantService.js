const uuid = require('uuid')
var path = require('path');
let fs = require('fs');


class assistantService {
    async renameFile(name) {
        const arr = name.split(".");
        const randomname = uuid.v4()
        const newName = randomname + '.' + arr[arr.length - 1]
        const a = path.resolve(__dirname + './../' + '\images\\')
        const aa=a + '\\' + name
        const bb=a + '\\' + newName
        fs.rename(aa, bb, err => {
            if (err) {
                return name
            }
            console.log('Файл успешно переименован');
        });
        return newName
    }
}
module.exports = new assistantService();
