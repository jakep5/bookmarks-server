const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../src/logger')

const { bookmarks } = require('../src/store')

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

bookmarkRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const { id } = req.params;

        const bookmark = bookmarks.find(b => b.id == id)

        if(!bookmark) {
            logger.error(`Bookmark with id ${id} not found`)
            return res
                .status(404)
                .send('Bookmark not found')
        }

        res.json(bookmark)
    })
    .delete((req, res) => {
        const { id } = req.params;

        const bookmarkIndex = bookmarks.findIndex(b => b.id == id)

        if(bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${id} could not be found`)
            return res
                .status(404)
                .send('Bookmark not found')
        }

        bookmarks.splice(bookmarkIndex, 1);

        logger.info(`Bookmark with id ${id} successfully deleted.`)

        res
            .status(204)
            .end();
    })

module.exports = bookmarkRouter