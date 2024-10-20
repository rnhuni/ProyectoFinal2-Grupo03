import {
  render,
  fireEvent,
  screen,
  waitFor,
  renderHook,
  prettyDOM,
  getByTestId,
  getAllByAltText,
} from "@testing-library/react";
import RoleModal from "./RoleModal";
import i18n from "../../../i18nextConfig";
import { Role } from "../../interfaces/Role";
import usePermissions from "../../hooks/permissions/usePermissions";
import useRoles from "../../hooks/roles/useRoles";
import { ChakraProvider } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import userEvent from "@testing-library/user-event";

jest.mock("../../hooks/permissions/usePermissions");
jest.mock("../../hooks/roles/useRoles");

describe("RoleModal", () => {
  const onCloseMock = jest.fn();
  const createRoleMock = jest.fn();
  const reloadPermissionsMock = jest.fn();
  let mockHandleRequest: jest.Mock;

  beforeEach(() => {
    i18n.changeLanguage("es");
    mockHandleRequest = jest.fn();
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

  // OKR
  test("should call createRole on form submit in create mode error role.validations.exists", async () => {
    (useRoles as jest.Mock).mockReturnValue({
      createRole: jest.fn().mockResolvedValue("Role already exists"),
    });

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

    expect(
      await screen.findByText("role.validations.exists")
    ).toBeInTheDocument();
  });

  test("should call createRole on form submit in create mode error role.validations.permissions_required", async () => {
    (useRoles as jest.Mock).mockReturnValue({
      createRole: jest.fn().mockResolvedValue("permissions is required"),
    });

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

    expect(
      await screen.findByText("role.validations.permissions_required")
    ).toBeInTheDocument();
  });

  test("should call createRole on form submit in create mode error role.validations.permissions_list_values", async () => {
    (useRoles as jest.Mock).mockReturnValue({
      createRole: jest.fn().mockResolvedValue("list values"),
    });

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

    expect(
      await screen.findByText("role.validations.permissions_list_values")
    ).toBeInTheDocument();
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

describe("RoleModal handleCheckboxChange", () => {
  let mockSetValue: jest.Mock;
  let mockGetValues: jest.Mock;
  let setSelectedActions: jest.Mock;
  let mockReloadPermissions: jest.Mock;
  let mockCreateRole: jest.Mock;

  beforeEach(() => {
    // Mockeamos los métodos que usaremos en la prueba
    mockSetValue = jest.fn();
    mockGetValues = jest.fn(() => [
      { id: "1", actions: ["read"] },
      { id: "2", actions: ["write", "update"] },
    ]);

    setSelectedActions = jest.fn();
    mockReloadPermissions = jest.fn();
    mockCreateRole = jest.fn(); // Mockeamos el método createRole

    // Usamos jest.spyOn() para hacer mock de useForm
    jest.spyOn(require("react-hook-form"), "useForm").mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      reset: jest.fn(),
      setValue: mockSetValue,
      getValues: mockGetValues,
      formState: { errors: {} },
    });

    // Configuración de mock de usePermissions
    (usePermissions as jest.Mock).mockReturnValue({
      permissions: [
        { id: "1", actions: ["read"] },
        { id: "2", actions: ["write", "update"] },
      ],
      reloadPermissions: mockReloadPermissions,
    });

    // Configuración de mock de useRoles
    (useRoles as jest.Mock).mockReturnValue({
      createRole: mockCreateRole, // Mockeamos createRole
    });
  });

  const setup = () => {
    return render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={jest.fn()}
          mode="edit"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );
  };

  it("debería agregar una acción si no está seleccionada", () => {
    const screen = setup();
    const { getAllByLabelText } = screen;

    // screen.debug();

    // Obtenemos todos los elementos con el label "write"
    const checkboxes = getAllByLabelText("write");

    // Seleccionamos el primero o el que necesites (puedes ajustar el índice si hay varios)
    fireEvent.click(checkboxes[0]);
  });

  it("debería remover una acción si ya está seleccionada", () => {
    mockGetValues.mockReturnValue([
      { id: "1", actions: ["read"] },
      { id: "2", actions: ["write", "update", "delete"] },
    ]);

    const screen = setup();
    const { getAllByLabelText } = screen;

    const checkboxes = getAllByLabelText("delete");

    fireEvent.click(checkboxes[0]);
  });
});

describe("RoleModal handlePermissionSelect", () => {
  let mockSetValue: jest.Mock;
  let mockGetValues: jest.Mock;
  let setSelectedPermission: jest.Mock;
  let mockReloadPermissions: jest.Mock;
  let mockCreateRole: jest.Mock;

  beforeEach(() => {
    // Mockeamos los métodos que usaremos en la prueba
    mockSetValue = jest.fn();
    mockGetValues = jest.fn(() => [
      { id: "permission4", name: "permission4-name", actions: [] },
      { id: "permission5", name: "permission5-name", actions: [] },
      { id: "permission6", name: "permission6-name", actions: [] },
    ]);

    setSelectedPermission = jest.fn();
    mockReloadPermissions = jest.fn();
    mockCreateRole = jest.fn();

    // Usamos jest.spyOn() para hacer mock de useForm
    jest.spyOn(require("react-hook-form"), "useForm").mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      reset: jest.fn(),
      setValue: mockSetValue,
      getValues: mockGetValues,
      formState: { errors: {} },
    });

    // Configuración de mock de usePermissions
    (usePermissions as jest.Mock).mockReturnValue({
      permissions: [
        { id: "permission1", name: "permission1-name", actions: [] },
        { id: "permission2", name: "permission2-name", actions: [] },
        { id: "permission3", name: "permission3-name", actions: [] },
      ],
      reloadPermissions: mockReloadPermissions,
    });

    // Configuración de mock de useRoles
    (useRoles as jest.Mock).mockReturnValue({
      createRole: mockCreateRole,
    });
  });

  const setup = () => {
    return render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={jest.fn()}
          mode="edit"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );
  };

  it("debería agregar un nuevo permiso si no existe", () => {
    const screen = setup();

    // const { getAllByLabelText } = screen;

    // Simular un clic en el botón o checkbox correspondiente al nuevo permiso

    const selectElement = screen.getByRole("select");

    console.log(selectElement.innerHTML);

    // fireEvent.click(byRoleSelect);

    fireEvent.change(selectElement, { target: { value: "permission1-name" } });
  });
});
