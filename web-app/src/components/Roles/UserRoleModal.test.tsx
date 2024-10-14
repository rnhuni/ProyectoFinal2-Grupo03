import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import UserRoleModal from "./UserRoleModal"; // El nuevo modal de asignación de roles
import "@testing-library/jest-dom";
import { User } from "../../interfaces/User";

describe("UserRoleModal", () => {
  const mockUsers: User[] = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@mail.com",
      role: "Administrador",
      status: "Active",
      createdAt: "2024-02-08",
      roles: [],
    },
  ];

  const mockAvailableRoles = ["Administrador", "Agente", "Soporte", "Cliente"];

  it("should render the modal when isOpen is true", () => {
    render(
      <ChakraProvider>
        <UserRoleModal
          isOpen={true}
          onClose={jest.fn()}
          mode="create"
          users={mockUsers}
          availableRoles={mockAvailableRoles}
        />
      </ChakraProvider>
    );
    expect(screen.getByText(/Asignar Rol/i)).toBeInTheDocument();
  });

  it("should not render the modal when isOpen is false", () => {
    render(
      <ChakraProvider>
        <UserRoleModal
          isOpen={false}
          onClose={jest.fn()}
          mode="create"
          users={mockUsers}
          availableRoles={mockAvailableRoles}
        />
      </ChakraProvider>
    );
    expect(screen.queryByText(/Asignar Rol/i)).not.toBeInTheDocument();
  });

  it("should display 'Asignar Rol' and 'Asignar' button in create mode", () => {
    render(
      <ChakraProvider>
        <UserRoleModal
          isOpen={true}
          onClose={jest.fn()}
          mode="create"
          users={mockUsers}
          availableRoles={mockAvailableRoles}
        />
      </ChakraProvider>
    );
    expect(screen.getByText(/Asignar Rol/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Asignar/i })
    ).toBeInTheDocument();
  });

  it("should display 'Editar Rol' and 'Guardar' button in edit mode", () => {
    render(
      <ChakraProvider>
        <UserRoleModal
          isOpen={true}
          onClose={jest.fn()}
          mode="edit"
          users={mockUsers}
          availableRoles={mockAvailableRoles}
        />
      </ChakraProvider>
    );
    expect(screen.getByText(/Editar Rol/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Guardar/i })
    ).toBeInTheDocument();
  });

  it("should call onClose when the modal is closed", () => {
    const onClose = jest.fn();
    render(
      <ChakraProvider>
        <UserRoleModal
          isOpen={true}
          onClose={onClose}
          mode="create"
          users={mockUsers}
          availableRoles={mockAvailableRoles}
        />
      </ChakraProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("should display an error message when required fields are missing", async () => {
    render(
      <ChakraProvider>
        <UserRoleModal
          isOpen={true}
          onClose={jest.fn()}
          mode="create"
          users={mockUsers}
          availableRoles={mockAvailableRoles}
        />
      </ChakraProvider>
    );

    // Simulamos un formulario vacío
    fireEvent.click(screen.getByRole("button", { name: /Asignar/i }));

    // Verificamos que los mensajes de error se muestren
    expect(
      await screen.findByText(/Debes seleccionar un usuario./i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/El rol es requerido./i)
    ).toBeInTheDocument();
  });
});
