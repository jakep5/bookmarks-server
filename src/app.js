require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const BookmarksService = require('./bookmarks-service')


const app = express()
const jsonParser = express.json()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
/*         logger.error(`Unauthorized request to path ${req.path}`) */
        return res.status(401).json({error:'Unauthorized request'})
    }

    next();
})

app.get('/', (req, res) => {
    res.send('Hello, boilerplate!')
})

app.get('/bookmarks', (req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getAllBookmarks(knexInstance)
        .then(bookmarks => {
            res.json(bookmarks)
        })
        .catch(next)
})

app.get('/bookmarks/:bookmark_id', (req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getById(knexInstance, req.params.bookmark_id)
        .then(bookmark => {
            if(!bookmark) {
                return res.status(404).json({
                    error: { message: 'Bookmark does not exist' }
                })
            }
            res.json(bookmark)
        })
        .catch(next)
})

app.post('/', jsonParser, (req, res, next) => {
    const { title, url, description, rating } = req.body
    const newBookmark = { title, url, description, rating }

    for (const [key, value] of Object.entries(newBookmark)) {
        if(value == null) {
            return res.status(400).json({
                error: { message: `Missing '${key}' in request body`}
            })
        }
    }

    BookmarksService.insertBookmark(
        req.app.get('db'),
        newBookmark
    )
        .then(bookmark => {
            res
                .status(201)
                .location(`/bookmarks/${bookmark.id}`)
                json(bookmark)
        })
        .catch(next)
})

app.delete('/bookmarks/:bookmark_id', (req, res, next) => {
    BookmarksService.deleteBookmark(
        req.app.get('db'),
        req.params.bookmark_id
    )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
} )

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error'} }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app