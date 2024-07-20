"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "./auth";
import { getBookings } from "./data-service";
import prisma from "./db";

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
  console.log(
    "connecteeddddddddddddddddddddddddddddddddddd",
    session.user,
    updateData
  );
  const updatedGuest = await prisma.guest.update({
    where: { id: session.user.guestId }, // Unique identifier for the guest
    data: updateData, // Fields to be updated
  });

  if (!updatedGuest) {
    throw new Error("Guest not found / updated");
  }
  // console.log(updatedGuest);
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
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");
  const deletedBooking = await prisma.booking.delete({
    where: { id: bookingId }, // Unique identifier for the booking
  });

  if (!deletedBooking) {
    throw new Error("Booking not found");
  }
  revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
  const bookingId = formData.get("bookingId");
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const guestBookings = await getBookings(session.user.guestId);
  // console.log(guestBookings);
  const guestBookingIds = guestBookings.map((booking) => booking.id.toString());
  // console.log(guestBookingIds, bookingId.toString());
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId }, // Unique identifier for the booking
    data: updateData, // Fields to be updated
  });

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

  const createdBooking = await prisma.booking.create({
    data: newBooking, // Fields to be set in the new record
  });

  if (!createdBooking) throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}
