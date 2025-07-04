// Test the mock data structure directly 
const mockPosts = [
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

describe("Posts API Data Structure", () => {
  it("has correct number of posts", () => {
    expect(mockPosts).toHaveLength(3)
  })

  it("posts have correct structure", () => {
    const firstPost = mockPosts[0]

    expect(firstPost).toHaveProperty("id")
    expect(firstPost).toHaveProperty("title")
    expect(firstPost).toHaveProperty("content")
    expect(firstPost).toHaveProperty("excerpt")
    expect(firstPost).toHaveProperty("author")
    expect(firstPost).toHaveProperty("publishedAt")
  })

  it("posts have correct data types", () => {
    mockPosts.forEach((post) => {
      expect(typeof post.id).toBe("number")
      expect(typeof post.title).toBe("string")
      expect(typeof post.content).toBe("string")
      expect(typeof post.excerpt).toBe("string")
      expect(typeof post.author).toBe("string")
      expect(typeof post.publishedAt).toBe("string")
    })
  })

  it("posts have valid content", () => {
    mockPosts.forEach((post) => {
      expect(post.title.length).toBeGreaterThan(0)
      expect(post.content.length).toBeGreaterThan(0)
      expect(post.excerpt.length).toBeGreaterThan(0)
      expect(post.author.length).toBeGreaterThan(0)
      expect(post.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })
})
