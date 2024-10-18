import { render, fireEvent, screen } from "@testing-library/react";
import { PermissionModal } from "./PermissionsModal";
import i18n from "../../../i18nextConfig";
import { act } from "react";
import { Permission } from "../../interfaces/Permissions";

describe("PermissionModal", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    i18n.changeLanguage("es");
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
      id: "1",
      name: "Test Permission",
      description: "Test Description",
      resource: "resource",
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

    fireEvent.click(
      screen.getByRole("button", { name: "common.button.create" })
    );

    expect(
      await screen.findByText("permissions.validations.name")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("permissions.validations.description")
    ).toBeInTheDocument();
  });

  test("should call onClose and log data on valid submission", async () => {
    const logSpy = jest.spyOn(console, "log");
    render(
      <PermissionModal isOpen={true} onClose={onCloseMock} mode="create" />
    );

    fireEvent.change(screen.getByPlaceholderText("permissions.name"), {
      target: { value: "Permiso Válido" },
    });
    fireEvent.change(screen.getByPlaceholderText("permissions.description"), {
      target: { value: "Descripción Válida" },
    });
    fireEvent.change(screen.getByPlaceholderText("permissions.resource"), {
      target: { value: "resource" },
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "common.button.create" })
      );
    });

    expect(logSpy).toHaveBeenCalledWith("Datos enviados:", {
      name: "Permiso Válido",
      description: "Descripción Válida",
      resource: "resource",
    });

    logSpy.mockRestore();
  });
});
