import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import RoleModal from "./RoleModal";
import i18n from "../../../i18nextConfig";
import { Role } from "../../interfaces/Role";
import usePermissions from "../../hooks/permissions/usePermissions";
import useRoles from "../../hooks/roles/useRoles";
import { ChakraProvider } from "@chakra-ui/react";

jest.mock("../../hooks/permissions/usePermissions");
jest.mock("../../hooks/roles/useRoles");

describe("RoleModal", () => {
  const onCloseMock = jest.fn();
  const createRoleMock = jest.fn();
  const reloadPermissionsMock = jest.fn();

  beforeEach(() => {
    i18n.changeLanguage("es");
    (usePermissions as jest.Mock).mockReturnValue({
      permissions: [{ id: "1", name: "Permission 1" }],
      reloadPermissions: reloadPermissionsMock,
    });
    (useRoles as jest.Mock).mockReturnValue({
      createRole: createRoleMock,
    });
  });

  test("should render modal in create mode", () => {
    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    expect(screen.getByText("Crear Rol")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nombre del Rol")).toBeInTheDocument();
  });

  test("should render modal in edit mode with initial data", () => {
    const initialData: Role = {
      id: "1",
      name: "Test Role",
      permissions: [{ id: "1", actions: ["read"] }],
    };

    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          initialData={initialData}
          mode="edit"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    expect(screen.getByText("Editar Rol")).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialData.name)).toBeInTheDocument();
    expect(screen.getByText("Permisos actuales")).toBeInTheDocument();
  });

  test("should call onClose when cancel button is clicked", () => {
    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("should display validation errors", async () => {
    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Crear" }));

    expect(
      await screen.findByText("El nombre es requerido") // role.validations.name
    ).toBeInTheDocument();
  });

  test("should call createRole on form submit in create mode", async () => {
    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Nombre del Rol"), {
      target: { value: "New Role" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(createRoleMock).toHaveBeenCalledWith({
        name: "New Role",
        permissions: [], // Reemplaza con los permisos que esperas enviar
      });
    });
  });

  test("should display error message when role already exists", async () => {
    createRoleMock.mockResolvedValue("Role already exists");

    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Nombre del Rol"), {
      target: { value: "Existing Role" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Crear" }));

    expect(
      await screen.findByText("role.validations.exists")
    ).toBeInTheDocument();
  });

  /*
  test("should call updateRole on form submit in edit mode", async () => {
    const initialData: Role = {
      id: "1",
      name: "Test Role",
      permissions: [{ id: "1", actions: ["read"] }],
    };

    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          initialData={initialData}
          mode="edit"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Nombre del Rol"), {
      target: { value: "Updated Role" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() => {
      expect(createRoleMock).toHaveBeenCalledWith({
        id: initialData.id, // Asegúrate de que el ID se pase correctamente
        name: "Updated Role",
        permissions: [{ id: "1", actions: [] }], // Reemplaza según tu lógica de permisos
      });
    });
  });
  */
});
