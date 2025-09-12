"use client";

import { YMaps, Map, Placemark, useYMaps } from "@iminside/react-yandex-maps";
import { ArrowLeft, Route, Dices, Sparkle, Search } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import GlobalSearch from "@/components/GlobalSearch";
import { useEffect, useState, useRef } from "react";
import { YMapsApi } from "@iminside/react-yandex-maps/typings/util/typing";
import { Map as IMap } from "@iminside/react-yandex-maps";

interface ymapsWithRoute extends YMapsApi {
  route: Function;
}

export default function MapPage() {
  const map = useRef<ymaps.Map>(undefined);
  const ymaps = useYMaps(["multiRouter.MultiRoute"]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [points, setPoints] = useState<string[]>([]);
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false);

  const defaultState = {
    center: [55.751574, 37.573856],
    zoom: 10,
    controls: [],
  };

  useEffect(() => {
    setDrawerOpened(false);
    setPoints(searchParams.get("route")?.split(";") ?? []);
  }, [searchParams]);

  useEffect(() => {
    if (ymaps && points.length > 0) {
      const multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: points,
          params: {
            routingMode: "pedestrian",
          },
        },
        {
          mapStateAutoApply: true,
          boundsAutoApply: true,
        }
      );
      if (map.current) {
        map.current.geoObjects.add(multiRoute);
      }
    }
  }, [points, ymaps]);

  if (!ymaps) {
    // TODO: loading
    return null;
  }

  return (
    <>
      <div
        className="fixed top-8 left-5 z-10 shadow-md p-3 bg-light-white rounded-2xl"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-8" />
      </div>
      <div className="fixed top-8 right-5 z-10 shadow-md p-3 bg-light-white rounded-2xl flex flex-col gap-4">
        <ArrowLeft className="size-8" />
        <Route className="size-8" />
        <Dices className="size-8" />
      </div>
      <Drawer
        open={drawerOpened}
        onOpenChange={(open) => setDrawerOpened(open)}
      >
        <DrawerTrigger className="fixed bottom-0 z-10 bg-light-white w-full p-5 flex items-stretch justify-between gap-4 rounded-t-3xl shadow-xl">
          <div className="flex flex-1 items-center relative">
            <Input
              placeholder="Что хотите посетить?"
              className="flex-1 h-full shadow-md py-4 rounded-2xl"
            />
            <Search className="size-6 text-neutral-500 absolute right-4" />
          </div>
          <div className="p-3 bg-light-white shadow-md rounded-2xl">
            <Sparkle className="size-8" />
          </div>
        </DrawerTrigger>
        <DrawerContent className="h-[95%]">
          <DrawerHeader className="w-full flex items-stretch justify-between">
            <DrawerTitle className="sr-only">Поиск</DrawerTitle>
          </DrawerHeader>
          <GlobalSearch />
        </DrawerContent>
      </Drawer>
      <YMaps
        query={{
          load: "package.full",
          apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY,
        }}
      >
        <Map
          defaultState={defaultState}
          defaultOptions={{
            suppressMapOpenBlock: true,
          }}
          className="w-full h-screen fixed top-0"
          modules={["multiRouter.MultiRoute"]}
          instanceRef={map}
        >
          <Placemark geometry={[55.684758, 37.738521]} />
        </Map>
      </YMaps>
    </>
  );
}
