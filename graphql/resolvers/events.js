const Event = require('../../models/event')
const User = require('../../models/user')
const { transformEvent } = require('./merge')

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      return events.map(event => transformEvent(event))
    } catch (e) {
      throw e
    }
  },
  createEvent: async (
    { eventInput: { title, description, price, date } },
    req
  ) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const event = new Event({
        title,
        description,
        price: +price,
        date: new Date(date),
        creator: req.userId
      })
      let createdEvent
      const result = await event.save()
      createdEvent = transformEvent(result)

      const creator = await User.findById(req.userId)
      if (!creator) {
        throw new Error('User not found.')
      }
      creator.createdEvents.push(event)
      await creator.save()

      return createdEvent
    } catch (e) {
      throw e
    }
  }
}
