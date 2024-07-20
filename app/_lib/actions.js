"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { Booking, connectDB, Guest } from "./db";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateProfile(formData) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be signed in to update your profile.");
  }
  const nationalId = await formData.get("nationalId");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalId))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalId };
  await connectDB();
  const updatedGuest = await Guest.findByIdAndUpdate(
    session.user.guestId,
    updateData,
    {
      new: true, // Return the updated document
      runValidators: true, // Run validators to ensure data validity
    }
  );

  if (!updatedGuest) {
    throw new Error("Guest not found / updated");
  }
  console.log(updatedGuest);
  revalidatePath("/account/profile");
}
export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be signed in to delete your reservation.");
  }
  await connectDB();
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");
  const deletedBooking = await Booking.findByIdAndDelete(bookingId);

  if (!deletedBooking) {
    throw new Error("Booking not found");
  }
  revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
  const bookingId = formData.get("bookingId");
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  await connectDB();
  const guestBookings = await getBookings(session.user.guestId);
  console.log(guestBookings);
  const guestBookingIds = guestBookings.map((booking) =>
    booking._id.toString()
  );
  console.log(guestBookingIds, bookingId.toString());
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    updateData,
    {
      new: true, // Return the updated document
      runValidators: true, // Run validators to ensure data validity
    }
  );

  if (!updatedBooking) {
    throw new Error("Booking not found / updated");
  }
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");
  redirect("/account/reservations");
}
export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  await connectDB();
  const booking = new Booking(newBooking);
  const savedBooking = await booking.save();
  if (!savedBooking) throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}
