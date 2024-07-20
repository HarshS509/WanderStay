import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin } from "@/app/_lib/data-service";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const { name } = await getCabin(params.cabinid);

  return {
    title: name,
  };
}
// export async function generateStaticParams() {
//   const cabins = await getCabins();

//   const ids = cabins.map((cabin) => ({ cabinid: String(cabin.id) }));
//   return ids;
// }
export default async function Page({ params }) {
  const cabin = await getCabin(params.cabinid);
  const plainCabin = JSON.parse(JSON.stringify(cabin));

  const { name } = cabin;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={plainCabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={plainCabin} />
        </Suspense>
      </div>
    </div>
  );
}
