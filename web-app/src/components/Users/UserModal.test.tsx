import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserModal } from "./UserModal";
import { ChakraProvider } from "@chakra-ui/react";
import i18n from "../../../i18nextConfig"; // Importar configuración de internacionalización
import useUsers from "../../hooks/users/useUser";
import useRoles from "../../hooks/roles/useRoles";
import { User } from "../../interfaces/User";

// Mock de los hooks
jest.mock("../../hooks/users/useUser");
jest.mock("../../hooks/roles/useRoles");

describe("UserModal Component", () => {
  const onCloseMock = jest.fn();
  const onSaveMock = jest.fn();
  const createUserMock = jest.fn();
  const updateUserMock = jest.fn();

  beforeEach(() => {
    i18n.changeLanguage("es"); // Cambiar a español para las pruebas
    jest.clearAllMocks();
    (useUsers as jest.Mock).mockReturnValue({
      createUser: createUserMock,
      updateUser: updateUserMock,
      error: null,
      loading: false,
    });
    (useRoles as jest.Mock).mockReturnValue({
      roles: [{ id: "role1", name: "Admin" }],
      reloadRoles: jest.fn(),
      error: null,
      loading: false,
    });
  });

  test("should display validation errors for empty fields in create mode", async () => {
    render(
      <ChakraProvider>
        <UserModal
          isOpen={true}
          onClose={onCloseMock}
          onSave={onSaveMock}
          mode="create"
        />
      </ChakraProvider>
    );

    // Simulamos el clic en el botón de crear sin llenar los campos
    fireEvent.click(screen.getByRole("button", { name: /Crear/i }));

    // Esperamos a que aparezcan los mensajes de error
    await waitFor(() => {
      expect(screen.getByText("users.validations.name")).toBeInTheDocument();
      expect(screen.getByText("users.validations.email")).toBeInTheDocument();
      expect(screen.getByText("users.validations.role")).toBeInTheDocument();
      expect(screen.getByText("users.validations.client")).toBeInTheDocument();
    });
  });

  test("should call createUser on form submit in create mode", async () => {
    render(
      <ChakraProvider>
        <UserModal
          isOpen={true}
          onClose={onCloseMock}
          onSave={onSaveMock}
          mode="create"
        />
      </ChakraProvider>
    );

    // Llenamos los campos
    fireEvent.change(screen.getByPlaceholderText(/Nombre/i), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Correo electrónico/i), {
      target: { value: "juan@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/ID de Cliente/i), {
      target: { value: "Client1" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "role1" }, // Seleccionamos un rol
    });

    // Simulamos el clic en el botón de crear
    fireEvent.click(screen.getByRole("button", { name: /Crear/i }));

    // Esperamos a que la función `createUser` sea llamada con los valores correctos
    await waitFor(() => {
      expect(createUserMock).toHaveBeenCalledWith({
        name: "Juan Pérez",
        email: "juan@example.com",
        role_id: "role1",
        client_id: "Client1",
      });
      expect(onCloseMock).toHaveBeenCalledTimes(1); // Verificamos que el modal se cierre
    });
  });

  test("should display initial values in edit mode", () => {
    const initialData: User = {
      name: "Juan Pérez",
      email: "juan@example.com",
      role_id: "role1",
      client_id: "Client1",
    };

    render(
      <ChakraProvider>
        <UserModal
          isOpen={true}
          onClose={onCloseMock}
          onSave={onSaveMock}
          mode="edit"
          initialData={initialData}
        />
      </ChakraProvider>
    );

    // Verificamos que los valores iniciales estén en el formulario
    expect(screen.getByDisplayValue("Juan Pérez")).toBeInTheDocument();
    expect(screen.getByDisplayValue("juan@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Client1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Admin")).toBeInTheDocument(); // El rol se muestra como Admin
  });

  test("should call updateUser on form submit in edit mode", async () => {
    const initialData: User = {
      name: "Juan Pérez",
      email: "juan@example.com",
      role_id: "role1",
      client_id: "Client1",
    };

    render(
      <ChakraProvider>
        <UserModal
          isOpen={true}
          onClose={onCloseMock}
          onSave={onSaveMock}
          mode="edit"
          initialData={initialData}
        />
      </ChakraProvider>
    );

    // Cambiamos el valor del campo "name"
    fireEvent.change(screen.getByPlaceholderText(/Nombre/i), {
      target: { value: "Pedro Gómez" },
    });

    // Simulamos el clic en el botón de editar
    fireEvent.click(screen.getByRole("button", { name: /Editar/i }));

    // Esperamos a que la función `updateUser` sea llamada con los valores actualizados
    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledWith({
        name: "Pedro Gómez",
        email: "juan@example.com",
        role_id: "role1",
        client_id: "Client1",
      });
      expect(onCloseMock).toHaveBeenCalledTimes(1); // Verificamos que el modal se cierre
    });
  });

  test("should display error message if rolesError occurs", () => {
    (useRoles as jest.Mock).mockReturnValue({
      roles: [],
      reloadRoles: jest.fn(),
      error: "Error loading roles",
      loading: false,
    });

    render(
      <ChakraProvider>
        <UserModal
          isOpen={true}
          onClose={onCloseMock}
          onSave={onSaveMock}
          mode="create"
        />
      </ChakraProvider>
    );

    expect(screen.getByText(/Error/i)).toBeInTheDocument();
  });

  test("should close modal when cancel button is clicked", () => {
    render(
      <ChakraProvider>
        <UserModal
          isOpen={true}
          onClose={onCloseMock}
          onSave={onSaveMock}
          mode="create"
        />
      </ChakraProvider>
    );

    // Simulamos el clic en el botón de cancelar
    fireEvent.click(screen.getByText("Cancelar"));

    // Verificamos que la función `onClose` se haya llamado
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("should display error toast when user creation fails", async () => {
    // Simulamos que createUser falla
    const createUserMock = jest
      .fn()
      .mockRejectedValueOnce(new Error("Creation failed"));

    (useUsers as jest.Mock).mockReturnValue({
      createUser: createUserMock,
      updateUser: jest.fn(),
      error: null,
      loading: false,
    });

    render(
      <ChakraProvider>
        <UserModal
          isOpen={true}
          onClose={onCloseMock}
          onSave={onSaveMock}
          mode="create"
        />
      </ChakraProvider>
    );

    // Llenamos los campos del formulario
    fireEvent.change(screen.getByPlaceholderText(/Nombre/i), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Correo electrónico/i), {
      target: { value: "juan@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/ID de Cliente/i), {
      target: { value: "Client1" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "role1" },
    });

    // Simulamos el clic en el botón de crear
    fireEvent.click(screen.getByRole("button", { name: /Crear/i }));

    // Esperamos a que se dispare el toast de error
    await waitFor(() => {
      expect(createUserMock).toHaveBeenCalled(); // Verificamos que se intentó crear el usuario
      // Verificamos que el toast de error fue mostrado con los mensajes correctos
      expect(screen.getByText("Error.")).toBeInTheDocument();
      expect(
        screen.getByText("Ocurrió un error al procesar el usuario.")
      ).toBeInTheDocument();
    });
  });
});
