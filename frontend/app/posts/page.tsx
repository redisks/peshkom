import Post from '@/components/Post';
import { posts } from '@/data/posts';

export default function Posts() {
  return (
    <div className="flex gap-4 flex-col w-full p-3 mb-20">
      {
        posts.map((post, index) => (
          <Post post={post} key={index} /> 
        ))
      }
    </div>
  )
}