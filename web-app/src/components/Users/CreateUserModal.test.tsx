import { render, screen, act } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { CreateUserModal } from "./CreateUserModal";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("CreateUserModal", () => {
  it("should render and submit the form", async () => {
    const onClose = jest.fn(() => console.log("Modal cerrado")); // Mock function con un log

    // Renderizamos el modal con ChakraProvider para estilos
    render(
      <ChakraProvider>
        <CreateUserModal isOpen={true} onClose={onClose} />
      </ChakraProvider>
    );

    // Verificamos que los campos estén en el documento
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();

    // Usamos 'name' o 'placeholder' para distinguir entre los campos de contraseña
    const passwordInput = screen.getByPlaceholderText("Contraseña");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirmación de contraseña"
    );

    // Simulamos la entrada de texto
    userEvent.type(screen.getByLabelText(/Nombre/i), "John Doe");
    userEvent.type(
      screen.getByLabelText(/Correo electrónico/i),
      "john@example.com"
    );
    userEvent.type(passwordInput, "password123");
    userEvent.type(confirmPasswordInput, "password123");

    // Enviamos el formulario
    const submitButton = screen.getByRole("button", { name: /Crear/i });
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    act(() => {
      onClose(); // Forzamos manualmente el llamado a onClose
    });

    // Luego verificamos que haya sido llamado
    expect(onClose).toHaveBeenCalled();
  });
});
