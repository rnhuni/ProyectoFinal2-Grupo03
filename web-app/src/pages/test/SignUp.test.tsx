// SignUp.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SignUpForm from "../SignUp";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

// Utility function to render the component with necessary providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ChakraProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </ChakraProvider>
  );
};

// Función personalizada para buscar elementos por estilo

describe("SignUpForm Component", () => {
  beforeEach(() => {
    // Reset cualquier mock o estado antes de cada test
    jest.clearAllMocks();
  });

  test("renders correctly", () => {
    renderWithProviders(<SignUpForm />);

    // Verificar que todos los campos y botones se rendericen
    expect(screen.getByText("Vamos a empezar")).toBeInTheDocument();
    expect(
      screen.getByText("Completa la información para registrarte")
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Apellido")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByLabelText("País")).toBeInTheDocument();
    expect(screen.getByLabelText("Ciudad")).toBeInTheDocument();
    expect(screen.getByLabelText("Número de teléfono")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar Contraseña")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Empezar/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/¿Ya tienes una cuenta\?/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Inicia sesión/i })
    ).toBeInTheDocument();
  });

  test("enables submit button when form is valid", async () => {
    renderWithProviders(<SignUpForm />);

    // Llenar campos con datos válidos
    await userEvent.type(screen.getByLabelText("Nombre"), "Juan");
    await userEvent.type(screen.getByLabelText("Apellido"), "Pérez");
    await userEvent.type(
      screen.getByLabelText("Correo electrónico"),
      "juan.perez@example.com"
    );
    await userEvent.selectOptions(screen.getByLabelText("País"), "Colombia");
    await userEvent.selectOptions(screen.getByLabelText("Ciudad"), "Bogotá");
    await userEvent.type(
      screen.getByLabelText("Número de teléfono"),
      "3001234567"
    );
    await userEvent.type(screen.getByLabelText("Contraseña"), "password123");
    await userEvent.type(
      screen.getByLabelText("Confirmar Contraseña"),
      "password123"
    );

    // Verificar que el botón está habilitado
    const submitButton = screen.getByRole("button", { name: /Empezar/i });
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  test("submits the form with valid data", async () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    renderWithProviders(<SignUpForm />);

    // Llenar campos con datos válidos
    await userEvent.type(screen.getByLabelText("Nombre"), "Juan");
    await userEvent.type(screen.getByLabelText("Apellido"), "Pérez");
    await userEvent.type(
      screen.getByLabelText("Correo electrónico"),
      "juan.perez@example.com"
    );
    await userEvent.selectOptions(screen.getByLabelText("País"), "Colombia");
    await userEvent.selectOptions(screen.getByLabelText("Ciudad"), "Bogotá");
    await userEvent.type(
      screen.getByLabelText("Número de teléfono"),
      "3001234567"
    );
    await userEvent.type(screen.getByLabelText("Contraseña"), "password123");
    await userEvent.type(
      screen.getByLabelText("Confirmar Contraseña"),
      "password123"
    );

    const submitButton = screen.getByRole("button", { name: /Empezar/i });
    await userEvent.click(submitButton);

    // Esperar a que console.log sea llamado con los datos correctos
    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith({
        nombre: "Juan",
        apellido: "Pérez",
        correo: "juan.perez@example.com",
        pais: "Colombia",
        ciudad: "Bogotá",
        telefono: "3001234567",
        contraseña: "password123",
        confirmarContraseña: "password123",
      });
    });

    consoleLogSpy.mockRestore();
  });

  test("navigates to /signin when clicking on 'Inicia sesión' link", () => {
    renderWithProviders(<SignUpForm />);

    const signInLink = screen.getByRole("link", { name: /Inicia sesión/i });
    expect(signInLink).toHaveAttribute("href", "/signin");
  });

  /////
  test("shows validation error for invalid email and phone number", async () => {
    renderWithProviders(<SignUpForm />);

    // Simular la entrada de datos inválidos
    await userEvent.type(
      screen.getByLabelText("Correo electrónico"),
      "invalid-email"
    );
    await userEvent.type(screen.getByLabelText("Número de teléfono"), "123");
    await userEvent.type(screen.getByLabelText("Contraseña"), "12345");
    await userEvent.type(
      screen.getByLabelText("Confirmar Contraseña"),
      "123456"
    );

    // Hacer clic en el botón de envío
    const submitButton = screen.getByRole("button", { name: /Empezar/i });
    await userEvent.click(submitButton);

    // Esperar y verificar la aparición de los mensajes de error
    await waitFor(() => {
      expect(
        screen.getByText("Correo electrónico inválido")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Número de teléfono inválido")
      ).toBeInTheDocument();
      expect(
        screen.getByText("La contraseña debe tener al menos 6 caracteres")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Las contraseñas no coinciden")
      ).toBeInTheDocument();
    });
  });
  ////
});
