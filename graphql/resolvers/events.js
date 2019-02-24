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
      createdEvent = transformEvent(result)

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
  }
}
