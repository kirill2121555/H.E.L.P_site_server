const assistantService = require("../services/assistantService");
const userModel = require('../models/userModel')
const assistantModel = require('../models/assistantModel')
const userService = require('./../services/userService')
const jwt = require('jsonwebtoken');
const fileMideeleware = require("../middlewares/file-mideeleware");
const logger = require('./../loger/loger')


const find = (pointHelp, text) => {
  const a = []
  for (let i = 0; i < pointHelp.length; i++) {
    if (pointHelp[i].alltext.includes(text)) {
      a.push(pointHelp[i])
    }
  }
  return a
}


class AssistantController {



  async addAt(req, res, next) {
    try {
      await userService.getId(req)
      if (req.file) {
        return res.status(200).json(req.file)
      }
    } catch (e) {
      logger.error('Error in addAt function');
      return res.status(400).json('Error')
    }

  }

  async addAsistant(req, res, next) {
    try {
      const id = await userService.getId(req)
      const { name, email, phone, city, description, title, pictur } = req.body;
      const newName = undefined;
      if (pictur !== undefined) {
        newName = await assistantService.renameFile(pictur)
      }
      const asist = await assistantModel.create({
        name: name,
        email: email,
        phone: phone,
        city: city,
        description: description,
        title: title,
        alltext: email + phone + city + description + title,
        picture: newName,
        autorid:id
      })
      await asist.save();
      const user = await userModel.findById(id)
      await user.assist.push(asist._id)
      await user.save()
      return res.status(200).json({ message: "Пост добавлен" })
    } catch (e) {
      logger.error('Error in addAsistant function');
      return res.status(400).json('Error')
    }
  }


  async getAsistant(req, res, next) {
    try {
      const { text } = req.query
      const asist = await assistantModel.find().sort({ datecreate: -1 });
      if (text === '') return res.status(200).json(asist)
      if (text !== '') return res.status(200).json(find(asist, text.toLowerCase()))
    }
    catch (e) {
      logger.error('Error in getAsistant function');
      return res.status(400).json('Error')
    }
  }


  async getOneAsistant(req, res, next) {
    try {
      const id = req.params.id;
      const assistant = await assistantModel.findById(id);
      return res.status(200).json(assistant)
    } catch (e) {
      logger.error('Error in getOneAsistant function');
      return res.status(400).json('Error')
    }
  }

  async getAsistPerson(req, res, next) {
    try {
      const id = await userService.getId(req)

      const a = []
    
      const user = await userModel.findById(id)

      for (let i = 0; i < user.assist.length; i++) {
        const asist = await assistantModel.findById(user.assist[i])
        if (asist != null) {
          a.push(asist)
        }
      }
      return res.status(200).json(a)
    } catch (e) {
      logger.error('Error in getAsistPerson function');
      return res.status(400).json('Error')
    }
  }

  async deleteassist(req, res, next) {
    try {
      const idnh = req.body;
      const id = await userService.getId(req)
      await assistantModel.findByIdAndDelete(idnh.id)
      const user = await userModel.findById(id)
      for (let i = 0; i < user.assist.length; i++) {
        if (user.assist[i] == idnh.id) {
          user.assist[i] = undefined
          await user.save();
        }
      }
      await user.save();
      return res.status(200).json({ message: "Пост удален" })
    } catch (e) {
      logger.error('Error in deleteassist function');
      return res.status(400).json('Error')
    }
  }

  async updateOneAsistant(req, res, next) {
    try {
      const id = req.params.id
      const { name, phone, description, city, email, title } = req.body
      const as = await assistantModel.findByIdAndUpdate(id, {
        name: name,
        phone: phone,
        description: description,
        city: city,
        email: email,
        title: title,
        alltext: email + phone + city + description + title,
      })
      await as.save()
      return res.status(200).json({ message: "Пороль обновлен" })
    } catch (e) {
      logger.error('Error in updateOneAsistant function');
      return res.status(400).json('Error')
    }
  }
}

module.exports = new AssistantController();