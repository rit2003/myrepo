import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6 text-black">Blog Viewer</h1>
        <p className="text-lg text-gray-600 mb-8">A  blog application built with Next.js</p>
        <Link href="/posts" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          View Blog Posts
        </Link>
      </div>
    </div>
  )
}
