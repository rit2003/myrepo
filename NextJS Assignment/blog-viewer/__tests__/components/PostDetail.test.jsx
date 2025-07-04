import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostDetail from "../../src/components/PostDetail";

const mockPost = {
  id: 1,
  title: "Test Blog Post",
  content: "This is a test content for the blog post.",
  excerpt: "This is a test excerpt",
  author: "John Doe",
  publishedAt: "2024-01-15",
};

const mockOnClose = jest.fn();

describe("PostDetail Component", () => {
  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it("renders post details correctly", () => {
    render(<PostDetail post={mockPost} onClose={mockOnClose} />);
    expect(screen.getByText("Test Blog Post")).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes("John Doe"))).toBeInTheDocument();
    expect(screen.getByText("This is a test excerpt")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<PostDetail post={mockPost} onClose={mockOnClose} />);
    const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
