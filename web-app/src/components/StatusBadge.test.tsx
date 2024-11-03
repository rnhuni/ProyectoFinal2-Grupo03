import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import StatusBadge from "./StatusBadge";

describe("StatusBadge Component", () => {
  const renderWithChakra = (ui: React.ReactNode) => {
    return render(<ChakraProvider>{ui}</ChakraProvider>);
  };

  test("renders correctly with active status", () => {
    renderWithChakra(<StatusBadge status="active" />);
    const badge = screen.getByText("Active");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle("color: green.500");
    expect(badge).toHaveStyle("background-color: green.100");
  });

  test("renders correctly with suspended status", () => {
    renderWithChakra(<StatusBadge status="suspended" />);
    const badge = screen.getByText("Suspended");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle("color: orange.500");
    expect(badge).toHaveStyle("background-color: orange.100");
  });

  test("renders correctly with inactive status", () => {
    renderWithChakra(<StatusBadge status="inactive" />);
    const badge = screen.getByText("Inactive");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle("color: red.500");
    expect(badge).toHaveStyle("background-color: red.100");
  });

  test("renders correctly with unknown status", () => {
    renderWithChakra(<StatusBadge status="unknown" />);
    const badge = screen.getByText("Unknown");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle("color: gray.500");
    expect(badge).toHaveStyle("background-color: gray.100");
  });
});
