import React from "react";
import { render, screen } from "@testing-library/react";
import Users from "./Users";
import { ChakraProvider } from "@chakra-ui/react";

// Componente envolvente para proporcionar el tema Chakra UI
const renderWithChakra = (ui: React.ReactNode) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe("Users Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render the user list", () => {
    renderWithChakra(<Users />);

    // Verificamos que los encabezados de la tabla de usuarios están presentes
    expect(screen.getByText("Nombre Completo")).toBeInTheDocument();
    expect(screen.getByText("Correo Electrónico")).toBeInTheDocument();
    expect(screen.getByText("Rol")).toBeInTheDocument();
    expect(screen.getByText("Estado")).toBeInTheDocument();
    expect(screen.getByText("Cliente")).toBeInTheDocument();
    expect(screen.getByText("Fecha de Creación")).toBeInTheDocument();
    expect(screen.getByText("Acciones")).toBeInTheDocument();

    // Verificamos que los usuarios están siendo renderizados
    expect(screen.getByText("Usuario 1")).toBeInTheDocument();
    expect(screen.getByText("Usuario 2")).toBeInTheDocument();
  });
});
