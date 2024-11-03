import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../internalization/i18n"; // Importa tu configuración de i18n
import { PermissionsModal } from "../Permissions/PermissionsModal";
import { Permission } from "../../interfaces/Permissions";
import usePermissions from "../../hooks/permissions/usePermissions";

// Mock de los hooks
jest.mock("../../hooks/permissions/usePermissions");

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <ChakraProvider>{ui}</ChakraProvider>
    </I18nextProvider>
  );
};

describe("PermissionsModal Component", () => {
  const onClose = jest.fn();
  const createPermission = jest.fn();
  const updatePermission = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    i18n.changeLanguage("es");
    (usePermissions as jest.Mock).mockReturnValue({
      createPermission,
      updatePermission,
      error: null,
      loading: false,
    });
  });

  test("should call createPermission when form is submitted in create mode", async () => {
    renderWithProviders(
      <PermissionsModal
        isOpen={true}
        onClose={onClose}
        initialData={{
          id: "",
          name: "",
          resource: "",
          description: "",
          createdAt: "",
          updatedAt: "",
        }}
        mode="create"
        setReloadData={jest.fn()}
      />
    );

    fireEvent.change(
      screen.getByLabelText(i18n.t("permissions.name", "Nombre")),
      {
        target: { value: "New Permission" },
      }
    );

    fireEvent.change(
      screen.getByLabelText(i18n.t("permissions.resource", "Recurso")),
      {
        target: { value: "Resource 1" },
      }
    );

    fireEvent.change(
      screen.getByLabelText(i18n.t("permissions.description", "Descripción")),
      {
        target: { value: "Description 1" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("common.button.create", "Crear"),
      })
    );

    await waitFor(() => {
      expect(createPermission).toHaveBeenCalledWith({
        id: "",
        name: "New Permission",
        resource: "Resource 1",
        description: "Description 1",
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("should call updatePermission when form is submitted in edit mode", async () => {
    const initialData: Permission = {
      id: "1",
      name: "Permission 1",
      resource: "Resource 1",
      description: "Description 1",
      createdAt: "2021-01-01",
      updatedAt: "2021-01-02",
    };

    renderWithProviders(
      <PermissionsModal
        isOpen={true}
        onClose={onClose}
        initialData={initialData}
        mode="edit"
        setReloadData={jest.fn()}
      />
    );

    fireEvent.change(
      screen.getByLabelText(i18n.t("permissions.name", "Nombre")),
      {
        target: { value: "Updated Permission" },
      }
    );

    fireEvent.change(
      screen.getByLabelText(i18n.t("permissions.resource", "Recurso")),
      {
        target: { value: "Updated Resource" },
      }
    );

    fireEvent.change(
      screen.getByLabelText(i18n.t("permissions.description", "Descripción")),
      {
        target: { value: "Updated Description" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("common.button.edit", "Editar"),
      })
    );

    await waitFor(() => {
      expect(updatePermission).toHaveBeenCalledWith({
        id: "1",
        name: "Updated Permission",
        resource: "Updated Resource",
        description: "Updated Description",
      });
      expect(onClose).toHaveBeenCalled();
    });
  });
});
