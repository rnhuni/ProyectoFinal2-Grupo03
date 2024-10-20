import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import RoleModal from "./RoleModal";
import i18n from "../../../i18nextConfig";
import { Role } from "../../interfaces/Role";
import usePermissions from "../../hooks/permissions/usePermissions";
import useRoles from "../../hooks/roles/useRoles";
import { ChakraProvider } from "@chakra-ui/react";

jest.mock("../../hooks/permissions/usePermissions");
jest.mock("../../hooks/roles/useRoles");

describe("RoleModal", () => {
  const onCloseMock = jest.fn();
  const createRoleMock = jest.fn();
  const reloadPermissionsMock = jest.fn();

  beforeEach(() => {
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
    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    expect(screen.getByText("role.modal.create")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("role.modal.name")).toBeInTheDocument();
  });

  test("should render modal in edit mode with initial data", () => {
    const initialData: Role = {
      id: "1",
      name: "Test Role",
      permissions: [{ id: "1", actions: ["read"] }],
    };

    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          initialData={initialData}
          mode="edit"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    expect(screen.getByText("role.modal.edit")).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialData.name)).toBeInTheDocument();
    expect(
      screen.getByText("role.modal.current_permissions")
    ).toBeInTheDocument();
  });

  test("should call onClose when cancel button is clicked", () => {
    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    const cancelButton = screen.getByText("common.button.cancel");
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("should display validation errors", async () => {
    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "common.button.create" })
    );

    expect(
      await screen.findByText("permissions.validations.name_requerid")
    ).toBeInTheDocument();
  });

  test("should call createRole on form submit in create mode", async () => {
    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("role.modal.name"), {
      target: { value: "New Role" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "common.button.create" })
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

    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("role.modal.name"), {
      target: { value: "New Role" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "common.button.create" })
    );

    expect(
      await screen.findByText("role.validations.exists")
    ).toBeInTheDocument();
  });

  test("should call createRole on form submit in create mode error role.validations.permissions_required", async () => {
    (useRoles as jest.Mock).mockReturnValue({
      createRole: jest.fn().mockResolvedValue("permissions is required"),
    });

    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("role.modal.name"), {
      target: { value: "New Role" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "common.button.create" })
    );

    expect(
      await screen.findByText("role.validations.permissions_required")
    ).toBeInTheDocument();
  });

  test("should call createRole on form submit in create mode error role.validations.permissions_list_values", async () => {
    (useRoles as jest.Mock).mockReturnValue({
      createRole: jest.fn().mockResolvedValue("list values"),
    });

    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("role.modal.name"), {
      target: { value: "New Role" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "common.button.create" })
    );

    expect(
      await screen.findByText("role.validations.permissions_list_values")
    ).toBeInTheDocument();
  });

  test("should display error message when role already exists", async () => {
    createRoleMock.mockResolvedValue("Role already exists");

    render(
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("role.modal.name"), {
      target: { value: "Existing Role" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "common.button.create" })
    );

    expect(
      await screen.findByText("role.validations.exists")
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
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={jest.fn()}
          mode="edit"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
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
      <ChakraProvider>
        <RoleModal
          isOpen={true}
          onClose={jest.fn()}
          mode="edit"
          setReloadData={jest.fn()}
        />
      </ChakraProvider>
    );
  };

  it("debería agregar un nuevo permiso si no existe", () => {
    const screen = setup();

    const selectElement = screen.getByRole("select");

    console.log(selectElement.innerHTML);

    fireEvent.change(selectElement, { target: { value: "permission1-name" } });
  });
});
