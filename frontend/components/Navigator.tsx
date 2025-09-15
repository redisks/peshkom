import React, { useContext, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Footprints,
  X,
  Repeat,
  LocateFixed,
} from "lucide-react";
import { PointsContext } from "@/context/PointsContext";
import { Button } from "@/components/ui/button";
import { RefObject } from "react";

const Navigator = ({
  mapRef,
  coords,
  exitRoute,
  loadRoute,
  getPosition,
}: {
  mapRef: RefObject<ymaps.Map | undefined>;
  coords: [number, number];
  exitRoute: Function;
  loadRoute: Function;
  getPosition: Function;
}) => {
  const { points, setPoints } = useContext(PointsContext);

  const [play, setPlay] = useState(false);

  // Переместить элемент вверх
  const moveUp = (index: number) => {
    if (index <= 0) return;

    const newItems = [...points];
    [newItems[index], newItems[index - 1]] = [
      newItems[index - 1],
      newItems[index],
    ];
    setPoints(newItems);
  };

  // Переместить элемент вниз
  const moveDown = (index: number) => {
    if (index >= points.length - 1) return;

    const newItems = [...points];
    [newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ];
    setPoints(newItems);
  };

  return (
    <div className="max-w-md w-full">
      <div className="w-full flex flex-col gap-2 py-5">
        {!play
          ? points.map((place, index) => (
              <div
                key={place._id}
                className="flex items-center points-center p-3 bg-gray-50 border border-gray-200 rounded-lg gap-2"
              >
                {/* Кнопки управления */}
                <div className="flex flex-col gap-1 mr-2">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50"
                    title="Вверх"
                  >
                    <ChevronUp size={16} />
                  </button>

                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === points.length - 1}
                    className="p-1 border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50"
                    title="Вниз"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
                <div className="font-bold text-gray-500 min-w-[24px] text-center">
                  {index + 1}
                </div>
                <div className="flex-1">{place.name}</div>
              </div>
            ))
          : ""}
        {!play ? (
          <Button
            className={`w-5/6 mx-auto py-7 rounded-3xl shadow-xl text-light-white flex justify-center items-center gap-4 mt-5`}
            style={{background: 'radial-gradient(#FD4B27 33%, #FE9F5D 75%)'}}
            onClick={() => {
              setPlay(true);
              mapRef.current?.setCenter(coords, 18, {
                duration: 500,
              });
            }}
          >
            <span className="text-2xl font-medium">ПОШЛИ!</span>
          </Button>
        ) : (
          <div className="w-full flex gap-4 justify-center items-center">
            <div
              className="p-5 bg-light-white rounded-[50%] shadow-xl"
              onClick={() => loadRoute(coords, points)}
            >
              <Repeat className="size-8" />
            </div>
            <div
              className="p-5 bg-light-white rounded-[50%] shadow-xl"
              onClick={() => getPosition()}
            >
              <LocateFixed className="size-8" />
            </div>
            <div
              className="p-5 bg-light-white rounded-[50%] shadow-xl"
              onClick={() => exitRoute()}
            >
              <X className="size-8" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigator;
