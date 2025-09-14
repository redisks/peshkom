"use client";

import { useParams } from "next/navigation";
import { places } from "@/data/places";
import { useMemo } from "react";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { num_word } from '@/lib/utils';

export default function Place() {
  const { placeId } = useParams();
  const placeIds = useMemo(
    () => places.map((place) => String(place._id)),
    [places]
  );
  const place = useMemo(
    () => places.find((place) => String(place._id) === placeId),
    [placeId]
  );

  if (!placeIds.includes(placeId?.toString() ?? "")) return "notfound";
  if (!place) return "notfound";

  return (
    <div className="w-full h-full min-h-screen flex flex-col font-unbounded">
      <Image src={place.image} alt={place.name} className="w-full h-1/3" width={300} height={300} />
      <div className="w-full flex-1 bg-light-white border-pale-orange border-16 border-b-0 rounded-t-4xl flex flex-col gap-3 p-4 -mt-8">
        <div className="text-pale-orange text-2xl font-unbounded font-medium">{place.name}</div>
        <div className="w-full flex gap-1 items-center">
          <Star className="size-6 text-yellow-400 fill-yellow-400" />
          <span className="text-xl">{place.rating}</span>
        </div>
        <Drawer>
          <DrawerTrigger className="w-full flex text-lg font-light underline text-pale-orange">
            {place.reviews.length} {num_word(place.reviews.length, ["отзыв", "отзыва", "отзывов"])}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Отзывы</DrawerTitle>
              <DrawerDescription>
                ⭐ {place.rating} - {place.reviews.length} {num_word(place.reviews.length, ["отзыв", "отзыва", "отзывов"])}
              </DrawerDescription>
            </DrawerHeader>
            <div className="w-full flex flex-col gap-4 px-4 pb-8">
              {place.reviews.map((review, index) => (
                <div
                  key={index}
                  className="border-1 border-neutral-300 shadow-sm bg-neutral-50 p-4 rounded-xl flex flex-col"
                >
                  <header className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <Avatar>
                        <AvatarFallback>{review.author.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className='font-medium'>{review.author}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Star className="size-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-lg">{place.rating}</span>
                    </div>
                  </header>
                  <span className='w-full px-3'>{review.text}</span>
                  <span className="w-full px-3 pt-2  text-base text-neutral-400">{review.date}</span>
                </div>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
        <div className="flex gap-4 flex-wrap">
          {place.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="font-light border-light-black border-1 text-md"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="text-base font-light py-2">{place.description}</div>
        <div className="text-sm font-light flex gap-2">
          <MapPin className="size-6 text-pale-orange" />
          <span className="text-pale-orange">{place.address}</span>
        </div>
      </div>
    </div>
  );
}
