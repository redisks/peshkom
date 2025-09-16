"use client";

import { IPost } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { posts } from "@/data/posts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Post() {
  const { postId } = useParams();
  const router = useRouter();

  const [post, setPost] = useState<IPost | undefined>(
    posts.find((post) => post._id === postId)
  );

  return post ? (
    <div className="max-w-3xl mx-auto p-5 bg-light-white pb-24">
      {/* Шапка поста */}
      <div className="flex items-center mb-6">
        <Avatar className="size-12">
          <AvatarFallback>{post.author.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
          <p className="text-sm text-gray-500">
            {new Date(post.date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Заголовок */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

      {/* Изображение */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden mb-6 shadow-md">
        <Image
          src={post.image}
          alt={post.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Основной текст */}
      <p className="text-gray-700 text-lg mb-6 leading-relaxed">{post.text}</p>

      {/* Лайки */}
      <div className="flex items-center text-gray-500 text-lg mb-6">
        <Heart className="mr-2 size-6" />
        <span>{post.likes} лайков</span>
      </div>

      <div className="flex flex-col gap-2 border-t py-4">
        <h3 className='font-semibold'>Маршрут</h3>
        <ul className='py-2'>
          {
            post.route.places.map((point, index) => (
              <li key={index}>{index + 1}. {point.name}</li>
            ))
          }
        </ul>
        <Button style={{ background: "radial-gradient(#FD4B27 33%, #FE9F5D 75%)" }} onClick={() => router.push(`/map?route=${post.route.places.map(p => p._id).join(';')}`)}>
          Открыть маршрут
        </Button>
      </div>

      {/* Комментарии */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-900 mb-3">Комментарии</h3>
        <ul className="space-y-4">
          {post.comments.map((comment, index) => (
            <li key={index} className="bg-gray-50 p-4 rounded-lg flex items-start gap-4 ">
              <Avatar className="size-12">
                <AvatarFallback>{comment.author.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2 pt-3">
                <div className="font-semibold text-gray-900">
                  {comment.author}
                </div>
                <p className="text-gray-700 mt-1">{comment.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    ""
  );
}
