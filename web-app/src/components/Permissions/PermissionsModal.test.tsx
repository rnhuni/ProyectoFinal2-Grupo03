import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { PermissionsModal } from "./PermissionsModal";
import i18n from "../../../i18nextConfig";
import { Permission } from "../../interfaces/Permissions";
import usePermissions from "../../hooks/permissions/usePermissions";
import { ChakraProvider } from "@chakra-ui/react";

jest.mock("../../hooks/permissions/usePermissions");

describe("PermissionModal loading state", () => {
  const onCloseMock = jest.fn();
  const onReloadMock = jest.fn();
  const createPermissionMock = jest.fn();

  beforeEach(() => {
    i18n.changeLanguage("es");
  });

  test("should display loading message when loading is true", () => {
    (usePermissions as jest.Mock).mockReturnValue({
      createPermission: createPermissionMock,
      error: null,
      loading: true,
    });

    render(
      <ChakraProvider>
        <PermissionsModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={onReloadMock}
        />
      </ChakraProvider>
    );

    expect(
      screen.getByText("permissions.modal.loading_message")
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("chakra-alert");
  });
});

describe("PermissionModal error handling", () => {
  const onCloseMock = jest.fn();
  const onReloadMock = jest.fn();
  const createPermissionMock = jest.fn();

  beforeEach(() => {
    i18n.changeLanguage("es");
  });

  test("should display error message when an error occurs", async () => {
    (usePermissions as jest.Mock).mockReturnValue({
      createPermission: createPermissionMock,
      error: "An error occurred",
      loading: false,
    });

    render(
      <ChakraProvider>
        <PermissionsModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={onReloadMock}
        />
      </ChakraProvider>
    );

    expect(
      screen.getByText("permissions.modal.error_message")
    ).toBeInTheDocument();
  });
});

describe("PermissionModal onSubmit", () => {
  const onCloseMock = jest.fn();
  const onReloadMock = jest.fn();
  const createPermissionMock = jest.fn();

  beforeEach(() => {
    i18n.changeLanguage("es");
    (usePermissions as jest.Mock).mockReturnValue({
      createPermission: createPermissionMock,
      error: null,
      loading: false,
    });
  });

  test("should call handleSubmitAsyn and onClose on form submit", async () => {
    render(
      <ChakraProvider>
        <PermissionsModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={onReloadMock}
        />
      </ChakraProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("permissions.name"), {
      target: { value: "Test Permission" },
    });
    fireEvent.change(screen.getByPlaceholderText("permissions.description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByPlaceholderText("permissions.resource"), {
      target: { value: "Test Resource" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "common.button.create" })
    );

    await waitFor(() => {
      expect(createPermissionMock).toHaveBeenCalledWith({
        name: "Test Permission",
        description: "Test Description",
        resource: "Test Resource",
        id: "",
      });
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });
});

describe("PermissionModal", () => {
  const onCloseMock = jest.fn();
  const onReloadMock = jest.fn();
  const createPermissionMock = jest.fn();
  const updatePermissionMock = jest.fn();

  beforeEach(() => {
    i18n.changeLanguage("es");
    (usePermissions as jest.Mock).mockReturnValue({
      createPermission: createPermissionMock,
      updatePermission: updatePermissionMock,
      error: null,
      loading: false,
    });
  });

  test("should render modal in create mode", () => {
    render(
      <ChakraProvider>
        <PermissionsModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={onReloadMock}
        />
      </ChakraProvider>
    );

    expect(screen.getByText("permissions.modal.create")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("permissions.name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("permissions.description")
    ).toBeInTheDocument();
  });

  test("should render modal in edit mode with initial data", () => {
    const initialData: Permission = {
      id: "1",
      name: "Test Permission",
      description: "Test Description",
      resource: "resource",
    };

    render(
      <ChakraProvider>
        <PermissionsModal
          isOpen={true}
          onClose={onCloseMock}
          initialData={initialData}
          mode="edit"
          setReloadData={onReloadMock}
        />
      </ChakraProvider>
    );

    expect(screen.getByText("permissions.modal.edit")).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialData.name)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(initialData.description)
    ).toBeInTheDocument();
  });

  test("should call onClose when cancel button is clicked", () => {
    render(
      <ChakraProvider>
        <PermissionsModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={onReloadMock}
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
        <PermissionsModal
          isOpen={true}
          onClose={onCloseMock}
          mode="create"
          setReloadData={onReloadMock}
        />
      </ChakraProvider>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "common.button.create" })
    );

    expect(
      await screen.findByText("permissions.validations.name")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("permissions.validations.description")
    ).toBeInTheDocument();
  });

  test("should call updatePermission on form submit in edit mode", async () => {
    const initialData: Permission = {
      id: "1",
      name: "Test Permission",
      description: "Test Description",
      resource: "resource",
    };

    render(
      <ChakraProvider>
        <PermissionsModal
          isOpen={true}
          onClose={onCloseMock}
          initialData={initialData}
          mode="edit"
          setReloadData={onReloadMock}
        />
      </ChakraProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("permissions.name"), {
      target: { value: "Updated Permission" },
    });
    fireEvent.change(screen.getByPlaceholderText("permissions.description"), {
      target: { value: "Updated Description" },
    });
    fireEvent.change(screen.getByPlaceholderText("permissions.resource"), {
      target: { value: "Updated Resource" },
    });

    fireEvent.click(screen.getByRole("button", { name: "common.button.edit" }));

    await waitFor(() => {
      expect(updatePermissionMock).toHaveBeenCalledWith({
        id: initialData.id,
        name: "Updated Permission",
        description: "Updated Description",
        resource: "Updated Resource",
      });
    });
  });
});
