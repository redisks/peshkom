import { IPost } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageSquare, Repeat2 } from "lucide-react";
import Link from "next/link";

export default function PostCard({ post }: { post: IPost }) {
  return (
    <Link
      className="w-full rounded-4xl p-8 flex flex-col justify-between bg-no-repeat bg-cover font-unbounded gap-35"
      href={`/post/${post._id}`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, .8) 100%), url(${post.image})`,
      }}
    >
      <header className="p-2 pr-10 bg-neutral-200 rounded-4xl flex gap-2 items-center w-fit shadow-xl">
        <Avatar className="size-12">
          <AvatarFallback>{post.author.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-base">{post.author.name.slice(0, 7)}...</span>
          <span className="text-sm text-neutral-400">@{post.author.id}</span>
        </div>
      </header>
      <footer className="w-full flex flex-col gap-2">
        <div className="flex gap-8 items-center">
          <div className="flex flex-col items-center gap-1 text-sm text-light-white">
            <Heart className="size-8" />
            <span>{post.likes}</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-sm text-light-white">
            <MessageSquare className="size-8 text-light-white" />
            <span>{post.comments.length}</span>
          </div>
        </div>
        <div className="text-xl text-white">{post.title}</div>
      </footer>
    </Link>
  );
}
