import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import PrivateRoute from "./PrivateRoute";

describe("PrivateRoute Component", () => {
  const renderWithProviders = (ui: React.ReactNode, { route = "/" } = {}) => {
    window.history.pushState({}, "Test page", route);

    return render(
      <MemoryRouter initialEntries={[route]}>
        <ChakraProvider>{ui}</ChakraProvider>
      </MemoryRouter>
    );
  };

  test("renders children when authenticated", () => {
    localStorage.setItem("authToken", "test-token");

    renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div>Protected Content</div>
            </PrivateRoute>
          }
        />
        <Route path="/signin" element={<div>Sign In Page</div>} />
      </Routes>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  test("redirects to signin when not authenticated", () => {
    localStorage.removeItem("authToken");

    renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div>Protected Content</div>
            </PrivateRoute>
          }
        />
        <Route path="/signin" element={<div>Sign In Page</div>} />
      </Routes>
    );

    expect(screen.getByText("Sign In Page")).toBeInTheDocument();
  });
});
