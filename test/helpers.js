const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)

const initialNotes = [
  {
    content: 'test 1',
    date: new Date(),
    important: true
  },
  {
    content: 'test 2',
    date: new Date(),
    important: false
  },
  {
    content: 'test 3',
    date: new Date(),
    important: true
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  console.log({ response })
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

module.exports = { initialNotes, api, getAllContentFromNotes }
