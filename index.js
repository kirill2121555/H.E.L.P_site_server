const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const path = require('path')
const express = require('express')
const router = require('../routers/router.js')

const cors = require('cors')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/error-middleware')
const { config } = require('dotenv')
require('dotenv').config()



const app = express()

app.use(express.json())
app.use('/images',express.static('images'))

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: '' }));



app.use('/', router)
app.set('views', path.join(__dirname, 'views'));
app.use(errorMiddleware);
const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://root:root@cluster0.xlabe.mongodb.net/?retryWrites=true&w=majority')
        app.listen(PORT, () => console.log('cool'))

    } catch (e) {
        console.log(e)
    }
}


start()