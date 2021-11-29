const mongoose = require('mongoose')
const { server } = require('../index')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { api } = require('./helpers')

describe('creating new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('psw', 10)
    const user = new User({ username: 'Agusdben', passwordHash })

    await user.save()
  })

  test('works as expected creating a fresh username', async () => {
    const usersDB = await User.find({})
    const usersAtStart = usersDB.map(user => user.toJSON())

    const newUser = {
      username: 'agusnew',
      name: 'Agustin',
      password: '1234'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersDBAfter = await User.find({})
    const usersAtEnd = usersDBAfter.map(user => user.toJSON())

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
