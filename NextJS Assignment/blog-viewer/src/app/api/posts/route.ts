import { NextResponse } from "next/server"

export interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  author: string
  publishedAt: string
}

// mock blog posts data
const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    content:
      "Next.js is a powerful React framework that makes building web applications easy. It provides features like server-side rendering and static site generation out of the box.",
    excerpt: "Learn the basics of Next.js framework",
    author: "Jay Soni",
    publishedAt: "2025-01-15",
  },
  {
    id: 2,
    title: "Understanding React Components",
    content:
      "React components are the building blocks of React applications. They let you split the UI into independent, reusable pieces that can be thought about in isolation.",
    excerpt: "Master React components and props",
    author: "BK Sharma",
    publishedAt: "2025-01-10",
  },
  {
    id: 3,
    title: "CSS Basics for Beginners",
    content:
      "CSS is used to style HTML elements. It controls the layout, colors, fonts, and overall appearance of web pages. Learning CSS is essential for web development.",
    excerpt: "Learn CSS fundamentals and styling",
    author: "Satyendra Yadav",
    publishedAt: "2025-01-05",
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      posts: mockPosts,
      success: true,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
