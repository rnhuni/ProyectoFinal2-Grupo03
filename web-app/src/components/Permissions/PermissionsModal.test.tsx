import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { PermissionModal } from "./PermissionsModal";
import i18n from "../../../i18nextConfig";
import { Permission } from "../../interfaces/Permissions";
import usePermissions from "../../hooks/permissions/usePermissions";

jest.mock("../../hooks/permissions/usePermissions");

describe("PermissionModal loading state", () => {
  const onCloseMock = jest.fn();
  const createPermissionMock = jest.fn();

  beforeEach(() => {
    i18n.changeLanguage("es");
  });

  test("should display loading message when loading is true", () => {
    // Mocking the hook to simulate the loading state
    (usePermissions as jest.Mock).mockReturnValue({
      createPermission: createPermissionMock,
      error: null,
      loading: true, // Simulamos que está cargando
    });

    render(
      <PermissionModal isOpen={true} onClose={onCloseMock} mode="create" />
    );

    // Verificar que el spinner y el mensaje de carga estén presentes
    expect(
      screen.getByText("permissions.modal.loading_message")
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("chakra-alert"); // Verifica que hay un alert Chakra
  });
});

describe("PermissionModal error handling", () => {
  const onCloseMock = jest.fn();
  const createPermissionMock = jest.fn();

  beforeEach(() => {
    i18n.changeLanguage("es");
  });

  test("should display error message when an error occurs", async () => {
    // Mocking the hook to return an error
    (usePermissions as jest.Mock).mockReturnValue({
      createPermission: createPermissionMock,
      error: "An error occurred",
      loading: false,
    });

    render(
      <PermissionModal isOpen={true} onClose={onCloseMock} mode="create" />
    );

    // Verificar que el mensaje de error esté presente
    expect(
      screen.getByText("permissions.modal.error_message")
    ).toBeInTheDocument();
  });
});

describe("PermissionModal onSubmit", () => {
  const onCloseMock = jest.fn();
  const createPermissionMock = jest.fn();

  beforeEach(() => {
    // Set up mocks
    i18n.changeLanguage("es");
    (usePermissions as jest.Mock).mockReturnValue({
      createPermission: createPermissionMock,
      error: null,
      loading: false,
    });
  });

  test("should call handleSubmitAsyn and onClose on form submit", async () => {
    render(
      <PermissionModal isOpen={true} onClose={onCloseMock} mode="create" />
    );

    // Simulate filling out the form fields
    fireEvent.change(screen.getByPlaceholderText("permissions.name"), {
      target: { value: "Test Permission" },
    });
    fireEvent.change(screen.getByPlaceholderText("permissions.description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByPlaceholderText("permissions.resource"), {
      target: { value: "Test Resource" },
    });

    // Click the submit button
    fireEvent.click(
      screen.getByRole("button", { name: "common.button.create" })
    );

    // Wait for async actions to complete
    await waitFor(() => {
      expect(createPermissionMock).toHaveBeenCalledWith({
        name: "Test Permission",
        description: "Test Description",
        resource: "Test Resource",
        id: "",
      });
      expect(onCloseMock).toHaveBeenCalledTimes(1); // Ensure the modal closes
    });
  });
});

describe("PermissionModal", () => {
  const onCloseMock = jest.fn();
  const createPermissionMock = jest.fn();
  const updatePermissionMock = jest.fn(); // Agrega el mock para updatePermission

  beforeEach(() => {
    i18n.changeLanguage("es");
    (usePermissions as jest.Mock).mockReturnValue({
      createPermission: createPermissionMock,
      updatePermission: updatePermissionMock, // Mock de updatePermission
      error: null,
      loading: false,
    });
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

  test("should call updatePermission on form submit in edit mode", async () => {
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

    // Simulate filling out the form fields
    fireEvent.change(screen.getByPlaceholderText("permissions.name"), {
      target: { value: "Updated Permission" },
    });
    fireEvent.change(screen.getByPlaceholderText("permissions.description"), {
      target: { value: "Updated Description" },
    });
    fireEvent.change(screen.getByPlaceholderText("permissions.resource"), {
      target: { value: "Updated Resource" },
    });

    // Click the submit button
    fireEvent.click(screen.getByRole("button", { name: "common.button.edit" })); // Asegúrate de que el texto sea correcto

    // Wait for async actions to complete
    await waitFor(() => {
      expect(updatePermissionMock).toHaveBeenCalledWith({
        id: initialData.id, // Asegúrate de que el ID se pase correctamente
        name: "Updated Permission",
        description: "Updated Description",
        resource: "Updated Resource",
      });
    });
  });
});
