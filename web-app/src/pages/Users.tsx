import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  Text,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { UserTableData } from "../interfaces/User";
import { useTranslation } from "react-i18next";
import UserFilterDrawer from "../components/Users/UserFilterDrawer";
import { UserModal } from "../components/Users/UserModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const Users = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserTableData[]>([
    {
      id: "1",
      name: "Usuario 1",
      email: "usuario1@example.com",
      role_id: "role-1",
      status: "ACTIVE",
      client_id: "client-1",
      createdAt: "2024-10-19",
      updatedAt: "",
    },
    {
      id: "2",
      name: "Usuario 2",
      email: "usuario2@example.com",
      role_id: "role-2",
      status: "INACTIVE",
      client_id: "client-2",
      createdAt: "2024-10-18",
      updatedAt: "",
    },
  ]);

  const [filteredUsers, setFilteredUsers] = useState<UserTableData[]>(users);
  const [selectedUser, setSelectedUser] = useState<UserTableData | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const handleEdit = (user: UserTableData) => {
    setSelectedUser(user);
    setFormMode("edit");
    setIsFormModalOpen(true);
  };

  const handleCreate = () => {
    setFormMode("create");
    setSelectedUser(null);
    setIsFormModalOpen(true);
  };

  const handleSave = (updatedUser: UserTableData) => {
    if (formMode === "edit") {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
    } else if (formMode === "create") {
      const newUser: UserTableData = {
        ...updatedUser,
        id: (users.length + 1).toString(), // Generar un ID de ejemplo
        status: "Active", // Asignar un estado predeterminado
        createdAt: new Date().toISOString(), // Fecha de creación
        updatedAt: new Date().toISOString(), // Fecha de actualización
      };

      setUsers((prevUsers) => [...prevUsers, newUser]);
    }
    setIsFormModalOpen(false);
  };

  const applyFilters = (filters: { field: string; searchValue: string }) => {
    const { field, searchValue } = filters;
    if (!searchValue) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) => {
      const userFieldValue = user[field as keyof UserTableData]
        ?.toString()
        .toLowerCase();
      return userFieldValue?.includes(searchValue.toLowerCase());
    });

    setFilteredUsers(filtered);
  };

  const clearFilters = () => {
    setFilteredUsers(users);
  };

  const handleDelete = (user: UserTableData) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );
    }
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const isFiltered = filteredUsers.length !== users.length;

  return (
    <Box p={6}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Text fontSize="2xl" fontWeight="bold">
          {t("users.title", "Usuarios de la plataforma")}
        </Text>
        <Stack direction="row" spacing={4}>
          <UserFilterDrawer applyFilters={applyFilters} />
          {isFiltered && (
            <Button colorScheme="gray" variant="outline" onClick={clearFilters}>
              {t("users.clear_filters", "Limpiar Filtros")}
            </Button>
          )}
          <Button
            colorScheme="blue"
            leftIcon={<AddIcon />}
            onClick={handleCreate}
          >
            {t("users.create", "Crear Usuario")}
          </Button>
        </Stack>
      </Stack>

      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>
              <Checkbox />
            </Th>
            <Th>{t("users.name", "Nombre Completo")}</Th>
            <Th>{t("users.email", "Correo Electrónico")}</Th>
            <Th>{t("users.role", "Rol")}</Th>
            <Th>{t("users.status", "Estado")}</Th>
            <Th>{t("users.client", "Cliente")}</Th>
            <Th>{t("users.created_at", "Fecha de Creación")}</Th>
            <Th>{t("users.actions", "Acciones")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map((user) => (
            <Tr key={user.id}>
              <Td>
                <Checkbox />
              </Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role_id}</Td>
              <Td>
                <Badge colorScheme={user.status === "ACTIVE" ? "green" : "red"}>
                  {user.status}
                </Badge>
              </Td>
              <Td>{user.client_id}</Td>
              <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
              <Td>
                <IconButton
                  aria-label="Edit user"
                  icon={<EditIcon />}
                  onClick={() => handleEdit(user)}
                  variant="ghost"
                />
                <IconButton
                  aria-label="Delete user"
                  icon={<DeleteIcon />}
                  onClick={() => handleDelete(user)}
                  variant="ghost"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <UserModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={(data) =>
          handleSave({
            ...data,
            id: selectedUser?.id ?? "",
            status: selectedUser?.status ?? "Active",
            createdAt: selectedUser?.createdAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        }
        initialData={
          formMode === "edit" && selectedUser ? selectedUser : undefined
        }
        mode={formMode}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedUser?.name || ""}
      />
    </Box>
  );
};

export default Users;
