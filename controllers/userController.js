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


const generateJwt = (id, email, role, nick, avatar) => {
  return jwt.sign(
    { id, email, role, nick, avatar },
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
      const token = generateJwt(user.id, user.email, user.role, user.nick, user.avatar)
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
      const token = generateJwt(user.id, user.email, user.role, user.nick, user.avatar)
      return res.json({ token })
    } catch (error) {
      logger.error('Error in login function');
      return res.status(400).json('error')
    }
  }

  async check(req, res) {
    try {
      const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.nick, req.user.avatar)
      return res.json({ token })
    } catch (error) {
      logger.error('Error in check function');
      return res.status(400).json('error')
    }
  }

  async tryremovepassword(req, res) {
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

  async removepassword(req, res) {
    try {
      const { email, password, id } = req.body
      await userService.removepassword(email, password, id)
      res.status(200).json({ message: "Пароль востановлен" })
    } catch (e) {
      logger.error('Error in removepassword function');
      return res.status(401).json({ message: "Не удалось востановить пароль" })

    }

  }



  async logout(req, res) {
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

  async activate(req, res) {
    try {
      const activationLink = req.params.link
      await userService.activate(activationLink)
      return res.redirect(process.env.Cl_URL)
    } catch (e) {
      logger.error('Error in activate function');
      return res.status(400).json('error')
    }
  }

  async getRole(req, res) {
    try {
      const userId = await userService.getId(req)
      const user = await userModel.findById(userId).lean()
      return res.json(user.role)
    } catch (e) {
      logger.error('Error in getRole function');
      return res.status(400).json('error')
    }
  }

  async getDialog(req, res) {
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

  async allDialogs(req, res) {
    try {
      const iId = await userService.getId(req)
      const i = await userModel.findById(iId)
      let data = []
      let j = 0
      for (let [key, value] of i.dialogs) {
        let ob = {}
        const ss = await dialogModel.findById(value)
        if (ss) {
          ob.id = key
          if (ss.messages.length > 0) {
            if (ss.messages[ss.messages.length - 1].message.startsWith('data:image/')) {
              ob.mes = 'Картинка'
            } else {
              ob.mes = ss.messages[ss.messages.length - 1].message
            }
            ob.name = ss.messages[ss.messages.length - 1].username
          }
          else {
            ob.mes = 'Cooбщений еще нет'
            ob.name = '-'
          }
          data[j] = ob
          ++j;
        }
      }
      data.shift()
      return res.json(data)
    } catch (e) {
      logger.error('Error in allDialogs function');
      return res.status(400).json('error')
    }
  }

  async ProfileInformation(req, res) {
    try {
      const userId = await userService.getId(req)
      const data = await userModel.findById(userId, 'email nick').lean();
      return res.status(200).json(data)
    } catch (e) {
      logger.error('Error in ProfileInformation function');
      return res.status(400).json('error')
    }
  }

  async changeNick(req, res) {
    try {
      const userId = await userService.getId(req)
      const { nick } = req.body
      const data = await userModel.findByIdAndUpdate(userId, { nick: nick });
      return res.status(200).json(data)
    }
    catch (e) {
      logger.error('Error in changeNick function');
      return res.status(400).json('error')
    }
  }

  async changeEmail(req, res) {
    try {
      const userId = await userService.getId(req)
      const { email } = req.body
      const data = await userModel.findByIdAndUpdate(userId, { email: email });
      return res.status(200).json(data)
    } catch (e) {
      logger.error('Error in changeEmail function');
      return res.status(400).json('error')
    }
  }

  async changePassword(req, res) {
    try {
      const userId = await userService.getId(req)
      const { password, passwordtwo } = req.body
      if (password === passwordtwo) {
        const hashPassword = await bcrypt.hash(password, 5)
        const data = await userModel.findByIdAndUpdate(userId, { password: hashPassword });
        return res.status(200).json(data)
      }
      return res.status(400).json('Passwords do not match')
    } catch (e) {
      logger.error('Error in changePassword function');
      return res.status(400).json('error')
    }
  }

  async changeAvatar(req, res) {
    try {
      const userId = await userService.getId(req)
      const { avatar } = req.body
      const data = await userModel.findByIdAndUpdate(userId, { avatar });
      return res.status(200).json(data)
    } catch (e) {
      logger.error('Error in changeAvatar function');
      return res.status(400).json('error')
    }
  }

  async Generalchat(req, res) {
    try {
      const generalchat = await dialogModel.findOne({ room_uuid: process.env.IdGeneralChat })
      if (!generalchat) {
        return res.status(200).json('Chat could not be found error')
      }
      return res.status(200).json(generalchat.messages.reverse())
    } catch (e) {
      logger.error('Error in Generalchat function');
      return res.status(400).json('error')
    }
  }

  async generalchatinformation(req, res) {
    try {
      const generalchat = await dialogModel.findOne({ room_uuid: process.env.IdGeneralChat })
      if (!generalchat) {
        return res.status(200).json('Chat could not be found error')
      }
      let ob = {}
      ob.id = generalchat._id
      if (generalchat.messages.length > 0) {
        if (generalchat.messages[generalchat.messages.length - 1].message.startsWith('data:image/')) {
          ob.mes = 'Картинка'
        } else {
          ob.mes = generalchat.messages[generalchat.messages.length - 1].message
        }
        ob.name = generalchat.messages[generalchat.messages.length - 1].username
      }
      else {
        ob.mes = 'Cooбщений еще нет'
        ob.name = '-'
      }
      return res.status(200).json(ob)
    } catch (e) {
      logger.error('Error in Generalchat function');
      return res.status(400).json('error')
    }
  }

}
module.exports = new UserController();



