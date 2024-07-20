import { eachDayOfInterval, startOfDay } from "date-fns";
import prisma from "./db"; // Import the Prisma client
export async function createGuest(newGuest) {
  try {
    const guest = await prisma.guest.create({
      data: newGuest,
    });
    return guest;
  } catch (error) {
    console.error("Error in createGuest:", error);
    throw new Error("Guest could not be created");
  }
}
export async function getGuest(email) {
  try {
    const guest = await prisma.guest.findUnique({
      where: { email },
    });

    if (!guest) {
      return null;
    }

    return guest;
  } catch (error) {
    console.error("Error in getGuest:", error);
    throw new Error("Failed to retrieve guest");
  }
}

export async function getCabin(id) {
  try {
    // Ensure the ID is in the correct format. Prisma does not require this, but you might want to validate the ID format manually if needed.
    // Assuming 'id' is a string and should be a valid UUID or integer, adjust validation as necessary.
    if (typeof id !== "string" || id.trim() === "") {
      throw new Error("Invalid ID format");
    }

    // Fetch the cabin from the database
    const cabin = await prisma.cabin.findUnique({
      where: { id: id }, // Adjust this if your ID field name is different
    });

    if (!cabin) {
      throw new Error("Cabin not found");
    }

    return cabin;
  } catch (error) {
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
  try {
    // Ensure the ID is in the correct format. Prisma doesn't require this validation, but you might want to add it for safety.
    if (typeof id !== "string" || id.trim() === "") {
      throw new Error("Invalid ID format");
    }

    // Fetch the cabin with specific fields using Prisma's `findUnique` method
    const cabin = await prisma.cabin.findUnique({
      where: { id: id },
      select: {
        regularPrice: true,
        discount: true,
      },
    });

    if (!cabin) {
      throw new Error("Cabin not found");
    }

    return cabin;
  } catch (error) {
    if (error.message === "Invalid ID format") {
      throw new Error("Provided ID is not valid. Please check the ID format.");
    } else if (error.message === "Cabin not found") {
      throw new Error("No cabin found with the given ID.");
    } else {
      throw new Error(
        "An error occurred while retrieving the cabin price. Please try again later."
      );
    }
  }
}
export async function getCabins() {
  try {
    // Fetch all cabins from the database
    const cabins = await prisma.cabin.findMany();

    return cabins;
  } catch (error) {
    throw new Error(
      "An error occurred while retrieving the cabins. Please try again later."
    );
  }
}
export async function getBooking(id) {
  try {
    // Ensure the ID is in the correct format. This check is optional but can help validate the ID before querying.
    if (typeof id !== "string" || id.trim() === "") {
      throw new Error("Invalid ID format");
    }

    // Fetch the booking record by ID
    const booking = await prisma.booking.findUnique({
      where: { id: id }, // Adjust this if your ID field name is different
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    return booking;
  } catch (error) {
    if (error.message === "Invalid ID format") {
      throw new Error("Provided ID is not valid. Please check the ID format.");
    } else if (error.message === "Booking not found") {
      throw new Error("No booking found with the given ID.");
    } else {
      throw new Error(
        "An error occurred while retrieving the booking. Please try again later."
      );
    }
  }
}
export async function getBookings(guestId) {
  try {
    // Fetch bookings for a specific guest, including related cabin data
    const bookings = await prisma.booking.findMany({
      where: { guestId: guestId }, // Filter bookings by guestId
      include: {
        cabin: {
          // Adjust this to the actual relation field name in your schema
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        startDate: "asc", // Sort bookings by startDate in ascending order
      },
    });

    return bookings;
  } catch (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded. Please try again later.");
  }
}

export async function getBookedDatesByCabinId(cabinId) {
  try {
    const today = startOfDay(new Date());

    // Find all bookings for the cabinId with relevant filters
    const bookings = await prisma.booking.findMany({
      where: {
        cabinId: cabinId,
        OR: [
          { startDate: { gte: today } }, // Start date greater than or equal to today
          { status: "checked-in" }, // Or status is 'checked-in'
        ],
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });

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
    throw new Error("Bookings could not be loaded. Please try again later.");
  }
}
export async function getSettings() {
  try {
    // Fetch the single settings record from the database
    const settings = await prisma.setting.findFirst(); // Use findFirst to get the first record if there's no unique identifier

    if (!settings) {
      throw new Error("Settings not found");
    }

    return settings;
  } catch (error) {
    console.error(error);
    throw new Error("Settings could not be loaded. Please try again later.");
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

export async function createBooking(newBooking) {
  try {
    // Create a new booking record in the database
    const savedBooking = await prisma.booking.create({
      data: newBooking,
    });

    return savedBooking;
  } catch (error) {
    console.error(error);
    throw new Error("Booking could not be created. Please try again later.");
  }
}
export async function updateGuest(id, updatedFields) {
  try {
    // Update the guest record by its ID
    const updatedGuest = await prisma.guest.update({
      where: { id: id }, // Unique identifier for the guest record
      data: updatedFields, // Fields to be updated
    });

    return updatedGuest;
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      // Prisma error code for record not found
      throw new Error("Guest not found");
    }
    throw new Error("Guest could not be updated. Please try again later.");
  }
}
export async function updateBooking(id, updatedFields) {
  try {
    // Update the booking record by its ID
    const updatedBooking = await prisma.booking.update({
      where: { id: id }, // Unique identifier for the booking record
      data: updatedFields, // Fields to be updated
    });

    return updatedBooking;
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      // Prisma error code for record not found
      throw new Error("Booking not found");
    }
    throw new Error("Booking could not be updated. Please try again later.");
  }
}
export async function deleteBooking(id) {
  try {
    // Delete the booking record by its ID
    const deletedBooking = await prisma.booking.delete({
      where: { id: id }, // Unique identifier for the booking record
    });

    return deletedBooking;
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      // Prisma error code for record not found
      throw new Error("Booking not found");
    }
    throw new Error("Booking could not be deleted. Please try again later.");
  }
}
