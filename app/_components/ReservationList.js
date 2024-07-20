// "use client";
import ReservationCard from "./ReservationCard";
function ReservationList({ bookings }) {
  console.log(bookings);
  // const [optimisticBookings, optimisticDelete] = useOptimistic(
  //   bookings,
  //   () => {}
  // );
  // async function handleDelete(bookingId) {
  //   optimisticDelete(bookingId);
  //   await deleteReservation(bookingId);
  // }
  return (
    <ul className="space-y-6">
      {bookings.map((booking) => (
        <ReservationCard
          // onDelete={handleDelete}
          booking={booking}
          key={booking._id.toString()}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
