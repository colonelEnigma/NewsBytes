const express = require('express');
const router = express.Router();
const URLS = require('../models/urls');
const { nanoid } = require("nanoid");

router.get('/', async (req, res) => {
    const shortUrls = await URLS.find();
    res.render('index', { shortUrls: shortUrls });
});

router.post('/create', async (req, res) => {
    const { mainURL } = req.body;
    if (!mainURL) {
        //send an error to user
        res.status(400).send('incorrect parameter');
    } else {
        const ID = nanoid();

        //check if ID already exists
        const idExists = await URLS.findOne({ shortUrl: ID });
        if (idExists) {
            return res.status(409).send('error while creating short URL. TRY AGAIN!')
        }

        //check if url already exists then create new shortURL
        const urlExists = await URLS.findOne({ originalUrl: mainURL });
        if (urlExists) {
            //update the shortURL
            try {
                const doc = await URLS.findOneAndUpdate({ originalUrl: mainURL }, { shortUrl: ID })
                res.send(doc);
            } catch (error) {
                res.status(500).send('error while creating short url');
            }
        } else {
            //create a new entry in collection
            const URL = new URLS({
                originalUrl: mainURL,
                shortUrl: ID
            })
            try {
                const doc = await URL.save();
                res.redirect('/');
            } catch (error) {
                res.status(400).send(err)
            }
        }
    }
});


router.get('/:id', async (req, res) => {
    const shortUrl = await URLS.findOne({ shortUrl: req.params.id })
    if (shortUrl == null) return res.status(404).send('no url found');

    //check if url is already clicked;
    if (shortUrl.visits > 0) {
        return res.status(404).send('URL expired');
    }

    //increment the click and save
    shortUrl.visits++
    shortUrl.save()

    res.redirect(shortUrl.originalUrl);
});

module.exports = router;