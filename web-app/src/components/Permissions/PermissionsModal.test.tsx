import { render, fireEvent, screen } from "@testing-library/react";
import { PermissionModal } from "./PermissionsModal";
import i18n from "../../../i18nextConfig"; // Asegúrate de que la ruta sea correcta
import { act } from "react";
import { Permission } from "../../interfaces/Permissions";

describe("PermissionModal", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    i18n.changeLanguage("es"); // Cambia el idioma a español para las pruebas
  });

  test("should render modal in create mode", () => {
    render(
      <PermissionModal isOpen={true} onClose={onCloseMock} mode="create" />
    );

    expect(screen.getByText("permissions.modal.create")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("permissions.name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("permissions.description")
    ).toBeInTheDocument();
  });

  test("should render modal in edit mode with initial data", () => {
    const initialData: Permission = {
      id: 1,
      name: "Test Permission",
      description: "Test Description",
      status: "Active",
    };

    render(
      <PermissionModal
        isOpen={true}
        onClose={onCloseMock}
        initialData={initialData}
        mode="edit"
      />
    );

    expect(screen.getByText("permissions.modal.edit")).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialData.name)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(initialData.description)
    ).toBeInTheDocument();
  });

  test("should call onClose when cancel button is clicked", () => {
    render(
      <PermissionModal isOpen={true} onClose={onCloseMock} mode="create" />
    );

    const cancelButton = screen.getByText("common.button.cancel");
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("should display validation errors", async () => {
    render(
      <PermissionModal isOpen={true} onClose={onCloseMock} mode="create" />
    );

    // Intentar enviar el formulario vacío
    fireEvent.click(
      screen.getByRole("button", { name: "common.button.create" })
    );

    // Verifica que se muestre el mensaje de error
    expect(
      await screen.findByText("permissions.validations.name")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("permissions.validations.description")
    ).toBeInTheDocument();
  });

  test("should call onClose and log data on valid submission", async () => {
    const logSpy = jest.spyOn(console, "log"); // Espía el console.log

    render(
      <PermissionModal isOpen={true} onClose={onCloseMock} mode="create" />
    );

    // Completa el formulario
    fireEvent.change(screen.getByPlaceholderText("permissions.name"), {
      target: { value: "Permiso Válido" },
    });
    fireEvent.change(screen.getByPlaceholderText("permissions.description"), {
      target: { value: "Descripción Válida" },
    });

    // Envía el formulario
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "common.button.create" })
      );
    });

    expect(logSpy).toHaveBeenCalledWith("Datos enviados:", {
      name: "Permiso Válido",
      description: "Descripción Válida",
      status: "Active",
    });

    logSpy.mockRestore(); // Restablece el espía
  });
});
