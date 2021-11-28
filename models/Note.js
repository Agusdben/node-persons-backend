const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// el nombre 1er parametro en singular, 2do parametro el schema
const Note = model('Note', noteSchema)

module.exports = Note

// const note = new Note({
//   content: 'is amazing',
//   date: new Date(),
//   important: true
// })

// // cuidado porque antes se usaban callbacksm, ahora son promesas
// note.save()
//   .then(result => {
//     // debuelve el objeto de la base de datos
//     console.log(result)
//     mongoose.connection.close()
//   })
//   .catch(err => {
//     console.error(err)
//   })

// Note.find({}).then(result => {
//   console.log(result)
//   mongoose.connection.close()
// })
