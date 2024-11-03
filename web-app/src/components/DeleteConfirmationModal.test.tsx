import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

describe("DeleteConfirmationModal Component", () => {
  const renderWithChakra = (ui: React.ReactNode) => {
    return render(<ChakraProvider>{ui}</ChakraProvider>);
  };

  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly when open", () => {
    renderWithChakra(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        itemName="Test Item"
      />
    );

    expect(
      screen.getByText(
        '¿Estás seguro de que deseas eliminar "Test Item"? Esta acción no se puede deshacer.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.getByText("Eliminar")).toBeInTheDocument();
  });

  test("calls onClose when No button is clicked", () => {
    renderWithChakra(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        itemName="Test Item"
      />
    );

    fireEvent.click(screen.getByText("No"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("calls onConfirm when Eliminar button is clicked", () => {
    renderWithChakra(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        itemName="Test Item"
      />
    );

    fireEvent.click(screen.getByText("Eliminar"));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  test("does not render when isOpen is false", () => {
    renderWithChakra(
      <DeleteConfirmationModal
        isOpen={false}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        itemName="Test Item"
      />
    );

    expect(
      screen.queryByText(
        '¿Estás seguro de que deseas eliminar "Test Item"? Esta acción no se puede deshacer.'
      )
    ).not.toBeInTheDocument();
  });
});
