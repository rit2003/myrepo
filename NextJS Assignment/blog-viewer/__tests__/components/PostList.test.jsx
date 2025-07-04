import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
const PostList = require("../../src/components/PostList").default;

jest.mock("../../src/components/PostDetail", () => {
  const React = require("react");
  return function MockPostDetail({ post, onClose }) {
    return React.createElement(
      "div",
      { "data-testid": "post-detail-modal" },
      [
        React.createElement("h2", { key: "title" }, post.title),
        React.createElement(
          "button",
          {
            key: "close",
            onClick: onClose,
            "data-testid": "close-button",
          },
          "Close"
        ),
      ]
    );
  };
});

const mockPosts = [
  {
    id: 1,
    title: "Test Post 1",
    content: "This is test content for post 1",
    excerpt: "Test excerpt 1",
    author: "Jay Soni",
    publishedAt: "2025-01-15",
  },
  {
    id: 2,
    title: "Test Post 2",
    content: "This is test content for post 2",
    excerpt: "Test excerpt 2",
    author: "BK Sharma",
    publishedAt: "2025-01-10",
  },
];

describe("PostList Component", () => {
  it("renders list of posts correctly", () => {
    render(React.createElement(PostList, { posts: mockPosts }));

    expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    expect(screen.getByText("Test Post 2")).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes("Jay Soni"))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes("BK Sharma"))).toBeInTheDocument();
  });

  it("displays empty state when no posts are provided", () => {
    render(React.createElement(PostList, { posts: [] }));

    expect(screen.getByText("No posts found")).toBeInTheDocument();
    expect(screen.getByText("Check back later for new content!")).toBeInTheDocument();
  });

  it("opens post detail modal when post is clicked", () => {
    render(React.createElement(PostList, { posts: mockPosts }));

    const firstPost = screen.getByTestId("post-card-1");
    fireEvent.click(firstPost);

    expect(screen.getByTestId("post-detail-modal")).toBeInTheDocument();
  });
});
