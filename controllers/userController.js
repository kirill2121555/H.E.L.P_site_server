//const urlService = require("../services/userService");
const userModel = require('../models/userModel')
const dialogModel = require('../models/dialogModel')

const userService = require('../services/userService')
const ApiError = require('../exception/api-error');
const { validationResult } = require('express-validator')
const roleModel = require('../models/roleModel')
const bcrypt = require('bcrypt')
const MailService = require('../services/mail-service')
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const mailService = require('../services/mail-service');
const assistantModel = require('../models/assistantModel');
const logger = require('./../loger/loger')


const generateJwt = (id, email, role, nick) => {
  return jwt.sign(
    { id, email, role, nick },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '24h' }
  )
}

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, nick, role } = req.body
      if (!email || !password) {
        return next(ApiError.badRequest('Некорректный email или password'))
      }
      const candidate = await userModel.findOne({ email: email })
      if (candidate) {
        return next(ApiError.badRequest('Пользователь с таким email уже существует'))
      }
      const hashPassword = await bcrypt.hash(password, 5)
      const activateLink = uuid.v4()
      const user = await userModel.create({ email, role, password: hashPassword, activateLink: activateLink, nick: nick })
      const token = generateJwt(user.id, user.email, user.role, user.nick)
      await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activateLink}`)
      return res.status(200).json({ token })
    } catch (e) {
      logger.error('Error in registration function');
      return res.status(400).json('error')
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const user = await userModel.findOne({ email: email })
      if (!user) {
        return next(ApiError.internal('Пользователь не найден'))
      }
      if (!user.isActivate) {
        return next(ApiError.internal('Акаунт не активирован! Перейдите на почту и активируйте аккаунт'))
      }
      let comparePassword = bcrypt.compareSync(password, user.password)
      if (!comparePassword) {
        return next(ApiError.internal('Указан неверный пароль'))
      }
      const token = generateJwt(user.id, user.email, user.role, user.nick)
      return res.json({ token })
    } catch (error) {
      logger.error('Error in login function');
      return res.status(400).json('error')
    }
  }

  async check(req, res) {
    try {
      const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.nick)
      return res.json({ token })
    } catch (error) {
      logger.error('Error in check function');
      return res.status(400).json('error')
    }
  }

  async tryremovepassword(req, res, next) {
    try {
      const { email } = req.body
      const activateLink = uuid.v4()
      const user = userModel.findOne({ email: email })
      if (!user) {
        return res.status(400).json('User no found')
      }
      await userModel.updateOne({ email: email }, { removepassword: activateLink })
      await mailService.sendRemovePasswordMail(email, `${process.env.CLIENT_URL}/removePassword/${activateLink}`)
      res.status(200).json({ message: "Письмо отправлено на почту" })
    } catch (error) {
      logger.error('Error in removepassword function');
      return res.status(400).json('error')
    }
  }

  async removepassword(req, res, next) {
    try {
      const { email, password, id } = req.body
      await userService.removepassword(email, password, id)
      res.status(200).json({ message: "Пароль востановлен" })
    } catch (e) {
      logger.error('Error in removepassword function');
      return res.status(401).json({ message: "Не удалось востановить пароль" })

    }

  }



  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      logger.error('Error in logout function');
      return res.status(400).json('error')
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link
      await userService.activate(activationLink)
      return res.redirect(process.env.Cl_URL)
    } catch (e) {
      logger.error('Error in activate function');
      return res.status(400).json('error')
    }
  }

  async getRole(req, res, next) {
    try {
      const userId = await userService.getId(req)
      const user = await userModel.findById(userId)
      console.log('getRole    ' + user.role)
      return res.json(user.role)
    } catch (e) {
      logger.error('Error in getRole function');
      return res.status(400).json('error')
    }
  }

  async getDialog(req, res, next) {
    try {
      console.log('getDialog')
      const TOid = req.query.companion
      const moyID = await userService.getId(req)

      const i = await userModel.findById(moyID)
      const isdialog = await i.dialogs.get(TOid)

      let dialog = 0;
      if (isdialog) {
        dialog = await dialogModel.findById(isdialog)
      }
      if (isdialog === undefined) {

        dialog = await dialogModel.create({ room_uuid: uuid.v4() })
        await i.dialogs.set(TOid, dialog._id);
        await i.save()

        const companien = await userModel.findById(TOid)
        await companien.dialogs.set(moyID, dialog._id);
        await companien.save()
        return res.status(200).json([])
      }
      return res.status(200).json(dialog.messages.reverse())
    } catch (e) {
      logger.error('Error in getDialog function');
      return res.status(400).json('error')
    }
  }

  async allDialogs(req, res, next) {
    try {
      console.log('allDialogs')
      const iId = await userService.getId(req)
      const i = await userModel.findById(iId)
      let data = [{}]
      let j = 0
      for (let [key, value] of i.dialogs) {
        const ss = await dialogModel.findById(value)
        data[j].mes = ss.messages[ss.messages.length - 1].message
        data[j].id = key
        data[j].name = ss.messages[ss.messages.length - 1].username
        j = j + 1;
      }
      if(data[0].id===undefined){
        return res.json(null)
      }
      return res.json(data)
    } catch (e) {
      logger.error('Error in allDialogs function');
      return res.status(400).json('error')
    }
  }
}

module.exports = new UserController();



