"use client";

import React from "react";
import { YMaps, Map, Placemark } from "@iminside/react-yandex-maps";

export default function MapPage() {
  const defaultState = {
    center: [55.751574, 37.573856],
    zoom: 5,
  };

  return (
    <YMaps
      query={{
        load: "package.full",
        apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY,
      }}
    >
      <Map defaultState={defaultState} className='w-full h-96'>
        <Placemark geometry={[55.684758, 37.738521]} />
      </Map>
    </YMaps>
  );
}
