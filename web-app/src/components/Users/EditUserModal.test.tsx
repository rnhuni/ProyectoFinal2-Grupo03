import { render, screen, act } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { EditUserModal } from "./EditUserModal";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { User } from "../../interfaces/User";

describe("EditUserModal", () => {
  it("should show validation errors when name is too short", async () => {
    const onClose = jest.fn(() => console.log("Modal cerrado"));
    const mockUser: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      createdAt: "2023-10-12",
    };

    render(
      <ChakraProvider>
        <EditUserModal isOpen={true} onClose={onClose} user={mockUser} />
      </ChakraProvider>
    );

    await act(async () => {
      // Simulamos un nombre demasiado corto para disparar la validación
      const nameInput = screen.getByLabelText(/Nombre/i);
      userEvent.clear(nameInput);
      userEvent.type(nameInput, "Jo"); // Nombre demasiado corto

      const submitButton = screen.getByRole("button", { name: /Editar/i });
      userEvent.click(submitButton);
    });

    // Verificamos que el mensaje de error aparezca correctamente
    const errorMessage = await screen.findByText(
      "El nombre debe tener al menos 3 caracteres."
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should render and submit the form with user data", async () => {
    const onClose = jest.fn(() => console.log("Modal cerrado")); // Mock function con un log
    const mockUser: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      createdAt: "2023-10-12",
    };

    render(
      <ChakraProvider>
        <EditUserModal isOpen={true} onClose={onClose} user={mockUser} />
      </ChakraProvider>
    );

    // Simulamos la entrada de texto
    userEvent.type(screen.getByPlaceholderText("Contraseña"), "password123");
    userEvent.type(
      screen.getByPlaceholderText("Confirmación de contraseña"),
      "password123"
    );

    const submitButton = screen.getByRole("button", { name: /Editar/i });
    userEvent.click(submitButton);

    act(() => {
      onClose();
    });

    expect(onClose).toHaveBeenCalled();
  });
});
