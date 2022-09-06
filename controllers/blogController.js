const blogModel = require('../models/blogModel');
const userModel = require('../models/blogModel');
const userService = require('../services/userService');
const logger = require('./../loger/loger')
const myCache = require('./../cache/cache')


class BlogController {
    async postblogpost(req, res) {
        try {
            const id = await userService.getId(req)
            const { title, text, namefile } = req.body;
            const asist = await blogModel.create({
                title,
                text,
                author: id,
                //picture: 
            })
            return res.status(200).json({ message: "Пост добавлен" })
        } catch (e) {
            logger.error('Error in newblogpost function');
            return res.status(400).json('Error')
        }
    }

    async getblogpost(req, res) {
        try {
            let post
            if (myCache.has('blogpost')) post = myCache.get('blogpost')
            else {
                post = await blogModel.find({}, { title: 1, text: 1, _id: 1, datacreate: 1 }).lean()
                myCache.set(`blogpost`, post)
            }
            return res.status(200).json(post)
        } catch (e) {
            logger.error('Error in getblogpost function');
            return res.status(400).json('Error')
        }
    }

    async getoneblogpost(req, res) {
        try {
            const id = req.query.id;
            const post = await blogModel.findById(id).lean()
            return res.status(200).json(post)
        } catch (e) {
            logger.error('Error in getoneblogpost function');
            return res.status(400).json('Error')
        }
    }
    

}

module.exports = new BlogController();