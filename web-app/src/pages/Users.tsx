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
      name: "nicohug",
      email: "nicohug@gmail.com",
      role_id: "role-1",
      client_id: "50b0aae0-c8ff-4481-a9c6-6fe60f2ea66a",
    },
    {
      name: "janedoe",
      email: "jane@example.com",
      role_id: "role-2",
      client_id: "70b0aae0-c8ff-4481-a9c6-6fe60f2ea66b",
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
            <Th>Correo Electrónico</Th>
            <Th>Rol</Th>
            <Th>Cliente</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.client_id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role_id}</Td>
              <Td>{user.client_id}</Td>
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
