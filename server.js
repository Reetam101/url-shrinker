const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const UrlModel = require('./models/Url');

dotenv.config({
    path: './config/config.env'
})

connectDB();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', async (req, res) => {
    //const shortUrl = await UrlModel.findOne({ fullUrl: req.body.longUrl })
    res.render('index', { shortUrl: null });
})

app.post('/', async (req, res) => {
    try {
        const shortUrl = await UrlModel.findOne({ fullUrl: req.body.longUrl }).lean();
        if (shortUrl) {
            res.render('index', { shortUrl: shortUrl })
            console.log(shortUrl);
        }
        else {
            await UrlModel.create({ fullUrl: req.body.longUrl })
            const shortUrl = await UrlModel.findOne({ fullUrl: req.body.longUrl }).lean();
            res.render('index', { shortUrl: shortUrl });
            console.log(shortUrl);
        }
    } catch (err) {
        console.log(err);
    }
})

app.get('/:shortUrl', async (req, res) => {
    const url = await UrlModel.findOne({ shortUrl: req.params.shortUrl });
    res.redirect(url.fullUrl);
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));