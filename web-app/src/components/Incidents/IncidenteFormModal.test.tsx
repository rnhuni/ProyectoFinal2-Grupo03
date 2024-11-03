import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../internalization/i18n"; // Importa tu configuración de i18n
import IncidentFormModal from "./IncidentFormModal";
import { Incident } from "../../interfaces/Incidents";

// Mock data
const mockIncident: Incident = {
  id: "1",
  type: "technical",
  description: "Test description",
  attachments: [],
  contact: {
    phone: "1234567890",
  },
};

// Mock funciones
const onSave = jest.fn();
const onClose = jest.fn();

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <ChakraProvider>{ui}</ChakraProvider>
    </I18nextProvider>
  );
};

beforeAll(() => {
  global.URL.createObjectURL = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("IncidentFormModal Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    i18n.changeLanguage("es");
  });

  test("should render modal elements correctly for create mode", () => {
    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={null}
        mode="create"
      />
    );

    expect(
      screen.getByText(
        i18n.t("incidentScreen.tittle", "Crear registro de incidente")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(i18n.t("incidentScreen.type", "Tipo de incidente"))
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        i18n.t("incidentScreen.description", "Descripción del incidente")
      )
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        i18n.t("incidentScreen.attachment", "Adjuntar archivos")
      ).length
    ).toBeGreaterThan(0);
  });

  test("should render modal elements correctly for edit mode and fill form with incident data", () => {
    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={mockIncident}
        mode="edit"
      />
    );

    expect(
      screen.getByText(
        i18n.t("incidentScreen.tittle", "Crear registro de incidente")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(i18n.t("incidentScreen.type", "Tipo de incidente"))
    ).toHaveValue(mockIncident.type);
    expect(
      screen.getByLabelText(
        i18n.t("incidentScreen.description", "Descripción del incidente")
      )
    ).toHaveValue(mockIncident.description);
  });

  test("should display validation errors when submitting empty fields", async () => {
    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={null}
        mode="create"
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("incidentScreen.createIncident", "Crear incidente"),
      })
    );

    expect(
      await screen.findByText(
        i18n.t(
          "incidentScreen.errors.typeRequired",
          "El tipo de incidente es obligatorio"
        )
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        i18n.t(
          "incidentScreen.errors.incidentDescriptionRequired",
          "La descripción del incidente es obligatoria"
        )
      )
    ).toBeInTheDocument();
  });

  test("should call onSave with form data when form is submitted", async () => {
    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={null}
        mode="create"
      />
    );

    fireEvent.change(
      screen.getByLabelText(i18n.t("incidentScreen.type", "Tipo de incidente")),
      {
        target: { value: "technical" },
      }
    );

    fireEvent.change(
      screen.getByLabelText(
        i18n.t("incidentScreen.description", "Descripción del incidente")
      ),
      {
        target: { value: "Test description" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("incidentScreen.createIncident", "Crear incidente"),
      })
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        id: undefined,
        type: "technical",
        description: "Test description",
        attachments: [],
      });
    });
  });

  test("should handle file upload correctly", async () => {
    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={null}
        mode="create"
      />
    );

    const file = new File(["dummy content"], "example.csv", {
      type: "text/csv",
    });

    const input = screen.getByTestId("fileInput");
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("example.csv")).toBeInTheDocument();
    });
  });

  test("should trigger file input click when attachment button is clicked", () => {
    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={null}
        mode="create"
      />
    );

    const fileInput = screen.getByTestId("fileInput");
    const attachmentButton = screen.getByRole("button", {
      name: i18n.t("incidentScreen.attachment", "Adjuntar archivos"),
    });

    // Mock the click event on the file input
    const clickMock = jest.fn();
    fileInput.click = clickMock;

    // Simulate click on the attachment button
    fireEvent.click(attachmentButton);

    // Verify that the click event on the file input was triggered
    expect(clickMock).toHaveBeenCalled();
  });

  test("should update progress bar correctly during file upload", async () => {
    jest.useFakeTimers();
    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={null}
        mode="create"
      />
    );

    const file = new File(["dummy content"], "example.csv", {
      type: "text/csv",
    });

    const input = screen.getByTestId("fileInput");
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("example.csv")).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "10"
    );

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100"
    );

    jest.useRealTimers();
  });

  test("should call onSave with form data including attachments when form is submitted", async () => {
    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={null}
        mode="create"
      />
    );

    const file = new File(["dummy content"], "example.csv", {
      type: "text/csv",
    });

    const input = screen.getByTestId("fileInput");
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("example.csv")).toBeInTheDocument();
    });

    fireEvent.change(
      screen.getByLabelText(i18n.t("incidentScreen.type", "Tipo de incidente")),
      {
        target: { value: "technical" },
      }
    );

    fireEvent.change(
      screen.getByLabelText(
        i18n.t("incidentScreen.description", "Descripción del incidente")
      ),
      {
        target: { value: "Test description" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("incidentScreen.createIncident", "Crear incidente"),
      })
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        id: undefined,
        type: "technical",
        description: "Test description",
        attachments: [
          {
            id: expect.any(String),
            file_name: "example.csv",
            content_type: "text/csv",
            file_uri: expect.any(String),
          },
        ],
      });
    });
  });

  test("should close modal when cancel button is clicked", () => {
    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={null}
        mode="create"
      />
    );

    fireEvent.click(
      screen.getByText(
        i18n.t("incidentScreen.modalAttachment.cancelButton", "Cancelar")
      )
    );

    expect(onClose).toHaveBeenCalled();
  });
});
