import { render, screen, fireEvent, act } from "@testing-library/react";
import { PermissionModal } from "./PermissionsModal"; // Ajusta la ruta según la estructura de tu proyecto
import { Permission } from "../../interfaces/Permissions"; // Ajusta la ruta según la estructura de tu proyecto

describe("PermissionModal", () => {
  const onCloseMock = jest.fn();
  const initialData: Permission = {
    id: 1,
    name: "Test Permission",
    description: "Test Description",
    status: "Active",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders create modal correctly", () => {
    render(
      <PermissionModal isOpen={true} onClose={onCloseMock} mode="create" />
    );

    expect(screen.getByText("Crear Permiso")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nombre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Descripción")).toBeInTheDocument();
  });

  test("renders edit modal correctly with initial data", () => {
    render(
      <PermissionModal
        isOpen={true}
        onClose={onCloseMock}
        initialData={initialData}
        mode="edit"
      />
    );

    expect(screen.getByText("Editar Permiso")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nombre")).toHaveValue(initialData.name);
    expect(screen.getByPlaceholderText("Descripción")).toHaveValue(
      initialData.description
    );
  });

  test("validates form and shows error messages", async () => {
    render(
      <PermissionModal isOpen={true} onClose={onCloseMock} mode="create" />
    );

    fireEvent.click(screen.getByText("Crear"));

    expect(
      await screen.findByText("El nombre debe tener al menos 3 caracteres.")
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        "La descripcion debe tener al menos 10 caracteres"
      )
    ).toBeInTheDocument();
  });

  test("submits form successfully", async () => {
    render(
      <PermissionModal isOpen={true} onClose={onCloseMock} mode="create" />
    );

    // Completa los campos del formulario dentro de act
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Nombre"), {
        target: { value: "New Permission" },
      });
      fireEvent.change(screen.getByPlaceholderText("Descripción"), {
        target: { value: "New Description" },
      });
    });

    // Haz clic en el botón "Crear" dentro de act
    await act(async () => {
      fireEvent.click(screen.getByText("Crear"));
    });

    // Verifica que onCloseMock haya sido llamado
    expect(onCloseMock).toHaveBeenCalled();
  });

  test("closes modal on Cancel button click", () => {
    render(
      <PermissionModal isOpen={true} onClose={onCloseMock} mode="create" />
    );

    fireEvent.click(screen.getByText("Cancelar"));

    expect(onCloseMock).toHaveBeenCalled();
  });
});
