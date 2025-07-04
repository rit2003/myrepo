"use client"

import { useState } from "react"
import type { BlogPost } from "@/app/api/posts/route"
import PostDetail from "./PostDetail"

interface PostListProps {
  posts: BlogPost[]
}

export default function PostList({ posts }: PostListProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">No posts found</h2>
        <p className="text-gray-600">Check back later for new content!</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedPost(post)}
            data-testid={`post-card-${post.id}`}
          >
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-3">{post.excerpt}</p>
            <div className="text-sm text-gray-500">
              <span>By {post.author}</span>
              <span className="mx-2">•</span>
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedPost && <PostDetail post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </>
  )
}
