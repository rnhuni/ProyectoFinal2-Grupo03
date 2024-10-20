import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { featuresList } from "../../data/FeaturesList";
import PlanFormModal from "./PlanFormModal";
import i18n from "../../../i18nextConfig";

// Mock data
const mockPlan = {
  id: "1",
  name: "Plan Básico",
  description: "Un plan básico",
  price: 100,
  features: [featuresList[0], featuresList[2]],
  status: "active",
};

const renderWithChakra = (ui: React.ReactNode) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe("PlanFormModal Component", () => {
  const onSave = jest.fn();
  const onClose = jest.fn();

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

    // Check that all features checkboxes are rendered
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

    // Check that the correct checkboxes are checked based on the features
    featuresList.forEach((feature) => {
      const checkbox = screen.getByLabelText(feature) as HTMLInputElement;
      if (mockPlan.features.includes(feature)) {
        expect(checkbox.checked).toBe(true);
      } else {
        expect(checkbox.checked).toBe(false);
      }
    });
  });

  // Nueva prueba para verificar el cambio de estado de los checkboxes
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

  // test("should send form modal when create button is clicked", () => {
  //   renderWithChakra(
  //     <PlanFormModal
  //       isOpen={true}
  //       onClose={onClose}
  //       onSave={onSave}
  //       plan={null}
  //       mode="create"
  //     />
  //   );

  //   fireEvent.change(screen.getByLabelText("plans.modal.name"), {
  //     target: { value: "New plan name" },
  //   });

  //   fireEvent.change(screen.getByLabelText("plans.modal.description"), {
  //     target: { value: "New plan description" },
  //   });

  //   const firstFeatureCheckbox = screen.getByLabelText(featuresList[0]);
  //   fireEvent.click(firstFeatureCheckbox);

  //   fireEvent.change(screen.getByLabelText("plans.modal.price"), {
  //     target: { value: 800000 },
  //   });

  //   fireEvent.click(
  //     screen.getByRole("button", { name: "common.button.create" })
  //   );
  // });
});
