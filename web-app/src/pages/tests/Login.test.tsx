import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import SplitScreen from "../Login";

describe("Login Page", () => {
  const renderWithChakra = (ui: React.ReactNode) => {
    return render(<ChakraProvider>{ui}</ChakraProvider>);
  };

  test("renders login form", () => {
    renderWithChakra(<SplitScreen />);

    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Remember me")).toBeInTheDocument();
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  test("allows user to type in email and password", () => {
    renderWithChakra(<SplitScreen />);

    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password");
  });

  test("handles form submission", () => {
    renderWithChakra(<SplitScreen />);

    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");
    const signInButton = screen.getByRole("button", { name: "Sign in" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    fireEvent.click(signInButton);

    // Add your form submission logic here
    // For example, you can mock a function and check if it was called
    // expect(mockSubmitFunction).toHaveBeenCalledWith({
    //   email: 'test@example.com',
    //   password: 'password',
    // });
  });
});
