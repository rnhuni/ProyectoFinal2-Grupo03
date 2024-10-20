import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PlanFilterDrawer from "./PlanFilterDrawer";
import { ChakraProvider } from "@chakra-ui/react";

// Mock de la función applyFilters
const applyFiltersMock = jest.fn();

describe("PlanFilterDrawer", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
  });

  test("should open and close the drawer", async () => {
    render(
      <ChakraProvider>
        <PlanFilterDrawer applyFilters={applyFiltersMock} />
      </ChakraProvider>
    );

    // Verificar que el Drawer está cerrado inicialmente
    expect(screen.queryByText("Filtros")).not.toBeInTheDocument();

    // Abrimos el Drawer al hacer clic en el botón
    const openButton = screen.getByRole("button", { name: /Filtrar/i });
    fireEvent.click(openButton);

    // Verificamos que el Drawer está abierto
    expect(screen.getByText("Filtros")).toBeInTheDocument();

    // Cerramos el Drawer
    const closeButton = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(closeButton);

    // Verificar que el Drawer está cerrado nuevamente
    await waitFor(() => {
      expect(screen.queryByText("Filtros")).not.toBeInTheDocument();
    });
  });

  test("should display validation errors when submitting empty fields", async () => {
    render(
      <ChakraProvider>
        <PlanFilterDrawer applyFilters={applyFiltersMock} />
      </ChakraProvider>
    );

    // Abrir el Drawer
    fireEvent.click(screen.getByRole("button", { name: /Filtrar/i }));

    // Hacer clic en el botón "Aplicar Filtro" sin llenar los campos
    fireEvent.click(screen.getByRole("button", { name: /Aplicar Filtro/i }));

    // Verificar que se muestran los mensajes de error de validación
    expect(
      await screen.findByText("Debes seleccionar un campo para buscar")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("El campo de búsqueda no puede estar vacío")
    ).toBeInTheDocument();
  });

  test("should not call applyFilters when there are validation errors", async () => {
    render(
      <ChakraProvider>
        <PlanFilterDrawer applyFilters={applyFiltersMock} />
      </ChakraProvider>
    );

    // Abrir el Drawer
    fireEvent.click(screen.getByRole("button", { name: /Filtrar/i }));

    // Hacer clic en el botón "Aplicar Filtro" sin llenar los campos
    fireEvent.click(screen.getByRole("button", { name: /Aplicar Filtro/i }));

    // Asegurarse de que `applyFilters` no se haya llamado debido a errores de validación
    await waitFor(() => {
      expect(applyFiltersMock).not.toHaveBeenCalled();
    });
  });

  test("should close the drawer when 'Cancelar' is clicked", async () => {
    render(
      <ChakraProvider>
        <PlanFilterDrawer applyFilters={applyFiltersMock} />
      </ChakraProvider>
    );

    // Abrir el Drawer
    fireEvent.click(screen.getByRole("button", { name: /Filtrar/i }));

    // Verificar que el Drawer está abierto
    expect(screen.getByText("Filtros")).toBeInTheDocument();

    // Hacer clic en el botón "Cancelar"
    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));

    // Verificar que el Drawer está cerrado nuevamente
    await waitFor(() => {
      expect(screen.queryByText("Filtros")).not.toBeInTheDocument();
    });
  });
});
