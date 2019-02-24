const bcrypt = require('bcryptjs')
const Event = require('../../models/event')
const User = require('../../models/user')

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    return events.map(event => ({
      ...event._doc,
      date: new Date(event.date).toISOString(),
      creator: user(event.creator)
    }))
  } catch (e) {
    throw e
  }
}

const user = async userId => {
  try {
    const user = await User.findById(userId)
    return { ...user._doc, createdEvents: events(user.createdEvents) }
  } catch (e) {
    throw e
  }
}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      return events.map(event => ({
        ...event._doc,
        date: new Date(event.date).toISOString(),
        creator: user(event.creator)
      }))
    } catch (e) {
      throw e
    }
  },
  createEvent: async ({ eventInput: { title, description, price, date } }) => {
    try {
      const event = new Event({
        title,
        description,
        price: +price,
        date: new Date(date),
        creator: '5c724314da46612266be3d80'
      })
      let createdEvent
      const result = await event.save()
      createdEvent = {
        ...result._doc,
        date: new Date(result.date).toISOString(),
        creator: user(result.creator)
      }

      const creator = await User.findById('5c724314da46612266be3d80')
      if (!creator) {
        throw new Error('User not found.')
      }
      creator.createdEvents.push(event)
      await creator.save()
      return createdEvent
    } catch (e) {
      throw e
    }
  },
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
      return { ...savedUser._doc, password: null }
    } catch (e) {
      throw e
    }
  }
}
