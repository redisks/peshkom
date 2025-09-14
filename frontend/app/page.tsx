"use client";

import "./blob.css";
import { categories } from "@/data/categories";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GirloSP } from "@/data/localFonts";
import PlaceTinder from '@/components/PlaceTinder';

export default function Home() {
  const [step, setStep] = useState(0);
  const [presentedCategories, setPresentedCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    console.log(selectedCategories);
  }, [selectedCategories]);

  useEffect(() => {
    setPresentedCategories(
      categories.sort((a, b) => 0.5 - Math.random()).slice(0, 8)
    );
  }, []);

  return (
    <main className="flex gap-4 flex-col items-center p-5 w-full h-full">
      {step === 0 ? (
        <>
          <header className="flex justify-between items-center w-full gap-12 text-lg">
            <Link href="/map" className="text-neutral-500">
              Пропустить
            </Link>
            <div
              onClick={() => {
                if (selectedCategories.length > 0) setStep(1);
              }}
              className={`flex gap-2 items-center cursor-pointer ${
                selectedCategories.length > 0
                  ? "text-pale-orange"
                  : "text-neutral-500"
              }`}
            >
              <span>Далее</span>
              <ChevronRight className="size-6" />
            </div>
          </header>
          <div className="w-full">
            <header
              className={`my-5 w-full text-center text-3xl ${GirloSP.className}`}
            >
              Куда идем?
            </header>
            <section className="grid grid-cols-12 grid-rows-8 font-bold text-xl text-light-white [&>*]:flex [&>*]:justify-center [&>*]:items-center [&>*]:aspect-square [&>*]:text-center [&>*]:cursor-pointer gap-3">
              {presentedCategories.map((category, index) => (
                <div
                  className="blob col-span-6 row-span-2"
                  data-selected={
                    selectedCategories.includes(category) ? "true" : "false"
                  }
                  key={index}
                  onClick={() => {
                    setSelectedCategories((selectedCategories) =>
                      selectedCategories.includes(category)
                        ? selectedCategories.filter(
                            (categoryFilter) => categoryFilter !== category
                          )
                        : [...selectedCategories, category]
                    );
                  }}
                >
                  {category}
                </div>
              ))}
            </section>
          </div>
        </>
      ) : step === 1 ? (
        <>
          <header className="flex justify-between items-center w-full gap-12 text-lg">
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => setStep(0)}
            >
              <ChevronLeft className="size-6" />
              <span>Назад</span>
            </div>
            {/* link to map */}
            <div className="flex gap-2 items-center cursor-pointer text-pale-orange">
              <span>Готово</span>
              <ChevronRight className="size-6" />
            </div>
          </header>
          <PlaceTinder />
        </>
      ) : (
        ""
      )}
    </main>
  );
}
