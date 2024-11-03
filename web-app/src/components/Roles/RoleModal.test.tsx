import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import RoleModal from "./RoleModal";
import i18n from "../../internalization/i18n";
import { Role } from "../../interfaces/Role";
import usePermissions from "../../hooks/permissions/usePermissions";
import useRoles from "../../hooks/roles/useRoles";
import { ChakraProvider } from "@chakra-ui/react";
import { I18nextProvider } from "react-i18next";

jest.mock("../../hooks/permissions/usePermissions");
jest.mock("../../hooks/roles/useRoles");

describe("RoleModal", () => {
  const onCloseMock = jest.fn();
  const createRoleMock = jest.fn();
  const reloadPermissionsMock = jest.fn();

  const renderWithProviders = (ui: React.ReactNode) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <ChakraProvider>{ui}</ChakraProvider>
      </I18nextProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    i18n.changeLanguage("es");
    (usePermissions as jest.Mock).mockReturnValue({
      permissions: [{ id: "1", name: "Permission 1" }],
      reloadPermissions: reloadPermissionsMock,
    });
    (useRoles as jest.Mock).mockReturnValue({
      createRole: createRoleMock,
    });
  });

  test("should render modal in create mode", () => {
    renderWithProviders(
      <RoleModal
        isOpen={true}
        onClose={onCloseMock}
        mode="create"
        setReloadData={jest.fn()}
      />
    );

    expect(
      screen.getByText(i18n.t("role.modal.create", "Crear Rol"))
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(i18n.t("role.modal.name", "Nombre del Rol"))
    ).toBeInTheDocument();
  });

  test("should render modal in edit mode with initial data", () => {
    const initialData: Role = {
      id: "1",
      name: "Test Role",
      permissions: [{ id: "1", actions: ["read"] }],
    };

    renderWithProviders(
      <RoleModal
        isOpen={true}
        onClose={onCloseMock}
        initialData={initialData}
        mode="edit"
        setReloadData={jest.fn()}
      />
    );

    expect(
      screen.getByText(i18n.t("role.modal.edit", "Editar Rol"))
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialData.name)).toBeInTheDocument();
    expect(
      screen.getByText(
        i18n.t("role.modal.current_permissions", "Permisos Actuales")
      )
    ).toBeInTheDocument();
  });

  test("should call onClose when cancel button is clicked", () => {
    renderWithProviders(
      <RoleModal
        isOpen={true}
        onClose={onCloseMock}
        mode="create"
        setReloadData={jest.fn()}
      />
    );

    const cancelButton = screen.getByText(
      i18n.t("common.button.cancel", "Cancelar")
    );
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  // test("should display validation errors", async () => {
  //   renderWithProviders(
  //     <RoleModal
  //       isOpen={true}
  //       onClose={onCloseMock}
  //       mode="create"
  //       setReloadData={jest.fn()}
  //     />
  //   );

  //   fireEvent.click(
  //     screen.getByRole("button", {
  //       name: i18n.t("common.button.create", "Crear"),
  //     })
  //   );

  //   expect(
  //     await screen.findByText(
  //       i18n.t(
  //         "permissions.validations.name_required",
  //         "El nombre es requerido"
  //       )
  //     )
  //   ).toBeInTheDocument();
  // });

  test("should call createRole on form submit in create mode", async () => {
    renderWithProviders(
      <RoleModal
        isOpen={true}
        onClose={onCloseMock}
        mode="create"
        setReloadData={jest.fn()}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText(i18n.t("role.modal.name", "Nombre del Rol")),
      {
        target: { value: "New Role" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("common.button.create", "Crear"),
      })
    );

    await waitFor(() => {
      expect(createRoleMock).toHaveBeenCalledWith({
        name: "New Role",
        permissions: [],
      });
    });
  });

  test("should call createRole on form submit in create mode error role.validations.exists", async () => {
    (useRoles as jest.Mock).mockReturnValue({
      createRole: jest.fn().mockResolvedValue("Role already exists"),
    });

    renderWithProviders(
      <RoleModal
        isOpen={true}
        onClose={onCloseMock}
        mode="create"
        setReloadData={jest.fn()}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText(i18n.t("role.modal.name", "Nombre del Rol")),
      {
        target: { value: "New Role" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("common.button.create", "Crear"),
      })
    );

    expect(
      await screen.findByText(
        i18n.t("role.validations.exists", "El rol ya existe")
      )
    ).toBeInTheDocument();
  });

  test("should call createRole on form submit in create mode error role.validations.permissions_required", async () => {
    (useRoles as jest.Mock).mockReturnValue({
      createRole: jest.fn().mockResolvedValue("permissions is required"),
    });

    renderWithProviders(
      <RoleModal
        isOpen={true}
        onClose={onCloseMock}
        mode="create"
        setReloadData={jest.fn()}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText(i18n.t("role.modal.name", "Nombre del Rol")),
      {
        target: { value: "New Role" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("common.button.create", "Crear"),
      })
    );

    expect(
      await screen.findByText(
        i18n.t(
          "role.validations.permissions_required",
          "Los permisos son requeridos"
        )
      )
    ).toBeInTheDocument();
  });

  test("should call createRole on form submit in create mode error role.validations.permissions_list_values", async () => {
    (useRoles as jest.Mock).mockReturnValue({
      createRole: jest.fn().mockResolvedValue("list values"),
    });

    renderWithProviders(
      <RoleModal
        isOpen={true}
        onClose={onCloseMock}
        mode="create"
        setReloadData={jest.fn()}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText(i18n.t("role.modal.name", "Nombre del Rol")),
      {
        target: { value: "New Role" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("common.button.create", "Crear"),
      })
    );

    expect(
      await screen.findByText(
        i18n.t(
          "role.validations.permissions_list_values",
          "Valores de lista de permisos incorrectos"
        )
      )
    ).toBeInTheDocument();
  });

  test("should display error message when role already exists", async () => {
    createRoleMock.mockResolvedValue("Role already exists");

    renderWithProviders(
      <RoleModal
        isOpen={true}
        onClose={onCloseMock}
        mode="create"
        setReloadData={jest.fn()}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText(i18n.t("role.modal.name", "Nombre del Rol")),
      {
        target: { value: "Existing Role" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("common.button.create", "Crear"),
      })
    );

    expect(
      await screen.findByText(
        i18n.t("role.validations.exists", "El rol ya existe")
      )
    ).toBeInTheDocument();
  });
});

describe("RoleModal handleCheckboxChange", () => {
  let mockSetValue: jest.Mock;
  let mockGetValues: jest.Mock;
  let mockReloadPermissions: jest.Mock;
  let mockCreateRole: jest.Mock;

  beforeEach(() => {
    mockSetValue = jest.fn();
    mockGetValues = jest.fn(() => [
      { id: "1", actions: ["read"] },
      { id: "2", actions: ["write", "update"] },
    ]);

    mockReloadPermissions = jest.fn();
    mockCreateRole = jest.fn();

    jest.spyOn(require("react-hook-form"), "useForm").mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      reset: jest.fn(),
      setValue: mockSetValue,
      getValues: mockGetValues,
      formState: { errors: {} },
    });

    (usePermissions as jest.Mock).mockReturnValue({
      permissions: [
        { id: "1", actions: ["read"] },
        { id: "2", actions: ["write", "update"] },
      ],
      reloadPermissions: mockReloadPermissions,
    });

    (useRoles as jest.Mock).mockReturnValue({
      createRole: mockCreateRole,
    });
  });

  const setup = () => {
    return render(
      <I18nextProvider i18n={i18n}>
        <ChakraProvider>
          <RoleModal
            isOpen={true}
            onClose={jest.fn()}
            mode="edit"
            setReloadData={jest.fn()}
          />
        </ChakraProvider>
      </I18nextProvider>
    );
  };

  it("debería agregar una acción si no está seleccionada", () => {
    const screen = setup();
    const { getAllByLabelText } = screen;

    const checkboxes = getAllByLabelText("write");

    fireEvent.click(checkboxes[0]);
  });

  it("debería remover una acción si ya está seleccionada", () => {
    mockGetValues.mockReturnValue([
      { id: "1", actions: ["read"] },
      { id: "2", actions: ["write", "update", "delete"] },
    ]);

    const screen = setup();
    const { getAllByLabelText } = screen;

    const checkboxes = getAllByLabelText("delete");

    fireEvent.click(checkboxes[0]);
  });
});

describe("RoleModal handlePermissionSelect", () => {
  let mockSetValue: jest.Mock;
  let mockGetValues: jest.Mock;
  let mockReloadPermissions: jest.Mock;
  let mockCreateRole: jest.Mock;

  beforeEach(() => {
    mockSetValue = jest.fn();
    mockGetValues = jest.fn(() => [
      { id: "permission4", name: "permission4-name", actions: [] },
      { id: "permission5", name: "permission5-name", actions: [] },
      { id: "permission6", name: "permission6-name", actions: [] },
    ]);

    mockReloadPermissions = jest.fn();
    mockCreateRole = jest.fn();

    jest.spyOn(require("react-hook-form"), "useForm").mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      reset: jest.fn(),
      setValue: mockSetValue,
      getValues: mockGetValues,
      formState: { errors: {} },
    });

    (usePermissions as jest.Mock).mockReturnValue({
      permissions: [
        { id: "permission1", name: "permission1-name", actions: [] },
        { id: "permission2", name: "permission2-name", actions: [] },
        { id: "permission3", name: "permission3-name", actions: [] },
      ],
      reloadPermissions: mockReloadPermissions,
    });

    (useRoles as jest.Mock).mockReturnValue({
      createRole: mockCreateRole,
    });
  });

  const setup = () => {
    return render(
      <I18nextProvider i18n={i18n}>
        <ChakraProvider>
          <RoleModal
            isOpen={true}
            onClose={jest.fn()}
            mode="edit"
            setReloadData={jest.fn()}
          />
        </ChakraProvider>
      </I18nextProvider>
    );
  };

  it("debería agregar un nuevo permiso si no existe", () => {
    const screen = setup();

    const selectElement = screen.getByRole("select");

    console.log(selectElement.innerHTML);

    fireEvent.change(selectElement, { target: { value: "permission1-name" } });
  });
});
