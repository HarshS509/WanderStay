import { eachDayOfInterval } from "date-fns";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { Cabin, Booking, Setting, Guest } from "./db";
export async function getCabin(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }

    const cabin = await Cabin.findById(id);
    if (!cabin) {
      throw new Error("Cabin not found");
    }

    return cabin;
  } catch (error) {
    notFound();
    if (error.message === "Invalid ID format") {
      throw new Error("Provided ID is not valid. Please check the ID format.");
    } else if (error.message === "Cabin not found") {
      throw new Error("No cabin found with the given ID.");
    } else {
      throw new Error(
        "An error occurred while retrieving the cabin. Please try again later."
      );
    }
  }
}

export async function getCabinPrice(id) {
  const cabin = await Cabin.findById(id, "regularPrice discount");
  if (!cabin) {
    throw new Error("Cabin not found");
  }
  return cabin;
}
export async function getCabins() {
  const cabins = await Cabin.find({});
  return cabins;
}
export async function getGuest(mail) {
  try {
    const guest = await Guest.findOne({ email: mail });
    if (!guest) {
      // console.log(`Guest not found for email: ${mail}`);
      return null;
    }
    return guest;
  } catch (error) {
    console.error("Error in getGuest:", error);
    throw new Error("Failed to retrieve guest");
  }
}
export async function getBooking(id) {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new Error("Booking not found");
  }
  // console.log(booking);
  return booking;
}
export async function getBookings(guestId) {
  try {
    const bookings = await Booking.find({ guestId })
      .populate("cabinId", "name image")
      .sort("startDate");
    // console.log(bookings);
    return bookings;
  } catch (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
}

export async function getBookedDatesByCabinId(cabinId) {
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
export async function getSettings() {
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
export async function getCountries() {
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
export async function createGuest(newGuest) {
  try {
    const guest = new Guest(newGuest);
    const savedGuest = await guest.save();
    // console.log("New guest created:", savedGuest);
    return savedGuest;
  } catch (error) {
    console.error("Error in createGuest:", error);
    throw new Error("Guest could not be created");
  }
}
export async function createBooking(newBooking) {
  try {
    const booking = new Booking(newBooking);
    const savedBooking = await booking.save();
    // console.log(savedBooking);
    return savedBooking;
  } catch (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }
}
export async function updateGuest(id, updatedFields) {
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
export async function updateBooking(id, updatedFields) {
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
export async function deleteBooking(id) {
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
