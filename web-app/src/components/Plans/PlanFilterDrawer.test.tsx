import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PlanFilterDrawer from "./PlanFilterDrawer";
import { ChakraProvider } from "@chakra-ui/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../internalization/i18n"; // Importa tu configuración de i18n

// Mock de la función applyFilters
const applyFiltersMock = jest.fn();

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <ChakraProvider>{ui}</ChakraProvider>
    </I18nextProvider>
  );
};

describe("PlanFilterDrawer", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
    i18n.changeLanguage("es");
  });

  test("should open and close the drawer", async () => {
    renderWithProviders(<PlanFilterDrawer applyFilters={applyFiltersMock} />);

    // Verificar que el Drawer está cerrado inicialmente
    expect(
      screen.queryByText(i18n.t("filters.title", "Filtros"))
    ).not.toBeInTheDocument();

    // Abrimos el Drawer al hacer clic en el botón
    const openButton = screen.getByRole("button", {
      name: i18n.t("filters.open", "Filtrar"),
    });
    fireEvent.click(openButton);

    // Verificamos que el Drawer está abierto
    expect(
      screen.getByText(i18n.t("filters.title", "Filtros"))
    ).toBeInTheDocument();

    // Cerramos el Drawer
    const closeButton = screen.getByRole("button", {
      name: i18n.t("common.button.cancel", "Cancelar"),
    });
    fireEvent.click(closeButton);

    // Verificar que el Drawer está cerrado nuevamente
    await waitFor(() => {
      expect(
        screen.queryByText(i18n.t("filters.title", "Filtros"))
      ).not.toBeInTheDocument();
    });
  });

  test("should display validation errors when submitting empty fields", async () => {
    renderWithProviders(<PlanFilterDrawer applyFilters={applyFiltersMock} />);

    // Abrir el Drawer
    fireEvent.click(
      screen.getByRole("button", { name: i18n.t("filters.open", "Filtrar") })
    );

    // Hacer clic en el botón "Aplicar Filtro" sin llenar los campos
    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("filters.apply", "Aplicar Filtro"),
      })
    );

    // Verificar que se muestran los mensajes de error de validación
    expect(
      await screen.findByText(
        i18n.t(
          "filters.errors.fieldRequired",
          "Debes seleccionar un campo para buscar"
        )
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        i18n.t(
          "filters.errors.searchRequired",
          "El campo de búsqueda no puede estar vacío"
        )
      )
    ).toBeInTheDocument();
  });

  test("should not call applyFilters when there are validation errors", async () => {
    renderWithProviders(<PlanFilterDrawer applyFilters={applyFiltersMock} />);

    // Abrir el Drawer
    fireEvent.click(
      screen.getByRole("button", { name: i18n.t("filters.open", "Filtrar") })
    );

    // Hacer clic en el botón "Aplicar Filtro" sin llenar los campos
    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("filters.apply", "Aplicar Filtro"),
      })
    );

    // Asegurarse de que `applyFilters` no se haya llamado debido a errores de validación
    await waitFor(() => {
      expect(applyFiltersMock).not.toHaveBeenCalled();
    });
  });

  test("should close the drawer when 'Cancelar' is clicked", async () => {
    renderWithProviders(<PlanFilterDrawer applyFilters={applyFiltersMock} />);

    // Abrir el Drawer
    fireEvent.click(
      screen.getByRole("button", { name: i18n.t("filters.open", "Filtrar") })
    );

    // Verificar que el Drawer está abierto
    expect(
      screen.getByText(i18n.t("filters.title", "Filtros"))
    ).toBeInTheDocument();

    // Hacer clic en el botón "Cancelar"
    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("common.button.cancel", "Cancelar"),
      })
    );

    // Verificar que el Drawer está cerrado nuevamente
    await waitFor(() => {
      expect(
        screen.queryByText(i18n.t("filters.title", "Filtros"))
      ).not.toBeInTheDocument();
    });
  });
});
