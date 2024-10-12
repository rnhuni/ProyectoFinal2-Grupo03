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
  Select,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { EditUserModal } from "../components/Users/EditUserModal";
import { CreateUserModal } from "../components/Users/CreateUserModal"; // Importamos el modal de Crear Usuario
import { User } from "../interfaces/User"; // Asegúrate de importar tu interfaz User

const Users = () => {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure(); // Control del modal de Crear Usuario

  const users: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      createdAt: "Nov 30, 2023",
      updatedAt: "Dec 11, 2023",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane@example.com",
      role: "User",
      status: "Completed",
      createdAt: "Jun 18, 2023",
      updatedAt: "Nov 9, 2023",
    },
  ];

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    onEditOpen(); // Abre el modal de editar
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
          onClick={onCreateOpen}
        >
          Crear Usuario
        </Button>
      </HStack>

      {/* Tabla de usuarios */}
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

      {/* Modal para editar usuario */}
      <EditUserModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        user={selectedUser}
      />

      {/* Modal para crear usuario */}
      <CreateUserModal isOpen={isCreateOpen} onClose={onCreateClose} />
    </Box>
  );
};

export default Users;
