"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Frown, Footprints } from "lucide-react";
import { places } from "@/data/places";
import { IPlace } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { PointsContext } from "@/context/PointsContext";
import { useSearchParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";

export default function GlobalSearch({ coords }: { coords: [number, number] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<IPlace[]>([]);
  const [selectedAddresses, setSelectedAddresses] = useState<IPlace[]>([]);
  const [isSelected, setIsSelected] = useState(true);

  const { points, setPoints } = useContext(PointsContext);

  const searchParams = useSearchParams();

  useEffect(() => {
    const route = searchParams.get("route");
    if (route && isSelected) {
      const ids = route.split(";");
      setResults(
        places
          .filter((place) => ids.includes(place._id))
          .filter(
            (place) =>
              place.name.toLowerCase().includes(searchQuery) ||
              place.address.toLowerCase().includes(searchQuery) ||
              place.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
          )
          .sort(
            (a, b) =>
              Math.abs(a.coordinates.lat - coords[0]) -
                Math.abs(b.coordinates.lat - coords[0]) ||
              Math.abs(a.coordinates.lng - coords[1]) -
                Math.abs(b.coordinates.lng - coords[1])
          )
      );
    } else {
      setResults(
        places
          .filter(
            (place) =>
              place.name.toLowerCase().includes(searchQuery) ||
              place.address.toLowerCase().includes(searchQuery) ||
              place.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
          )
          .sort(
            (a, b) =>
              Math.abs(a.coordinates.lat - coords[0]) -
                Math.abs(b.coordinates.lat - coords[0]) ||
              Math.abs(a.coordinates.lng - coords[1]) -
                Math.abs(b.coordinates.lng - coords[1])
          )
      );
    }
  }, [searchQuery, isSelected]);

  useEffect(() => {
    if (points.length > 0 && selectedAddresses.length === 0) {
      setSelectedAddresses(points);
    }
  }, []);

  return (
    <div className="flex items-center justify-start w-full h-full flex-col gap-4 relative">
      <header className="flex items-center relative w-11/12">
        <Input
          placeholder="Что хотите посетить?"
          className="flex-1 h-full shadow-md py-4 rounded-2xl"
          onChange={(evt) => setSearchQuery(evt.target.value.toLowerCase())}
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
          {searchParams.get("route") ? (
            <div className="px-10 py-2 border-1 border-light-black rounded-xl flex justify-between items-center" onClick={(evt) => setIsSelected(isSelected => !isSelected)}>
              <span className="flex-1 text-start">Все</span>
              <Switch
                checked={isSelected}
              />
              <span className="flex-1 text-end">Ваши</span>
            </div>
          ) : (
            ""
          )}
          {results.map((place: IPlace) => (
            <div
              className="flex gap-4 justify-between items-center w-full py-2 text-lg"
              key={place._id}
              onClick={() => {
                if (
                  selectedAddresses
                    .map((place) => place._id)
                    .includes(place._id)
                ) {
                  setSelectedAddresses((selectedAddresses) =>
                    selectedAddresses.filter(
                      (placeAddress) => placeAddress._id !== place._id
                    )
                  );
                } else {
                  setSelectedAddresses((selectedAddresses) =>
                    Array.from(new Set([...selectedAddresses, place]))
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
                    href={`/place/${place._id}`}
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
                checked={selectedAddresses
                  .map((place) => place._id)
                  .includes(place._id)}
                className="size-7"
              />
            </div>
          ))}
          <div className="pb-30"></div>
        </div>
      )}
      {selectedAddresses.length > 0 ? (
        <div className="w-full flex justify-center">
          <Button
            className="w-5/6 bg-pale-orange/80 backdrop-blur-sm fixed bottom-5 py-7 rounded-3xl shadow-xl text-white flex justify-center items-center gap-4"
            style={{background: 'radial-gradient(#FD4B27 33%, #FE9F5D 75%)'}}
            onClick={() => setPoints(selectedAddresses)}
          >
            <span className="text-2xl font-medium">Добавить</span>
            <Footprints className="size-6" />
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
