// sonar.ignore
/* istanbul ignore file */
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
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { UserTableData } from "../interfaces/User";
import { useTranslation } from "react-i18next";
import UserFilterDrawer from "../components/Users/UserFilterDrawer";
import { UserModal } from "../components/Users/UserModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import useUsers from "../hooks/users/useUser";
import { User } from "../interfaces/User";

const Users = () => {
  const { t } = useTranslation();

  const { users, loading, error, reloadUsers, createUser, updateUser } =
    useUsers();

  const [filteredUsers, setFilteredUsers] = useState<UserTableData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserTableData | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  useEffect(() => {
    reloadUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

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

  const handleSave = async (userData: User) => {
    if (formMode === "edit" && selectedUser) {
      const updatedUser = { ...selectedUser, ...userData };
      await updateUser(updatedUser);
      setFilteredUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
    } else if (formMode === "create") {
      const newUser: UserTableData = {
        ...userData,
        id: (filteredUsers.length + 1).toString(),
        status: "DESCONOCIDO",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await createUser(userData);
      setFilteredUsers((prevFilteredUsers) => [...prevFilteredUsers, newUser]);
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

      {loading && <Spinner size="xl" />}

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Table variant="simple" mt={4}>
          <Thead>
            <Tr>
              <Th>
                <Checkbox />
              </Th>
              <Th>{t("users.name", "Nombre Completo")}</Th>
              <Th>{t("users.email", "Correo Electrónico")}</Th>
              <Th>{t("users.role", "Rol")}</Th>
              <Th>{t("users.status_label", "Estado")}</Th>
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
                  <Badge
                    colorScheme={user.status === "ACTIVE" ? "green" : "red"}
                  >
                    {t(
                      `users.statuses.${
                        user.status?.toLowerCase() || "unknown"
                      }`,
                      user.status || "Desconocido"
                    )}
                  </Badge>
                </Td>
                <Td>{user.client_id}</Td>
                <Td>{new Date(user.created_at).toLocaleDateString()}</Td>
                <Td>
                  <IconButton
                    aria-label={t("users.edit", "Editar Usuario")}
                    icon={<EditIcon />}
                    onClick={() => handleEdit(user)}
                    variant="ghost"
                  />
                  <IconButton
                    aria-label={t("users.delete", "Eliminar Usuario")}
                    icon={<DeleteIcon />}
                    onClick={() => handleDelete(user)}
                    variant="ghost"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <UserModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
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
