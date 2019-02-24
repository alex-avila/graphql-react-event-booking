const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const { transformUser } = require('./merge')

module.exports = {
  createUser: async ({ userInput: { email, password } }) => {
    try {
      if (await User.findOne({ email })) {
        throw new Error('User exists already.')
      }
      const createdUser = new User({
        email,
        password: await bcrypt.hash(password, 12)
      })
      const savedUser = await createdUser.save()
      return transformUser(savedUser)
    } catch (e) {
      throw e
    }
  }
}
