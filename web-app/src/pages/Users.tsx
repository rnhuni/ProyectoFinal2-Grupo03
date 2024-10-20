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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  HStack,
  Text,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { UserModal } from "../components/Users/UserModal";
import { UserTableData } from "../interfaces/UserTableData"; // Nueva interfaz

const Users = () => {
  const [selectedUser, setSelectedUser] = useState<UserTableData | undefined>(
    undefined
  );
  const [mode, setMode] = useState<"create" | "edit">("create");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Estado para manejar la lista de usuarios
  const [users, setUsers] = useState<UserTableData[]>([]);

  // Simulando la llamada al endpoint de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users"); // Reemplaza con tu URL real de la API
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleEdit = (user: UserTableData) => {
    setSelectedUser(user);
    setMode("edit");
    onOpen();
  };

  const handleCreate = () => {
    setSelectedUser(undefined);
    setMode("create");
    onOpen();
  };

  return (
    <Box p={4}>
      <HStack justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Usuarios de la plataforma
        </Text>
        <Button
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Crear Usuario
        </Button>
      </HStack>

      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>Nombre Completo</Th>
            <Th>Correo Electrónico</Th>
            <Th>Rol</Th>
            <Th>Cliente</Th>
            <Th>Estado</Th>
            <Th>Fecha de Creación</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role_id}</Td>
              <Td>{user.client_id}</Td>
              <Td>{user.status}</Td>
              <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
              <Td>
                <Menu>
                  <MenuButton as={IconButton} icon={<HamburgerIcon />} />
                  <MenuList>
                    <MenuItem
                      icon={<EditIcon />}
                      onClick={() => handleEdit(user)}
                    >
                      Editar
                    </MenuItem>
                    <MenuItem
                      icon={<DeleteIcon />}
                      onClick={() => console.log("Delete User")}
                    >
                      Eliminar
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <UserModal
        isOpen={isOpen}
        onClose={onClose}
        initialData={selectedUser}
        mode={mode}
      />
    </Box>
  );
};

export default Users;
