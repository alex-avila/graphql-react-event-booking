const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error('User does not exist!')
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      throw new Error('Password is incorrect')
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'somesupersecretkey',
      {
        expiresIn: '1h'
      }
    )
    return {
      userId: user.id,
      token,
      tokenExpiration: 1
    }
  }
}
