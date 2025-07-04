import { headers } from "next/headers"
import PostList from "@/components/PostList"
import type { BlogPost } from "@/app/api/posts/route"

async function fetchPosts(): Promise<BlogPost[]> {
  try {
    const h = await headers()
    const proto = h.get("x-forwarded-proto") ?? "http"
    const host = h.get("host") ?? "localhost:3000"
    const url = `${proto}://${host}/api/posts`

    const response = await fetch(url, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch posts")
    }

    const data = await response.json()
    return data.posts || []
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

export default async function PostsPage() {
  const posts = await fetchPosts()

  return (
    <div className="min-h-screen bg-gray-100 py-8 text-black">
      <div className="max-w-4xl mx-auto px-4 text-black">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">Blog Posts</h1>
        <PostList posts={posts} />
      </div>
    </div>
  )
}
