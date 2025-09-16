// NavigatorWithDrawer.tsx
import React, { useContext, useState, useRef } from "react";
import {
  ChevronUp,
  ChevronDown,
  X,
  Repeat,
  LocateFixed,
  GripVertical,
} from "lucide-react";
import { PointsContext } from "@/context/PointsContext";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { RefObject } from "react";

const Navigator = ({
  mapRef,
  coords,
  exitRoute,
  loadRoute,
  getPosition,
  time,
  distance,
}: {
  mapRef: RefObject<ymaps.Map | undefined>;
  coords: [number, number];
  exitRoute: Function;
  loadRoute: Function;
  getPosition: Function;
  time: string;
  distance: string;
}) => {
  const { points: finalPoints, setPoints: setFinalPoints } =
    useContext(PointsContext);
  const [open, setOpen] = useState(false);
  const [points, setPoints] = useState(finalPoints);

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

  // Drag and drop функциональность
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    const newItems = [...points];
    const draggedItem = newItems[dragItem.current];

    // Удаляем элемент из старой позиции
    newItems.splice(dragItem.current, 1);
    // Вставляем в новую позицию
    newItems.splice(dragOverItem.current, 0, draggedItem);

    setPoints(newItems);

    // Сбрасываем позиции
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="relative w-full flex flex-col items-center gap-2 py-5">
      {/* Основной интерфейс с информацией о маршруте */}
      <div className="flex-col w-full gap-4 justify-center items-center font-medium">
        <header className="text-center w-full text-lg">
          {time || "Загрузка..."}
        </header>
        <div className="text-center w-full">{distance}</div>
        <div className="w-full flex gap-4 justify-center items-center mt-4">
          <div
            className="p-5 bg-light-white rounded-[50%] shadow-xl"
            onClick={() => loadRoute(coords, points)}
          >
            <Repeat className="size-8" />
          </div>
          <div
            className="p-5 bg-light-white rounded-[50%] shadow-xl"
            onClick={() => getPosition(true)}
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
      </div>

      {/* Кнопка "Изменить" внизу */}
      <div className="mt-6">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <button className="text-gray-500 text-lg hover:text-gray-700 transition-colors">
              Изменить
            </button>
          </DrawerTrigger>

          <DrawerContent className="h-[90vh] flex flex-col">
            <DrawerTitle className="sr-only" />
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Маршрут</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-6" />
                </Button>
              </div>

              <div className="space-y-3">
                {points.map((place, index) => (
                  <div
                    key={place._id}
                    className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg gap-3 shadow-sm"
                    draggable
                    onDragStart={() => (dragItem.current = index)}
                    onDragEnter={() => (dragOverItem.current = index)}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="flex-1 flex flex-wrap items-center gap-3">
                      <div className="font-bold text-gray-500 min-w-[30px] h-[30px] flex items-center justify-center bg-white rounded-full">
                        {index + 1}
                      </div>
                      <div className="font-medium flex-1">{place.name}</div>
                      <div className="flex justify-between w-full gap-4">
                        <Button
                          className="flex-1 shadow-md"
                          variant={"outline"}
                          onClick={() => moveDown(index)}
                          disabled={index === points.length - 1}
                        >
                          <ChevronDown size={24} />
                        </Button>
                        <Button
                          className="flex-1 shadow-md"
                          variant={"outline"}
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                        >
                          <ChevronUp size={24} />
                        </Button>
                      </div>
                    </div>

                    <div className="p-2 text-gray-400">
                      <GripVertical size={32} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Кнопка Сохранить внизу */}
            <div className="p-4 border-t bg-white">
              <Button
                className="w-full py-6 rounded-2xl text-light-white flex justify-center items-center gap-4"
                style={{
                  background: "radial-gradient(#FD4B27 33%, #FE9F5D 75%)",
                }}
                onClick={() => {
                  setFinalPoints(points);
                  setOpen(false);
                }}
              >
                <span className="text-xl font-medium">Сохранить</span>
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default Navigator;
