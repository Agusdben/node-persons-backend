const notesRouter = require('express').Router()

const Note = require('../models/Note')

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})

notesRouter.get('/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id)
    .then(note => {
      if (note) return res.json(note)
      else res.status(404).end()
    })
    .catch(err => next(err))
})

notesRouter.put('/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  // {new: true} es para devolver el nuevo valor
  // si lo omitimos, nos devolvería lo que encuntra
  // por la id que hemos ingresado
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => { res.json(result) })
    .catch(err => next(err))
})

notesRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    await Note.findByIdAndDelete(id)
    res.status(204).end()
  } catch (e) { res.status(400).json({ error: 'Id not finded' }) }
})

notesRouter.post('/', async (req, res, next) => {
  const { body } = req
  const { content, important } = body

  if (!content) {
    return res.status(400).json({
      error: 'Required "content" field is missing'
    })
  }

  const newNote = new Note({
    content,
    date: new Date(),
    important
  })
  try {
    const savedNote = await newNote.save()
    res.json(savedNote)
  } catch (e) { next(e) }
})

module.exports = notesRouter
