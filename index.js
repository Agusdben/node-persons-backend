const express = require('express')
const logger = require('./loggerMiddleware')
const cors = require('cors')

const app = express()

app.use(express.json())

app.use(logger)

app.use(cors())

let persons = [
  {
    id: 2,
    name: 'John',
    lastname: 'Johnson',
    age: 32
  },
  {
    id: 1,
    name: 'Mat',
    lastname: 'Robinson',
    age: 22
  },
  {
    id: 3,
    name: 'Jose',
    lastname: 'Mendez',
    age: 52
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Home page</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) res.json(person)
  else res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const person = req.body

  const ids = persons.map(person => person.id)
  const id = Math.max(...ids) + 1

  const newPerson = {
    id,
    name: person.name,
    lastname: person.lastname,
    age: person.age
  }
  // problemas con app.use(express.json()) dado que no le hace parse al body
  persons = [...persons, newPerson]

  res.json(newPerson)
})

app.use((req, res) => {
  res.status(400).json({
    error: 'Not Found'
  })
})

const PORT = process.env.PORT || 3001 // lo necesita heroku
app.listen(PORT, () => {
  console.log('server on port ' + PORT)
})
