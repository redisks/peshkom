"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Frown, CableCar } from "lucide-react";
import { places } from "@/data/places";
import { IPlace } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<IPlace[]>([]);
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);

  const searchParams = useSearchParams();

  const selectedQueryTitles = useMemo(() => searchParams.get("route")?.split('/') ?? [], [searchParams])

  useEffect(() => {
    setResults(
      places.filter(
        (place) =>
          place.name.toLowerCase().includes(searchQuery) ||
          place.address.toLowerCase().includes(searchQuery) ||
          place.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
      )
    );
  }, [searchQuery]);

  return (
    <div className="flex items-center justify-start w-full h-full flex-col gap-4 relative">
      <header className="flex items-center relative w-11/12">
        <Input
          placeholder="Что хотите посетить?"
          className="flex-1 h-full shadow-md py-4 rounded-2xl"
          onChange={(evt) => setSearchQuery(evt.target.value.toLowerCase())}
          autoFocus
        />
        <Search className="size-6 text-neutral-500 absolute right-4" />
      </header>
      <div className="w-full text-center text-sm text-neutral-400">
        Нажмите на название, чтобы изучить подробнее
      </div>
      {results.length === 0 ? (
        <div className="flex flex-col gap-4 w-10/12 mt-10 justify-center items-center">
          <span className="font-unbouded text-lg text-center">
            Мы ничего не нашли, но в будущем будет больше вариантов!
          </span>
          <Frown className="size-8" />
        </div>
      ) : (
        <div className="w-11/12 px-3 flex flex-col justify-start overflow-y-scroll gap-4 flex-1 max-h-4/5">
          {results.map((place: IPlace) => (
            <div
              className="flex gap-4 justify-between items-center w-full py-2 text-lg"
              key={place.id}
              onClick={() => {
                if (selectedAddresses.includes(place.address)) {
                  setSelectedAddresses((selectedAddresses) =>
                    selectedAddresses.filter((title) => title !== place.address)
                  );
                } else {
                  setSelectedAddresses((selectedAddresses) =>
                    Array.from(new Set([...selectedAddresses, place.address]))
                  );
                }
              }}
            >
              <div className="flex gap-3 items-stretch">
                <Avatar className="size-14">
                  <AvatarImage src={place.image} />
                  <AvatarFallback>{place.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <Link
                    href={`/place/${place.id}`}
                    className="font-bold"
                    onClick={(evt) => evt.stopPropagation()}
                  >
                    {place.name}
                  </Link>
                  <span className="text-sm text-neutral-400">
                    {place.address}
                  </span>
                </div>
              </div>
              <Checkbox
                checked={selectedAddresses.includes(place.address) || selectedQueryTitles.includes(place.address)}
                className="size-7"
              />
            </div>
          ))}
          <div className="pb-30"></div>
        </div>
      )}
      {selectedAddresses.length > 0 ? (
        <Link href={`/map?route=${selectedAddresses.join(';')}`} className="w-5/6 bg-pale-orange fixed bottom-5 py-5 rounded-3xl shadow-xl text-white flex justify-center items-center gap-4">
          <span className="text-2xl font-medium">Поехали!</span>
          <CableCar className='size-6' />
        </Link>
      ) : (
        ""
      )}
    </div>
  );
}
