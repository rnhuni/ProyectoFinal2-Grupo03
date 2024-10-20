import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import UserFilterDrawer from "./UserFilterDrawer";

const renderWithChakra = (ui: React.ReactNode) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe("UserFilterDrawer Component", () => {
  const applyFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render drawer closed initially", () => {
    renderWithChakra(<UserFilterDrawer applyFilters={applyFilters} />);

    // El drawer no debe estar visible inicialmente
    expect(screen.queryByText("Filtros")).not.toBeInTheDocument();
  });

  test("should open drawer when filter button is clicked", () => {
    renderWithChakra(<UserFilterDrawer applyFilters={applyFilters} />);

    const filterButton = screen.getByText("Filtrar");
    fireEvent.click(filterButton);

    // El drawer debe abrirse
    expect(screen.getByText("Filtros")).toBeInTheDocument();
    expect(screen.getByText("Aplicar Filtro")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  test("should close drawer when cancel button is clicked", async () => {
    renderWithChakra(<UserFilterDrawer applyFilters={applyFilters} />);

    // Abrimos el drawer
    const filterButton = screen.getByText("Filtrar");
    fireEvent.click(filterButton);

    // Clic en el botón de cancelar
    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    // Esperamos que el drawer se cierre
    await waitFor(() => {
      expect(screen.queryByText("Filtros")).not.toBeInTheDocument();
    });
  });

  test("should show validation errors when form is submitted with empty fields", async () => {
    renderWithChakra(<UserFilterDrawer applyFilters={applyFilters} />);

    // Abrimos el drawer
    const filterButton = screen.getByText("Filtrar");
    fireEvent.click(filterButton);

    // Intentamos enviar el formulario vacío
    const applyButton = screen.getByText("Aplicar Filtro");
    fireEvent.click(applyButton);

    // Esperamos los errores de validación
    await waitFor(() => {
      expect(
        screen.getByText("Debes seleccionar un campo para buscar")
      ).toBeInTheDocument();
      expect(
        screen.getByText("El campo de búsqueda no puede estar vacío")
      ).toBeInTheDocument();
    });
  });
});
