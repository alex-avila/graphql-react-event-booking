const Event = require('../../models/event')
const User = require('../../models/user')
const { dateToString } = require('../../helpers/date')

const transformEvent = event => ({
  ...event._doc,
  date: dateToString(event.date),
  creator: getUser(event.creator)
})

const transformUser = user => ({
  ...user._doc,
  password: null
})

const transformBooking = booking => ({
  ...booking._doc,
  event: getEvent(booking.event),
  user: getUser(booking.user),
  createdAt: dateToString(booking.createdAt),
  updatedAt: dateToString(booking.updatedAt)
})

const getEvents = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    return events.map(event => transformEvent(event))
  } catch (e) {
    throw e
  }
}

const getEvent = async eventId => {
  try {
    const event = await Event.findById(eventId)
    return transformEvent(event)
  } catch (e) {
    throw e
  }
}

const getUser = async userId => {
  try {
    const user = await User.findById(userId)
    return {
      ...transformUser(user),
      createdEvents: getEvents(user.createdEvents)
    }
  } catch (e) {
    throw e
  }
}

exports.transformEvent = transformEvent
exports.transformUser = transformUser
exports.transformBooking = transformBooking
exports.getEvent = getEvent
exports.getUser = getUser