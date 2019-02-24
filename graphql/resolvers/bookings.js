const Booking = require('../../models/booking')
const { transformBooking, transformEvent } = require('./merge')

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find()
      return bookings.map(booking => transformBooking(booking))
    } catch (e) {
      throw e
    }
  },
  bookEvent: async ({ eventId }) => {
    try {
      const booking = new Booking({
        event: eventId,
        user: '5c724314da46612266be3d80'
      })
      const result = await booking.save()
      return transformBooking(result)
    } catch (e) {
      throw e
    }
  },
  cancelBooking: async ({ bookingId }) => {
    try {
      const booking = await Booking.findById(bookingId).populate('event')
      if (!booking) {
        throw new Error('Booking not found.')
      }
      const { event } = booking
      await Booking.findByIdAndDelete(bookingId)
      return transformEvent(event)
    } catch (e) {
      throw e
    }
  }
}
