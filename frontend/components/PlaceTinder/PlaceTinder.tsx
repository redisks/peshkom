"use client";

import "./style.css";
import { useEffect, useMemo, useState, Dispatch, SetStateAction } from "react";
import { MapPin, FlagTriangleLeft, Repeat, ChevronLeft, ChevronRight } from "lucide-react";
import { calculateDistance } from "@/lib/utils";
import { IPlace } from "@/lib/types";
import { useRouter } from "next/navigation";

const PlaceTinder = ({
  initialPlaces,
  setStep,
}: {
  initialPlaces: IPlace[];
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const router = useRouter();

  const [isAnimating, setIsAnimating] = useState<
    "right" | "left" | "refresh" | null
  >(null);
  const [coords, setCoords] = useState<[number, number]>([0, 0]);

  const [yesPlaces, setYesPlaces] = useState<IPlace[]>([]);
  const [noPlaces, setNoPlaces] = useState<IPlace[]>([]);
  const [places, setPlaces] = useState<IPlace[]>(initialPlaces);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords([position.coords.latitude, position.coords.longitude]);
      },
      (err) => console.log(err)
    );
  }, []);

  const handleSwipe = (direction: "left" | "right") => {
    if (isAnimating || places.length === 0) return;

    setIsAnimating(direction);

    setTimeout(() => {
      const newYesPlaces = Array.from(new Set([...yesPlaces, currentPlace]));
      if (direction === "left") {
        setNoPlaces(Array.from(new Set([...noPlaces, currentPlace])));
        if (places.length > 1) {
          setPlaces(places.filter((place) => place._id !== currentPlace._id));
        }
      } else if (direction === "right") {
        setYesPlaces(newYesPlaces);
        if (places.length > 1) {
          setPlaces(places.filter((place) => place._id !== currentPlace._id));
        }
      }

      if (places.length === 1) {
        router.push(
          "/map?route=" + newYesPlaces.map((place) => place._id).join(";")
        );
      }
      setIsAnimating(null);
    }, 500);
  };

  const handleRefresh = () => {
    if (places.length > 1) {
      if (isAnimating) return;

      setIsAnimating("refresh");

      setTimeout(() => {
        setPlaces(places.sort(() => 0.5 - Math.random()));

        setIsAnimating(null);
      }, 500);
    }
  };

  if (places.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        Загрузка...
      </div>
    );
  }

  const currentPlace = places[0];

  const distance = useMemo(() => {
    if (coords[0] !== 0 && coords[1] !== 0 && currentPlace) {
      const currentPlace = places[0];
      return calculateDistance(
        coords[0],
        coords[1],
        currentPlace.coordinates.lat,
        currentPlace.coordinates.lng
      ).toFixed(1);
    } else {
      return "?";
    }
  }, [coords]);

  return (
    <div className="flex flex-col h-11/12">
      <header className="flex justify-between items-center w-full gap-12 text-lg px-5">
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => setStep(0)}
        >
          <ChevronLeft className="size-6" />
          <span>Назад</span>
        </div>
        {/* link to map */}
        <div
          className="flex gap-2 items-center cursor-pointer text-pale-orange"
          onClick={() => {
            router.push(
              "/map?route=" + yesPlaces.map((place) => place._id).join(";")
            );
          }}
        >
          <span>Готово</span>
          <ChevronRight className="size-6" />
        </div>
      </header>
      <div className="relative flex-1 m-4 rounded-2xl overflow-hidden shadow-xl">
        <div
          className={`card-${
            places.length === 1 ? "end-" : "" + isAnimating
          } relative z-10 flex flex-col justify-end h-full p-6 text-white bg-cover`}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${currentPlace?.image})`,
          }}
        >
                                  <button
              onClick={handleRefresh}
              className={`p-3 rounded-full bg-gray-200 flex items-center justify-center shadow-lg hover:bg-gray-300 transition-colors mx-auto z-10 absolute top-5 ${
                places.length === 1 ? "opacity-0" : ""
              }`}
              aria-label="Обновить"
            >
              <Repeat className="size-6 text-light-black" />
            </button>
          <div className="mb-2">
            <h2 className="text-2xl font-bold mb-2">{currentPlace?.name}</h2>
          </div>
          <div className="flex flex-col gap-2 text-base mb-24">
            <div className="flex items-center gap-2">
              <MapPin className="size-8" />
              <p>{currentPlace?.address}</p>
            </div>
            <div className="flex items-center gap-2">
              <FlagTriangleLeft className="size-8" />
              <p>{distance} км от меня</p>
            </div>
          </div>
          <div className="relative flex justify-center items-center p-6">
            <button
              onClick={() => handleSwipe("left")}
              className="w-40 h-40 rounded-full bg-pale-orange/70 backdrop-blur-2xl flex items-center justify-center shadow-lg transition-colors text-2xl font-medium absolute -bottom-10 -left-10 rounded-bl-2xl"
              style={{ boxShadow: "inset 5px 5px 10px white" }}
              aria-label="Не иду"
            >
              Не иду
            </button>
            <button
              onClick={() => handleSwipe("right")}
              className="w-40 h-40 rounded-full bg-green-500/70 backdrop-blur-2xl flex items-center justify-center shadow-lg transition-colors text-2xl font-medium absolute -bottom-10 -right-10 rounded-br-2xl"
              style={{ boxShadow: "inset 5px 5px 10px white" }}
              aria-label="Иду"
            >
              Иду
            </button>
          </div>
        </div>

        {/* Анимация свайпа */}
        {isAnimating && (
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default PlaceTinder;
