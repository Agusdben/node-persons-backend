const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('creating new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('psw', 10)
    const user = new User({ username: 'Agusdben', passwordHash })

    await user.save()
  })

  test('works as expected creating a fresh username', async () => {
    const usersDB = await User.find({})
    const usersAtStart = userDB.map(user => user.toJSON())

    const newUser = {
      username: 'agusnew',
      name: 'Agustin',
      password: '1234'
    }

    // await
  })
})
