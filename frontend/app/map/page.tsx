"use client";

import { Map, useYMaps } from "@iminside/react-yandex-maps";
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
import { useEffect, useState, useRef, useContext } from "react";
import { YMapsApi } from "@iminside/react-yandex-maps/typings/util/typing";
import { YMapDefaultMarker } from "@yandex/ymaps3-default-ui-theme";
import { IPlace } from "@/lib/types";
import { PointsContext } from "@/context/PointsContext";

interface ymapsWithRoute extends YMapsApi {
  route: Function;
}

export default function MapPage() {
  const mapRef = useRef<ymaps.Map>(undefined);
  const ymaps = useYMaps(["multiRouter.MultiRoute"]);
  const router = useRouter();
  const { points } = useContext(PointsContext);
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false);

  const defaultState = {
    center: [55.751574, 37.573856],
    zoom: 10,
    controls: [],
  };

  useEffect(() => {
    loadRoute();
  }, [points, ymaps]);

  function loadRoute() {
    if (ymaps && points.length > 0) {
      setDrawerOpened(false);
      const multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: points.map((point) => point.address),
          params: {
            routingMode: "pedestrian",
          },
        },
        {
          mapStateAutoApply: true,
          boundsAutoApply: true,
        }
      );
      if (mapRef.current) {
        // TODO: marker
        mapRef.current.geoObjects.removeAll();
        mapRef.current.geoObjects.add(multiRoute);
      }
    }
  }

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

      <Map
        defaultState={defaultState}
        defaultOptions={{
          suppressMapOpenBlock: true,
        }}
        className="w-full h-screen fixed top-0"
        modules={["multiRouter.MultiRoute"]}
        instanceRef={mapRef}
        onLoad={loadRoute}
      />
    </>
  );
}
