"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

function Filter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeFilter = searchParams.get("capacity") ?? "all";

  function createFilterLink(filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="border border-primary-800 flex">
      <FilterLink
        filter="all"
        href={createFilterLink("all")}
        activeFilter={activeFilter}
      >
        All cabins
      </FilterLink>
      <FilterLink
        filter="small"
        href={createFilterLink("small")}
        activeFilter={activeFilter}
      >
        2&mdash;3 guests
      </FilterLink>
      <FilterLink
        filter="medium"
        href={createFilterLink("medium")}
        activeFilter={activeFilter}
      >
        4&mdash;7 guests
      </FilterLink>
      <FilterLink
        filter="large"
        href={createFilterLink("large")}
        activeFilter={activeFilter}
      >
        8&mdash;12 guests
      </FilterLink>
    </div>
  );
}

function FilterLink({ filter, href, activeFilter, children }) {
  return (
    <Link href={href} scroll={false}>
      <span
        className={`px-5 py-2 hover:bg-primary-700 ${
          filter === activeFilter ? "bg-primary-700 text-primary-50" : ""
        }`}
      >
        {children}
      </span>
    </Link>
  );
}

export default Filter;
