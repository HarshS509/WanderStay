// "use client";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { format, formatDistance, isPast, isToday } from "date-fns";
import Image from "next/image.js";
import Link from "next/link.js";
import DeleteReservation from "./DeleteReservation.js";

const safelyParseDate = (dateValue) => {
  if (dateValue instanceof Date) return dateValue;
  if (typeof dateValue === "string") return new Date(dateValue);
  if (dateValue && typeof dateValue === "object" && dateValue.$date) {
    return new Date(dateValue.$date);
  }
  return null;
};

export const formatDistanceFromNow = (date) => {
  const parsedDate = safelyParseDate(date);
  if (!parsedDate) return "Unknown";
  return formatDistance(parsedDate, new Date(), {
    addSuffix: true,
  }).replace("about ", "");
};

function ReservationCard({ booking, onDelete }) {
  const {
    _id,
    guestId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    numGuests,
    status,
    created_at,
    cabinId,
  } = booking;
  console.log(_id.toString());
  const startDateObj = safelyParseDate(startDate);
  const endDateObj = safelyParseDate(endDate);
  const createdAtObj = safelyParseDate(created_at);

  const name = cabinId?.name || "Unknown Cabin";
  const image = cabinId?.image || "/placeholder-image.jpg";

  if (!startDateObj || !endDateObj) {
    return <div>Invalid reservation data</div>;
  }

  return (
    <div className="flex border border-primary-800">
      <div className="relative h-32 aspect-square">
        <Image
          fill
          src={image}
          alt={name}
          className="object-cover border-r border-primary-800"
        />
      </div>

      <div className="flex-grow px-6 py-3 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {numNights} nights in Cabin {name}
          </h3>
          {isPast(startDateObj) ? (
            <span className="bg-yellow-800 text-yellow-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              past
            </span>
          ) : (
            <span className="bg-green-800 text-green-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              upcoming
            </span>
          )}
        </div>

        <p className="text-lg text-primary-300">
          {format(startDateObj, "EEE, MMM dd yyyy")} (
          {isToday(startDateObj) ? "Today" : formatDistanceFromNow(startDate)})
          &mdash; {format(endDateObj, "EEE, MMM dd yyyy")}
        </p>

        <div className="flex gap-5 mt-auto items-baseline">
          <p className="text-xl font-semibold text-accent-400">${totalPrice}</p>
          <p className="text-primary-300">&bull;</p>
          <p className="text-lg text-primary-300">
            {numGuests} guest{numGuests > 1 && "s"}
          </p>
          {createdAtObj && (
            <p className="ml-auto text-sm text-primary-400">
              Booked {format(createdAtObj, "EEE, MMM dd yyyy, p")}
            </p>
          )}
        </div>
      </div>

      {
        <div className="flex flex-col border-l border-primary-800 w-[100px]">
          {!isPast(startDate) ? (
            <>
              <Link
                href={`/account/reservations/edit/${_id.toString()}`}
                className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 border-b border-primary-800 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
              >
                <PencilSquareIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
                <span className="mt-1">Edit</span>
              </Link>
              <DeleteReservation
                bookingId={_id.toString()}
                onDelete={onDelete}
              />
            </>
          ) : null}
        </div>
      }
    </div>
  );
}

export default ReservationCard;
