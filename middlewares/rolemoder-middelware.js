const userModel = require("../models/userModel");
const userService = require("../services/userService");

module.exports = async function (req, res, next){
    try {
       const userid=await userService.getId(req);
       const user=await userModel.findById(userid)
       if(user.role=='MODERATOR'){
        return next()
       }
       return res.status(401).json({message: "Нет доступа"})
    } catch (e) {
        return res.status(401).json({message: "Ошибка"})
    }
};
