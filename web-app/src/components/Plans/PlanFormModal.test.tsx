import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import PlanFormModal from "./PlanFormModal";
import { I18nextProvider } from "react-i18next";
import i18n from "../../internalization/i18n";
import { featuresList } from "../../data/FeaturesList";

// Mock data
const mockPlan = {
  id: "1",
  name: "Plan Básico",
  description: "Un plan básico",
  price: 100,
  features: [featuresList[0], featuresList[2]],
  status: "active",
  roles: [],
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

describe("PlanFormModal Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    i18n.changeLanguage("es");
  });

  test("should render modal elements correctly for create mode", () => {
    renderWithProviders(
      <PlanFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        plan={null}
        mode="create"
      />
    );

    expect(
      screen.getByText(i18n.t("plans.modal.create", "Crear Plan"))
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(i18n.t("plans.modal.name", "Nombre del Plan"))
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(i18n.t("plans.modal.description", "Descripción"))
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(i18n.t("plans.modal.price", "Precio"))
    ).toBeInTheDocument();

    // Verificar que se rendericen todas las características
    featuresList.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  test("should render modal elements correctly for edit mode and fill form with plan data", () => {
    renderWithProviders(
      <PlanFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        plan={mockPlan}
        mode="edit"
      />
    );

    expect(
      screen.getByText(i18n.t("plans.modal.edit", "Editar Plan"))
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(i18n.t("plans.modal.name", "Nombre del Plan"))
    ).toHaveValue(mockPlan.name);
    expect(
      screen.getByLabelText(i18n.t("plans.modal.description", "Descripción"))
    ).toHaveValue(mockPlan.description);
    expect(
      screen.getByLabelText(i18n.t("plans.modal.price", "Precio"))
    ).toHaveValue(mockPlan.price.toString());

    // Verificar que los checkboxes correctos estén marcados
    featuresList.forEach((feature) => {
      const checkbox = screen.getByLabelText(feature) as HTMLInputElement;
      if (mockPlan.features.includes(feature)) {
        expect(checkbox.checked).toBe(true);
      } else {
        expect(checkbox.checked).toBe(false);
      }
    });
  });

  test("should update plan features on checkbox change", () => {
    renderWithProviders(
      <PlanFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        plan={null}
        mode="create"
      />
    );

    const firstFeatureCheckbox = screen.getByLabelText(featuresList[0]);
    fireEvent.click(firstFeatureCheckbox);

    expect(firstFeatureCheckbox).toBeChecked();

    const secondFeatureCheckbox = screen.getByLabelText(featuresList[1]);
    fireEvent.click(secondFeatureCheckbox);

    expect(secondFeatureCheckbox).toBeChecked();
  });

  test("should close modal when cancel button is clicked", () => {
    renderWithProviders(
      <PlanFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        plan={null}
        mode="create"
      />
    );

    const cancelButton = screen.getByText(
      i18n.t("common.button.cancel", "Cancelar")
    );
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  test("should submit form when create button is clicked", async () => {
    renderWithProviders(
      <PlanFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        plan={null}
        mode="create"
      />
    );

    fireEvent.change(
      screen.getByLabelText(i18n.t("plans.modal.name", "Nombre del Plan")),
      {
        target: { value: "Nuevo plan" },
      }
    );

    fireEvent.change(
      screen.getByLabelText(i18n.t("plans.modal.description", "Descripción")),
      {
        target: { value: "Descripción del nuevo plan" },
      }
    );

    fireEvent.change(
      screen.getByLabelText(i18n.t("plans.modal.price", "Precio")),
      {
        target: { value: 200 },
      }
    );

    const firstFeatureCheckbox = screen.getByLabelText(featuresList[0]);
    fireEvent.click(firstFeatureCheckbox);

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("common.button.create", "Crear"),
      })
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("should submit form when edit button is clicked", async () => {
    renderWithProviders(
      <PlanFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        plan={mockPlan}
        mode="edit"
      />
    );

    fireEvent.change(
      screen.getByLabelText(i18n.t("plans.modal.name", "Nombre del Plan")),
      {
        target: { value: "Plan Editado" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("common.button.edit", "Editar"),
      })
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Plan Editado" })
      );
      expect(onClose).toHaveBeenCalled();
    });
  });
});
