const userModel = require("../models/userModel");
const bcrypt = require('bcrypt')
const uuid = require('uuid');
const mailService = require("./mail-service");
const { sendActivationMail } = require("./mail-service");
const tokenService = require('../services/token-service')
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exception/api-error');
const roleModel = require('../models/roleModel')
const jwt = require('jsonwebtoken');



class UserService {

    async registration(email, password) {
        const candidate = await userModel.findOne({ email })
        if (candidate) {
            throw new ApiError.BadRequest('User whis this email registreteg on this site before')
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activateLink = uuid.v4()
        const userRole = await roleModel.findOne({ value: 'USER' })
        const user = await userModel.create({ email, password: hashPassword, activateLink, roles: [userRole.value] })
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activateLink}`)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({ ...UserDto })
        await tokenService.SaveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async activate(activateonLink) {
        const user = await userModel.findOne({ activateLink: activateonLink })
        if (!user) {
            throw new ApiError.BadRequest('Necoreknai ssilka aktivacii')
        }
        user.isActivate = true;
        await user.save();
    }

    async removepassword(email, password, id) {
        try {
            const user = await userModel.findOne({ email: email })
            if (!user) {
                throw 'Necoreknai ssilka aktivacii'
            }
            if (id !== user.removepassword) {
                throw 'Necoreknai ssilka aktivacii'
            }
            user.password = await bcrypt.hash(password, 5)
            await userModel.updateOne({ email: email }, { removepassword: '' })
            await user.save();
            return
        } catch (e) {
            console.log(e)
        }
    }

    async login(email, password) {
        const user = await userModel.findOne({ email: email })
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неправильный пароль')
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({ ...userDto });

        await tokenService.SaveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnavthorizedError();
        }
        const userData = await tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnavthorizedError();
        }
        const user = await userModel.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({ ...userDto });

        await tokenService.SaveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto }
    }

    async getAllUsers() {
        const users = await userModel.find();
        return users;
    }

    async getId(req) {
        try {
            const token = req.headers.authorization.split(' ')[1] 
            if (!token) {
                return res.status(401).json({message: "Не авторизован"})
            }
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            req.user = decoded
            const id = req.user.id
            return id
        }
        catch (e) {
            console.log('error')
        }
    }
}
module.exports = new UserService();