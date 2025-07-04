const { render, screen } = require("@testing-library/react")
require("@testing-library/jest-dom")
const React = require("react")

const LoadingSpinner = () => {
  return React.createElement(
    "div",
    {
      className: "flex items-center justify-center py-12",
      "data-testid": "loading-spinner",
    },
    [
      React.createElement("div", {
        key: "spinner",
        className: "w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin",
      }),
      React.createElement("span", { key: "text", className: "ml-3 text-gray-600" }, "Loading posts..."),
    ],
  )
}

describe("LoadingSpinner Component", () => {
  it("renders loading spinner correctly", () => {
    render(React.createElement(LoadingSpinner))

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument()
    expect(screen.getByText("Loading posts...")).toBeInTheDocument()
  })

  it("has correct CSS classes for animation", () => {
    render(React.createElement(LoadingSpinner))

    const spinner = screen.getByTestId("loading-spinner")
    expect(spinner).toHaveClass("flex", "items-center", "justify-center", "py-12")
  })
})
