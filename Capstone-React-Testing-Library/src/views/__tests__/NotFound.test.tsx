import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import NotFound from "../NotFound";

describe("NotFound Component", () => {
  it("renders the 404 page with correct text", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /404 - page not found/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/sorry, the page you are looking for does not exist./i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /go to home/i })
    ).toBeInTheDocument();
  });

  it("navigates to the home page when the button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/not-found"]}>
        <Routes>
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /go to home/i }));

    expect(screen.getByText(/home page/i)).toBeInTheDocument();
  });
});
