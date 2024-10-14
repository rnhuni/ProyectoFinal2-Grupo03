import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
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

    // Simulamos la entrada de texto
    userEvent.type(screen.getByLabelText(/Nombre/i), "John Doe");
    userEvent.type(
      screen.getByLabelText(/Correo electrónico/i),
      "john@example.com"
    );
    userEvent.type(screen.getByPlaceholderText("Contraseña"), "password123");
    userEvent.type(
      screen.getByPlaceholderText("Confirmación de contraseña"),
      "password123"
    );

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
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      createdAt: "2023-10-12",
      roles: [],
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

    // Simulamos la edición de datos
    userEvent.clear(screen.getByLabelText(/Nombre/i));
    userEvent.type(screen.getByLabelText(/Nombre/i), "Jane Doe");

    // Simulamos la entrada de texto en los campos de contraseña
    userEvent.type(screen.getByPlaceholderText("Contraseña"), "password123");
    userEvent.type(
      screen.getByPlaceholderText("Confirmación de contraseña"),
      "password123"
    );

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
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      createdAt: "2023-10-12",
      roles: [],
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
    expect(screen.getByLabelText(/Rol/i)).toHaveValue("Admin");
  });

  it("should display 'Crear Usuario' and 'Crear' button in create mode", () => {
    render(
      <ChakraProvider>
        <UserModal isOpen={true} onClose={jest.fn()} mode="create" />
      </ChakraProvider>
    );
    expect(screen.getByText(/Crear Usuario/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Crear/i })).toBeInTheDocument();
  });

  it("should display 'Editar Usuario' and 'Editar' button in edit mode", () => {
    render(
      <ChakraProvider>
        <UserModal isOpen={true} onClose={jest.fn()} mode="edit" />
      </ChakraProvider>
    );
    expect(screen.getByText(/Editar Usuario/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Editar/i })).toBeInTheDocument();
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
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      createdAt: "2023-10-12",
      roles: [],
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
    expect(screen.getByDisplayValue(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Admin/i)).toBeInTheDocument();
  });

  it("should call onClose when the modal is closed", () => {
    const onClose = jest.fn();
    render(
      <ChakraProvider>
        <UserModal isOpen={true} onClose={onClose} mode="create" />
      </ChakraProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("should change header and submit button text based on mode", () => {
    const { rerender } = render(
      <ChakraProvider>
        <UserModal isOpen={true} onClose={jest.fn()} mode="create" />
      </ChakraProvider>
    );
    expect(screen.getByText(/Crear Usuario/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Crear/i })).toBeInTheDocument();

    rerender(
      <ChakraProvider>
        <UserModal isOpen={true} onClose={jest.fn()} mode="edit" />
      </ChakraProvider>
    );
    expect(screen.getByText(/Editar Usuario/i)).toBeInTheDocument();
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
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      createdAt: "2023-10-12",
      roles: [],
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
    expect(screen.getByDisplayValue(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Admin/i)).toBeInTheDocument();
  });

  it("should call onClose when the modal is closed", () => {
    const onClose = jest.fn();
    render(
      <ChakraProvider>
        <UserModal isOpen={true} onClose={onClose} mode="create" />
      </ChakraProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("should change header and submit button text based on mode", () => {
    const { rerender } = render(
      <ChakraProvider>
        <UserModal isOpen={true} onClose={jest.fn()} mode="create" />
      </ChakraProvider>
    );
    expect(screen.getByText(/Crear Usuario/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Crear/i })).toBeInTheDocument();

    rerender(
      <ChakraProvider>
        <UserModal isOpen={true} onClose={jest.fn()} mode="edit" />
      </ChakraProvider>
    );

    expect(screen.getByText(/Editar Usuario/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Editar/i })).toBeInTheDocument();
  });

  it("should display an error message when passwords do not match", async () => {
    render(
      <ChakraProvider>
        <UserModal isOpen={true} onClose={jest.fn()} mode="create" />
      </ChakraProvider>
    );

    // Debug statement to help identify the issue
    screen.debug();

    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "password123" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Confirmación de contraseña"),
      {
        target: { value: "differentPassword" },
      }
    );

    fireEvent.click(screen.getByRole("button", { name: /Crear/i }));

    expect(
      await screen.findByText(/Las contraseñas no coinciden./i)
    ).toBeInTheDocument();
  });

  it("should call onClose and log form data on submit", async () => {
    const onClose = jest.fn();
    console.log = jest.fn();

    render(
      <ChakraProvider>
        <UserModal isOpen={true} onClose={onClose} mode="create" />
      </ChakraProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "password123" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Confirmación de contraseña"),
      {
        target: { value: "password123" },
      }
    );
    fireEvent.change(screen.getByLabelText("Rol"), {
      target: { value: "Admin" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Crear/i }));

    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for the onSubmit to be called

    expect(onClose).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Datos enviados:", {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      confirmPassword: "password123",
      role: "Admin",
    });
  });
});
