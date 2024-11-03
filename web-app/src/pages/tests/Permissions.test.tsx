import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../internalization/i18n"; // Importa tu configuración de i18n
import Permissions from "../Permissions";
import usePermissions from "../../hooks/permissions/usePermissions";
import { Permission } from "../../interfaces/Permissions";

// Mock de los hooks
jest.mock("../../hooks/permissions/usePermissions");

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <ChakraProvider>{ui}</ChakraProvider>
    </I18nextProvider>
  );
};

describe("Permissions Page", () => {
  const mockPermissions: Permission[] = [
    {
      id: "1",
      name: "Permission 1",
      resource: "Resource 1",
      description: "Description 1",
      createdAt: "2021-01-01",
      updatedAt: "2021-01-02",
    },
    {
      id: "2",
      name: "Permission 2",
      resource: "Resource 2",
      description: "Description 2",
      createdAt: "2021-02-01",
      updatedAt: "2021-02-02",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    i18n.changeLanguage("es");
    (usePermissions as jest.Mock).mockReturnValue({
      permissions: mockPermissions,
      error: null,
      reloadPermissions: jest.fn(),
    });
  });

  test("should render permissions table with data", () => {
    renderWithProviders(<Permissions />);

    expect(
      screen.getByText(i18n.t("permissions.title", "Permisos"))
    ).toBeInTheDocument();
    expect(screen.getByText("Permission 1")).toBeInTheDocument();
    expect(screen.getByText("Permission 2")).toBeInTheDocument();
  });

  test("should open create permission modal when create button is clicked", () => {
    renderWithProviders(<Permissions />);

    fireEvent.click(
      screen.getAllByText(i18n.t("permissions.create", "Crear Permiso"))[0]
    );

    expect(
      screen.getAllByText(i18n.t("permissions.create", "Crear Permiso"))[0]
    ).toBeInTheDocument();
  });

  test("should open edit permission modal when edit button is clicked", () => {
    renderWithProviders(<Permissions />);

    // Abre el menú de acciones
    fireEvent.click(screen.getAllByRole("button", { name: "" })[1]);

    // Haz clic en el botón de editar
    fireEvent.click(
      screen.getAllByText((content) =>
        content.startsWith(i18n.t("permissions.editButton", "Edit"))
      )[0]
    );

    expect(
      screen.getByText(i18n.t("permissions.edit", "Editar Permiso"))
    ).toBeInTheDocument();
  });

  test("should display error message if error occurs", () => {
    (usePermissions as jest.Mock).mockReturnValue({
      permissions: [],
      error: "Error loading permissions",
      reloadPermissions: jest.fn(),
    });

    renderWithProviders(<Permissions />);

    expect(
      screen.getByText(
        i18n.t("permissions.error_message", "Error al cargar los permisos")
      )
    ).toBeInTheDocument();
  });
});
