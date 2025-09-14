import PostCard from '@/components/PostCard';
import { posts } from '@/data/posts';

export default function Posts() {
  return (
    <div className="flex gap-4 flex-col w-full p-5 mb-20">
      {
        posts.map((post, index) => (
          <PostCard post={post} key={index} /> 
        ))
      }
    </div>
  )
}