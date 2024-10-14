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
import { useState } from "react";
import { UserModal } from "../components/Users/UserModal";
import { User } from "../interfaces/User";

const Users = () => {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const users: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      createdAt: "Nov 30, 2023",
      updatedAt: "Dec 11, 2023",
      roles: [],
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane@example.com",
      role: "User",
      status: "Completed",
      createdAt: "Jun 18, 2023",
      updatedAt: "Nov 9, 2023",
      roles: [],
    },
  ];

  const handleEdit = (user: User) => {
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
            <Th>Estado</Th>
            <Th>Correo Electrónico</Th>
            <Th>Rol</Th>
            <Th>Fecha Creación</Th>
            <Th>Fecha Edición</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.name}</Td>
              <Td>{user.status}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role}</Td>
              <Td>{user.createdAt || "None"}</Td>
              <Td>{user.updatedAt || "None"}</Td>
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
