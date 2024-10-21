import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import PlanFormModal from "./PlanFormModal";
import i18n from "../../../i18nextConfig";
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

const renderWithChakra = (ui: React.ReactNode) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe("PlanFormModal Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    i18n.changeLanguage("es");
  });

  test("should render modal elements correctly for create mode", () => {
    renderWithChakra(
      <PlanFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        plan={null}
        mode="create"
      />
    );

    expect(screen.getByText("plans.modal.create")).toBeInTheDocument();
    expect(screen.getByLabelText("plans.modal.name")).toBeInTheDocument();
    expect(
      screen.getByLabelText("plans.modal.description")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("plans.modal.price")).toBeInTheDocument();

    // Verificar que se rendericen todas las características
    featuresList.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  test("should render modal elements correctly for edit mode and fill form with plan data", () => {
    renderWithChakra(
      <PlanFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        plan={mockPlan}
        mode="edit"
      />
    );

    expect(screen.getByText("plans.modal.edit")).toBeInTheDocument();
    expect(screen.getByLabelText("plans.modal.name")).toHaveValue(
      mockPlan.name
    );
    expect(screen.getByLabelText("plans.modal.description")).toHaveValue(
      mockPlan.description
    );
    expect(screen.getByLabelText("plans.modal.price")).toHaveValue(
      mockPlan.price.toString()
    );

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
    renderWithChakra(
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
    renderWithChakra(
      <PlanFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        plan={null}
        mode="create"
      />
    );

    const cancelButton = screen.getByText("common.button.cancel");
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  test("should submit form when create button is clicked", async () => {
    renderWithChakra(
      <PlanFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        plan={null}
        mode="create"
      />
    );

    fireEvent.change(screen.getByLabelText("plans.modal.name"), {
      target: { value: "Nuevo plan" },
    });

    fireEvent.change(screen.getByLabelText("plans.modal.description"), {
      target: { value: "Descripción del nuevo plan" },
    });

    fireEvent.change(screen.getByLabelText("plans.modal.price"), {
      target: { value: 200 },
    });

    const firstFeatureCheckbox = screen.getByLabelText(featuresList[0]);
    fireEvent.click(firstFeatureCheckbox);

    fireEvent.click(
      screen.getByRole("button", { name: "common.button.create" })
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("should submit form when edit button is clicked", async () => {
    renderWithChakra(
      <PlanFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        plan={mockPlan}
        mode="edit"
      />
    );

    fireEvent.change(screen.getByLabelText("plans.modal.name"), {
      target: { value: "Plan Editado" },
    });

    fireEvent.click(screen.getByRole("button", { name: "common.button.edit" }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Plan Editado" })
      );
      expect(onClose).toHaveBeenCalled();
    });
  });
});
