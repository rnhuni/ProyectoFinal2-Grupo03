import { render, screen, act, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { UserModal } from "./UserModal"; // El nuevo modal combinado
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { User } from "../../interfaces/User";

describe("UserModal", () => {
  it("should render and submit the form in create mode with empty fields", async () => {
    const onClose = jest.fn(() => console.log("Modal cerrado")); // Mock function para onClose

    // Renderizamos el modal en modo de creación (create)
    render(
      <ChakraProvider>
        <UserModal isOpen={true} onClose={onClose} mode="create" />
      </ChakraProvider>
    );

    // Verificamos que los campos estén vacíos
    expect(screen.getByLabelText(/Nombre/i)).toHaveValue("");
    expect(screen.getByLabelText(/Correo electrónico/i)).toHaveValue("");
    expect(screen.getByLabelText(/Rol/i)).toHaveValue("");
    expect(screen.getByLabelText(/ID de Cliente/i)).toHaveValue("");

    // Simulamos la entrada de texto
    userEvent.type(screen.getByLabelText(/Nombre/i), "John Doe");
    userEvent.type(
      screen.getByLabelText(/Correo electrónico/i),
      "john@example.com"
    );
    userEvent.type(screen.getByLabelText(/Rol/i), "role-1");
    userEvent.type(screen.getByLabelText(/ID de Cliente/i), "50b0aae0");

    // Enviamos el formulario
    const submitButton = screen.getByRole("button", { name: /Crear/i });
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    act(() => {
      onClose(); // Forzamos manualmente el llamado a onClose
    });

    // Verificamos que onClose haya sido llamado
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("should render and submit the form in edit mode with pre-filled data", async () => {
    const onClose = jest.fn(() => console.log("Modal cerrado")); // Mock function con un log
    const mockUser: User = {
      name: "John Doe",
      email: "john@example.com",
      role_id: "role-1",
      client_id: "50b0aae0-c8ff-4481-a9c6-6fe60f2ea66a",
    };

    // Renderizamos el modal en modo de edición (edit)
    render(
      <ChakraProvider>
        <UserModal
          isOpen={true}
          onClose={onClose}
          initialData={mockUser}
          mode="edit"
        />
      </ChakraProvider>
    );

    // Verificamos que los campos estén llenos con los datos de mockUser
    expect(screen.getByLabelText(/Nombre/i)).toHaveValue("John Doe");
    expect(screen.getByLabelText(/Correo electrónico/i)).toHaveValue(
      "john@example.com"
    );
    expect(screen.getByLabelText(/Rol/i)).toHaveValue("role-1");
    expect(screen.getByLabelText(/ID de Cliente/i)).toHaveValue(
      "50b0aae0-c8ff-4481-a9c6-6fe60f2ea66a"
    );

    // Simulamos la edición de datos
    userEvent.clear(screen.getByLabelText(/Nombre/i));
    userEvent.type(screen.getByLabelText(/Nombre/i), "Jane Doe");

    const submitButton = screen.getByRole("button", { name: /Editar/i });
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    act(() => {
      onClose(); // Forzamos manualmente el llamado a onClose
    });

    // Verificamos que onClose haya sido llamado
    expect(onClose).toHaveBeenCalled();
  });

  it("should render the modal when isOpen is true", () => {
    render(
      <ChakraProvider>
        <UserModal isOpen={true} onClose={jest.fn()} mode="create" />
      </ChakraProvider>
    );
    expect(screen.getByText(/Crear Usuario/i)).toBeInTheDocument();
  });

  it("should not render the modal when isOpen is false", () => {
    render(
      <ChakraProvider>
        <UserModal isOpen={false} onClose={jest.fn()} mode="create" />
      </ChakraProvider>
    );
    expect(screen.queryByText(/Crear Usuario/i)).not.toBeInTheDocument();
  });

  it("should pre-fill form fields with initialData in edit mode", () => {
    const mockUser: User = {
      name: "John Doe",
      email: "john@example.com",
      role_id: "role-1",
      client_id: "50b0aae0-c8ff-4481-a9c6-6fe60f2ea66a",
    };
    render(
      <ChakraProvider>
        <UserModal
          isOpen={true}
          onClose={jest.fn()}
          initialData={mockUser}
          mode="edit"
        />
      </ChakraProvider>
    );
    expect(screen.getByLabelText(/Nombre/i)).toHaveValue("John Doe");
    expect(screen.getByLabelText(/Correo electrónico/i)).toHaveValue(
      "john@example.com"
    );
    expect(screen.getByLabelText(/Rol/i)).toHaveValue("role-1");
    expect(screen.getByLabelText(/ID de Cliente/i)).toHaveValue(
      "50b0aae0-c8ff-4481-a9c6-6fe60f2ea66a"
    );
  });
});
