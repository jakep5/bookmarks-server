const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')

const { bookmarks } = require('../store')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter 
    .route('/bookmarks')
    .get((req, res) => {
        res
            .json(bookmarks)
    })
    .post(bodyParser, (req, res) => {
        const { title, url, description, rating } = req.body;

        if(!title) {
            res
                .status(400)
                .send('Invalid data')
        }

        if(!url) {
            res
                .status(400)
                .send('Invalid data')
        }

        if(!description) {
            res
                .status(400)
                .send('Invalid data')
        }

        if(!rating) {
            res
                .status(400)
                .send('Invalid data')
        }

        if( rating <= 0 || rating > 5) {
            res
                .status(400)
                .send('Rating must be between 1 and 5')
        }

        const id = uuid();

        const bookmark = {
            id, 
            title,
            url,
            description,
            rating
        }

        bookmarks.push(bookmark)

        logger.info(`Bookmark with ${id} created`);

        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${id}`)
            .json(bookmark)
    })