const { eachDayOfInterval } = require("date-fns");
const mongoose = require("mongoose");
const { Cabin, Booking, Setting, Guest } = require("./db");
async function getCabin(id) {
  const cabin = await Cabin.findById(id);
  if (!cabin) {
    throw new Error("Cabin not found");
  }
  return cabin;
}

async function getCabinPrice(id) {
  const cabin = await Cabin.findById(id, "regularPrice discount");
  if (!cabin) {
    throw new Error("Cabin not found");
  }
  return cabin;
}
async function getCabins() {
  const cabins = await Cabin.find({});
  return cabins;
}
async function getGuest(mail) {
  const guest = await Guest.findOne({ email: mail });
  if (!guest) {
    throw new Error("Guest not found");
  }
  return guest;
}
async function getBooking(id) {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new Error("Booking not found");
  }
  console.log(booking);
  return booking;
}
async function getBookings(guestId) {
  try {
    const bookings = await Booking.find({ guestId })
      .populate("cabinId", "name image")
      .sort("startDate");
    console.log(bookings);
    return bookings;
  } catch (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
}

async function getBookedDatesByCabinId(cabinId) {
  try {
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Find all bookings for the cabinId
    const bookings = await Booking.find({
      cabinId,
      $or: [
        { startDate: { $gte: today } }, // Start date greater than or equal to today
        { status: "checked-in" }, // Or status is 'checked-in'
      ],
    })
      .select("startDate endDate")
      .exec();

    // Extract booked dates from bookings
    const bookedDates = bookings.flatMap((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    });

    return bookedDates;
  } catch (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
}
async function getSettings() {
  try {
    const settings = await Setting.findOne().exec();

    if (!settings) {
      throw new Error("Settings not found");
    }
    return settings;
  } catch (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }
}
async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag"
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}
async function createGuest(newGuest) {
  try {
    const guest = new Guest(newGuest);
    const savedGuest = await guest.save();
    console.log(savedGuest);
    return savedGuest;
  } catch (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }
}
async function createBooking(newBooking) {
  try {
    const booking = new Booking(newBooking);
    const savedBooking = await booking.save();
    console.log(savedBooking);
    return savedBooking;
  } catch (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }
}
async function updateGuest(id, updatedFields) {
  try {
    const updatedGuest = await Guest.findByIdAndUpdate(id, updatedFields, {
      new: true, // Return the updated document
      runValidators: true, // Run validators to ensure data validity
    });

    if (!updatedGuest) {
      throw new Error("Guest not found");
    }

    return updatedGuest;
  } catch (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
}
async function updateBooking(id, updatedFields) {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(id, updatedFields, {
      new: true, // Return the updated document
      runValidators: true, // Run validators to ensure data validity
    });

    if (!updatedBooking) {
      throw new Error("Booking not found");
    }

    return updatedBooking;
  } catch (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
}
async function deleteBooking(id) {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      throw new Error("Booking not found");
    }

    return deletedBooking;
  } catch (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
}
