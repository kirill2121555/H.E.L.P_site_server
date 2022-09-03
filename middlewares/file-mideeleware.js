const multer=require('multer')
const moment =require('moment')

const storage = multer.diskStorage ({
    destination: (req,file,cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        const filename=file.originalname
        console.log('filenameeeeee!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!+=======+++====     ',filename)
        cb(null,filename)
    },
});

const types=['image/png','image/jpeg','image/jpg']

const fileFilter=(req,file,cb)=>{
    if(types.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
module.exports=multer({storage,fileFilter});
