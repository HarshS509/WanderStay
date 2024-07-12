const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://harshsojitra222:2PNCdrpIE2WjR31b@cluster0.qizer0g.mongodb.net/abc"
);

// Define the schema for Cabins
const cabinSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
  },
  maxCapacity: {
    type: Number,
    required: true,
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const guestSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  nationalId: {
    type: String,
  },
  countryFlag: {
    type: String,
  },
});
const settingSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now,
  },

  minBookingLength: {
    type: Number,
    default: 7,
  },
  maxBookingLength: {
    type: Number,
    default: 30,
  },
  maxGuestsPerBooking: {
    type: Number,
    default: 10,
  },
  breakfastPrice: {
    type: Number,
    default: 10,
  },
});
const bookingSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  numNights: {
    type: Number,
  },
  numGuests: {
    type: Number,
  },
  cabinPrice: {
    type: Number,
  },
  extrasPrice: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
  status: {
    type: String,
    default: "pending",
  },
  hasBreakfast: {
    type: Boolean,
    default: false,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  observations: {
    type: String,
  },
  cabinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cabin",
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guest",
  },
});
// Create the model from the schema
const Cabin = mongoose.model("Cabin", cabinSchema);

const Guest = mongoose.model("Guest", guestSchema);

const Setting = mongoose.model("Setting", settingSchema);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = { Cabin, Booking, Setting, Guest };
