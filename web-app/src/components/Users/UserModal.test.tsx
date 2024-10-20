import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserModal } from "./UserModal";
import { ChakraProvider } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";

const renderWithChakra = (ui: React.ReactNode) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe("UserModal Component", () => {
  const onSave = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should display validation errors for empty form submission", async () => {
    renderWithChakra(
      <UserModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        mode="create"
      />
    );

    const submitButton = screen.getByText("Crear");
    fireEvent.click(submitButton);

    // Agregamos waitFor para manejar la validación asíncrona
    await waitFor(() => {
      expect(
        screen.getByText("El nombre debe tener al menos 3 caracteres.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Debe ser un correo válido.")
      ).toBeInTheDocument();
      expect(screen.getByText("El rol es requerido.")).toBeInTheDocument();
      expect(screen.getByText("El cliente es requerido.")).toBeInTheDocument();
    });
  });

  test("should close modal when cancel button is clicked", () => {
    renderWithChakra(
      <UserModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        mode="create"
      />
    );

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  test("should show validation errors when role and client_id are not selected", async () => {
    renderWithChakra(
      <UserModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        mode="create"
      />
    );

    // Llenamos los campos de nombre y correo electrónico pero no seleccionamos el rol ni el ID de cliente
    userEvent.type(screen.getByLabelText("Nombre"), "Pedro López");
    userEvent.type(
      screen.getByLabelText("Correo electrónico"),
      "pedro@example.com"
    );

    const submitButton = screen.getByText("Crear");
    fireEvent.click(submitButton);

    // Esperamos a que aparezcan los mensajes de error
    await waitFor(() => {
      expect(screen.getByText("El rol es requerido.")).toBeInTheDocument();
      expect(screen.getByText("El cliente es requerido.")).toBeInTheDocument();
    });
  });

  test("should close modal after saving in edit mode", async () => {
    const mockUser = {
      name: "Juan Pérez",
      email: "juan@example.com",
      role_id: "role-1",
      client_id: "client-123",
    };

    renderWithChakra(
      <UserModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={mockUser}
        mode="edit"
      />
    );

    const submitButton = screen.getByText("Editar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        name: "Juan Pérez",
        email: "juan@example.com",
        role_id: "role-1",
        client_id: "client-123",
      });
      expect(onClose).toHaveBeenCalled();
    });
  });
});
