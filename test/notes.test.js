const mongoose = require('mongoose')
const { server } = require('../index')

const Note = require('../models/Note')
const { initialNotes, api, getAllContentFromNotes } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  // paralelo, el orden en el que se añaden, no necesariamente es el mismo orden que el initialNotes
  // const notesObjects = initialNotes.map(note => new Note(note))
  // const promises = notesObjects.map(note => note.save())
  // await Promise.all(promises)

  // secuencial, aseguramos que el orden sea el mismo que initialNotes
  for (const note of initialNotes) {
    const noteObjecte = new Note(note)
    await noteObjecte.save()
  }
})

describe('GET all note', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two notes', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('first note is about test 1', async () => {
    const { contents } = await getAllContentFromNotes()

    expect(contents).toContain('test 1')
  })
})

// se puede ejecutar test 1 a 1 en en package json en la parte de scripts, especificamente en el de test deberiamos
// agregar al final de la linea "tests/notes.test.js". Otra forma seria ejecutar "npm run test -- -t 'first note is about test 1'"
// el titulo no debe ser exacto sino que podrais poner notas y haria todas las que tengan notas en el titulo

describe('POST note', () => {
  test('a valid note can be added', async () => {
    const newNote = {
      content: 'se viene lo shido',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('note without content is not added', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('DELETE note', () => {
  test('a note can be deleted', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const { contents, response: secondResponse } = await getAllContentFromNotes()

    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)

    expect(contents).not.toContain(noteToDelete.content)
  })

  test('a note that do not exist can not be deleted', async () => {
    await api
      .delete('/api/notes/5115')
      .expect(400)

    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
