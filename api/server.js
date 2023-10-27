const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const cors = require('cors');
const validUrl = require('valid-url');
const router = express.Router();
const app = express();
const shortid = require('shortid');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
    .connect(
        'mongodb+srv://url-shortener:SNxzxDiCgi26l2gj@cluster0.ez2m4zc.mongodb.net/',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log('Database connected!'))
    .catch((err) => console.log(err));

// Get all shorten urls
router.get('', async (req, res) => {
    const shortUrls = await ShortUrl?.find();
    res.send(200, {
        shortUrls,
    });
});

// Delete an url by id from MongoDB
router.delete('/api/shorturl/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await ShortUrl.findByIdAndRemove(id);

        if (!result) {
            return res.status(404).json({ message: 'Object not found' });
        }

        return res.json({ message: 'Object removed successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred' });
    }
});

// Redirect url
router.get('/:url', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ shortUrl: req.params.url });

    if (req.params.url !== null && shortUrl) {
        res.redirect(shortUrl.fullUrl);
    } else {
        res.status(404).send('Invalid URL');
    }
});

// Short url
router.post('/api/short', async (req, res) => {
    if (validUrl.isUri(req.body.url)) {
        // valid URL
        try {
            const shortID = shortid.generate();
            let expirationDate = new Date();
            expirationDate.setMinutes(
                expirationDate.getMinutes() + req.body.expirationTime
            );
            await ShortUrl.create({
                fullUrl: req.body.url,
                shortUrl: shortID,
                expiresAfter: expirationDate,
            });

            res.status(200).send({
                response: shortID,
            });
        } catch (e) {
            console.log(e);
            res.status(404).send('Error occurred while storing URL.');
        }
    } else {
        res.status(404).send('Invalid URL');
    }
});

app.use('/', router);

app.listen(process.env.PORT || 3001);
console.log(`App is listening at ${process.env.PORT || 3001}`);
