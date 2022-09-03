
const qr = require('qrcode')

class commonFunction {
code=async(link) =>{
    try {
        return await qr.toDataURL(link)
    } catch (err) {
        return error(err)
    }
}
}
module.exports = new commonFunction();
