const express = require('express')
const { config } = require('dotenv')
require('dotenv').config()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const path = require('path')

const router = require('./routers/router')

const cors = require('cors')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/error-middleware')


const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use('/images',express.static('images'))




app.get('/', function (req, res) {
    res.send('Hello World')
  })
app.use('/api', router)
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