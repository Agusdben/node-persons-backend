require('dotenv').config() // para leer las varables
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Home page</h1>')
})

// note controllers
app.use('/api/notes', notesRouter)

// user controllers
app.use('/api/users', usersRouter)

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT // lo necesita heroku
const server = app.listen(PORT, () => {
  console.log('server on port ' + PORT)
})

module.exports = { app, server }
