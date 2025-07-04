"use client"

import type { BlogPost } from "@/app/api/posts/route"

interface PostDetailProps {
  post: BlogPost
  onClose: () => void
}

export default function PostDetail({ post, onClose }: PostDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl" data-testid="close-button">
              ×
            </button>
          </div>

          <div className="text-sm text-gray-500 mb-4">
            <span>By {post.author}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          </div>

          <div className="bg-blue-50 p-4 rounded mb-4">
            <p className="text-blue-800 italic">{post.excerpt}</p>
          </div>

          <div className="text-gray-700 leading-relaxed mb-6" data-testid="post-content">
            {post.content}
          </div>

          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
