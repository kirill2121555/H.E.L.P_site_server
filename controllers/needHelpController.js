const assistantService = require("../services/assistantService");
const needHelpModel = require('../models/needHelpModel')
const assistantModel = require('../models/assistantModel');
const userService = require("../services/userService");
const userModel = require("../models/userModel");
const logger = require('./../loger/loger')


const find = (pointHelp, text) => {
  const a = []
  for (let i = 0; i < pointHelp.length; i++) {
    if (pointHelp[i].name.includes(text)) {
      a.push(pointHelp[i])
    }
  }
  return a
}

class AssistantController {

  async addNeedHelp(req, res, next) {
    try {
      const id = await userService.getId(req)
      const { name, secondName, phone, city, listThings, description } = req.body;
      const asist = await needHelpModel.create({
        name: name,
        secondName: secondName,
        phone: phone,
        city: city,
        listThings: listThings,
        description: description,
        alltext: description + listThings + city + phone + secondName + name
      })
      if (!asist) {
        return res.status(400).json({ message: "не удалост создать " })
      }
      asist.save();
      const user = await userModel.findById(id)
      await user.needhelp.push(asist._id)
      await user.save()
      return res.status(200).json({ message: "Пост добавлен" })
    } catch (e) {
      logger.error('Error in addNeedHelp function');
      return res.status(400).json({ message: "Не удалость  добавить пост" })
    }
  }

  async updatepost(req, res, next) {
    try {
      const id = req.params.id
      const { name, phone, description, listThings, city, secondName } = req.body
      const nh = await needHelpModel.findByIdAndUpdate(id, {
        name: name,
        phone: phone,
        description: description,
        listThings: listThings,
        city: city,
        secondName: secondName,
        alltext: description + listThings + city + phone + secondName + name,
      })
      await nh.save()
      return res.status(200).json({ message: "Пост обновлен" })
    } catch (e) {
      logger.error('Error in updatepost function');
      return res.status(400).json({ message: "Не удалось обновить пост" })

    }
  }


  async getAllNeedHelp(req, res, next) {
    try {
      const { text } = req.query
      let allNeedHelp = await needHelpModel.find().sort({ datecreate: -1 });
      if (text === '') return res.status(200).json(allNeedHelp)
      if (text !== '') return res.status(200).json(find(allNeedHelp, text.toLowerCase()))
    }
    catch (e) {
      logger.error('Error in getAllNeedHelp function');
      return res.status(400).json('Error')
    }
  }

  async getNeedHelpPerson(req, res, next) {
    try {
      const id = await userService.getId(req)
      const a = []
      const user = await userModel.findById(id)
      for (let i = 0; i < user.needhelp.length; i++) {
        const nh = await needHelpModel.findById(user.needhelp[i])
        if (nh != null) {
          a.push(nh)
        }
      }
      return res.status(200).json(a)
    } catch (error) {
      logger.error('Error in getNeedHelpPerson function');
      return res.status(400).json('error')
    }
  }

  async getOneNeedHelp(req, res, next) {
    try {
      const id = req.params.id;
      const OneNeedHelp = await needHelpModel.findById(id);
      return res.status(200).json(OneNeedHelp)
    } catch (e) {
      logger.error('Error in getOneNeedHelp function');
      return res.status(400).json('error')
    }
  }

  async deleteneedhelp(req, res, next) {
    try {
      const idnh = req.body;
      const id = await userService.getId(req)
      await needHelpModel.findByIdAndDelete(idnh.id)
      const user = await userModel.findById(id)
      for (let i = 0; i < user.needhelp.length; i++) {
        if (user.needhelp[i] == idnh.id) {
          user.needhelp[i] = undefined
          await user.save();
        }
      }
      await user.save();
      return res.status(200).json({ message: "Пост удален" })
    } catch (e) {
      logger.error('Error in deleteneedhelp function');
      return res.status(400).json('error')

    }
  }
}

module.exports = new AssistantController();