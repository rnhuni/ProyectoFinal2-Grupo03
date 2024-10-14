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
  Badge,
} from "@chakra-ui/react";
import { AddIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { UserRole } from "../interfaces/UserRole";
import { User } from "../interfaces/User"; // Asegúrate de importar User
import UserRoleModal from "../components/Roles/UserRoleModal";

const Roles = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(
    undefined
  );
  const [mode, setMode] = useState<"create" | "edit">("create");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Lista de usuarios como ejemplo
  const users: User[] = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@mail.com",
      role: "Administrador",
      status: "Active",
      createdAt: "Feb 8 2024, 1:11:00 pm",
      roles: [
        {
          id: 1,
          roleName: "Administrador",
          status: "Active",
          permissions: [1, 2],
          description: "Admin role",
        },
      ],
    },
    {
      id: 2,
      name: "María García",
      email: "maria.garcia@mail.com",
      role: "Agente",
      status: "Active",
      createdAt: "Feb 22 2024, 1:11:00 pm",
      roles: [],
    },
    // ... más usuarios
  ];

  // Lista de todos los roles disponibles
  const availableRoles = ["Administrador", "Agente", "Soporte", "Cliente"];

  const handleEdit = (user: User) => {
    const transformedRole: UserRole = {
      id: user.id,
      role: user.role,
      userId: user.id, // Si necesitas userId como propiedad separada
      status: user.status,
      createdAt: user.createdAt,
      email: user.email,
    };

    setSelectedRole(transformedRole); // Aquí pasamos el UserRole transformado
    setMode("edit");
    onOpen();
  };

  // Maneja la creación de roles
  const handleCreate = () => {
    setSelectedRole(undefined);
    setMode("create");
    onOpen();
  };

  // Función para mostrar el estado con colores, incluyendo el estado "Completed"
  const renderStatusBadge = (status: "Active" | "Completed" | "Inactive") => {
    if (status === "Active") {
      return <Badge colorScheme="green">Activo</Badge>;
    }
    if (status === "Completed") {
      return <Badge colorScheme="blue">Completado</Badge>;
    }
    return <Badge colorScheme="gray">Inactivo</Badge>;
  };

  return (
    <Box p={4}>
      <HStack justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Gestión de Roles
        </Text>
        <Button
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Crear Rol
        </Button>
      </HStack>

      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Email</Th>
            <Th>Estado</Th>
            <Th>Fecha Creación</Th>
            <Th>Rol</Th>
            <Th>Acción</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{renderStatusBadge(user.status)}</Td>
              <Td>{user.createdAt || "None"}</Td>
              <Td>{user.role}</Td>
              <Td>
                <Menu>
                  <MenuButton as={IconButton} icon={<HamburgerIcon />} />
                  <MenuList>
                    <MenuItem onClick={() => handleEdit(user)}>Editar</MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal para asignar o editar roles */}
      <UserRoleModal
        isOpen={isOpen}
        onClose={onClose}
        initialData={selectedRole}
        mode={mode}
        users={users} // Pasamos la lista de usuarios al modal
        availableRoles={availableRoles} // Pasamos la lista de roles disponibles al modal
      />
    </Box>
  );
};

export default Roles;
