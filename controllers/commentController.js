const userModel = require('../models/userModel');
const userService = require('../services/userService');
const commentModel = require('../models/commentModel')
const pointHelpModel = require('../models/pointHelpModel');
const markModel = require('../models/markModel');
const logger = require('./../loger/loger')
const { getId } = require('../services/userService');
const blogModel = require('../models/blogModel');

class CommentController {
    
    async CreateComment(req, res) {
        try {
            const { text, timeCreate, typepost } = req.body
            const idPH = req.body.id;
            const id = await userService.getId(req)
            const user = await userModel.findById(id)
            const newcomment = await commentModel.create({
                user: user._id,
                usernick: user.nick,
                text: text,
                timeOfCreation: timeCreate
            })
            let postcomment
            switch (typepost) {
                case 'pointHelp':
                    postcomment = await pointHelpModel.findById(idPH)
                    break;
                case 'blogpost':
                    postcomment = await blogModel.findById(idPH)
                    console.log(postcomment)
                    break;
            }
            await postcomment.comment.push(newcomment._id)
            await postcomment.save();
            return res.status(200).json({ message: "Коментарий создан" })
        } catch (error) {
            logger.error('Error in CreateComment function');
            return res.status(400).json('problem with create comment')
        }
    }

    async sendAnswer(req, res) {
        try {
            const { commentId, text } = req.body;
            const id = await userService.getId(req)
            const user = await userModel.findById(id)
            const comment = await commentModel.findById(commentId)
            const asn = await commentModel.create({
                user: id,
                usernick: user.nick,
                text: text,
            })
            await comment.answers.push(asn._id)
            comment.save()
        } catch (e) {
            logger.error('Error in sendAnswer function');
            return res.status(400).json('problem with create Answer on comment')
        }
    }

    async GetComments(req, res) {
        try {
            const idPH = req.query.id;
            const typepost = req.query.type;
            let postcomment
            switch (typepost) {
                case 'pointHelp':
                    postcomment = await pointHelpModel.findById(idPH)
                    break;
                case 'blogpost':
                    postcomment = await blogModel.findById(idPH)
                    break;
            }
            const comments = []
            let d
            for (let i = 0; i < postcomment.comment.length; i++) {
                d = await commentModel.findById(postcomment.comment[i])
                let arr = []
                if (d?.answers.length > 0) {
                    for (let j = 0; j < d.answers.length; j++) {
                        const aaa = await commentModel.findById(d.answers[j])
                        let a = {}
                        a.usernick = aaa.usernick
                        a.timeOfCreation = aaa.timeOfCreation
                        a.text = aaa.text
                        arr.push(a)
                    }
                }
                comments.push([d, arr])
            }
            return res.status(200).json(comments.sort((x, y) => y.timeOfCreation - x.timeOfCreation))
        } catch (error) {
            logger.error('Error in GetComments function');
            return res.status(400).json('problem with get comment')
        }
    }

    async grade(req, res) {
        try {
            const iduser = await userService.getId(req)
            const id = req.params.id
            const { mark } = req.body
            const a = await markModel.findOne({ pointHelpId: id, userId: iduser })
            if (!a) {
                const a = await markModel.create({ pointHelpId: id, userId: iduser })
            }
            const proshlayMark = a.mark
            const pH = await pointHelpModel.findById({ _id: id })
            if (proshlayMark === mark) {
                --pH[proshlayMark]
                a.mark = 0
                await a.save()
                await pH.save()
                return res.status(200).json('nagata ta ge knopka')
            }
            mark === 'like' ? a.mark = 'like' : a.mark = 'dislike'
            await a.save()
            if (pH[proshlayMark] !== 0) {
                --pH[proshlayMark]
                await pH.save()
            }
            ++pH[mark]
            await pH.save()
            return res.status(200).json(a.mark)
        } catch (error) {
            logger.error('Error in grade function');
            return res.status(400).json('error')
        }
    }

    async getmark(req, res) {
        try {
            const iduser = await userService.getId(req)
            const id = req.params.id
            const a = await markModel.findOne({ pointHelpId: id, userId: iduser })
            if (a) {
                return res.status(200).json(a.mark)
            }
            const aa = await markModel.create({ pointHelpId: id, userId: iduser })
            return res.status(200).json(aa.mark)
        } catch (error) {
            logger.error('Error in getmark function');
            return res.status(400).json('error')
        }
    }
}

module.exports = new CommentController();



