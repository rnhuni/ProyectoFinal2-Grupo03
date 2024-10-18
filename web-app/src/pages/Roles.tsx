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
import { AddIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useState } from "react";
import RoleModal from "../components/Roles/RoleModal";
import { Role } from "../interfaces/Role";

const Roles = () => {
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(
    undefined
  );
  const [mode, setMode] = useState<"create" | "edit">("create");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Lista de usuarios como ejemplo
  const roles = [
    {
      id: 1,
      name: "Admin",
      description: "Rol con acceso total a todos los módulos y funciones",
      permissions: [
        { id: 101, name: "manage-users", description: "Permiso para gestionar usuarios", resource: "Usuarios" },
        { id: 102, name: "read-reports", description: "Permiso para leer reportes", resource: "Reportes" },
        { id: 103, name: "write-reports", description: "Permiso para escribir reportes", resource: "Reportes" },
      ],
      createdAt: "2024-10-15",
      updatedAt: "2024-10-16",
    },
    {
      id: 2,
      name: "Editor",
      description: "Rol con permisos para crear y editar contenido",
      permissions: [
        { id: 201, name: "write-posts", description: "Permiso para escribir publicaciones", resource: "Publicaciones" },
        { id: 202, name: "update-posts", description: "Permiso para editar publicaciones", resource: "Publicaciones" },
      ],
      createdAt: "2024-10-10",
      updatedAt: "2024-10-12",
    },
    {
      id: 3,
      name: "Viewer",
      description: "Rol con permisos solo de lectura",
      permissions: [
        { id: 301, name: "read-posts", description: "Permiso para leer publicaciones", resource: "Publicaciones" },
        { id: 302, name: "read-reports", description: "Permiso para leer reportes", resource: "Reportes" },
      ],
      createdAt: "2024-09-15",
    },
    {
      id: 4,
      name: "Support",
      description: "Rol con permisos para gestionar solicitudes de soporte",
      permissions: [
        { id: 401, name: "read-tickets", description: "Permiso para leer tickets de soporte", resource: "Soporte" },
        { id: 402, name: "update-tickets", description: "Permiso para actualizar tickets de soporte", resource: "Soporte" },
      ],
      createdAt: "2024-08-20",
      updatedAt: "2024-08-22",
    },
    {
      id: 5,
      name: "Auditor",
      description: "Rol con permisos para auditar sistemas y revisar logs",
      permissions: [
        { id: 501, name: "read-logs", description: "Permiso para leer logs del sistema", resource: "Sistemas" },
        { id: 502, name: "read-audits", description: "Permiso para leer reportes de auditoría", resource: "Auditoría" },
      ],
      createdAt: "2024-07-30",
      updatedAt: "2024-08-01",
    },
  ];

  const handleEdit = (rol: Role) => {
    const role: Role = {
      id: rol.id,
      name: rol.name,
      description: rol.description, // Si necesitas userId como propiedad separada
      permissions: rol.permissions,
      createdAt: rol.createdAt,
      updatedAt: rol.updatedAt,
    };

    setSelectedRole(role); // Aquí pasamos el UserRole transformado
    setMode("edit");
    onOpen();
  };

  // Maneja la creación de roles
  const handleCreate = () => {
    setSelectedRole(undefined);
    setMode("create");
    onOpen();
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
            <Th>Descripcion</Th>
            <Th>Permisos</Th>
            <Th>Fecha Creación</Th>
            <Th>FEcha Edición</Th>
            <Th>Acción</Th>
          </Tr>
        </Thead>
        <Tbody>
          {roles.map((rol) => (
            <Tr key={rol.id}>
              <Td>{rol.name}</Td>
              <Td>{rol.description}</Td>
              <Td>{rol.permissions.map(permission => permission.name).join(', ')}</Td>
              <Td>{rol.createdAt || ""}</Td>
              <Td>{rol.updatedAt || ""}</Td>
              <Td>
                <Menu>
                  <MenuButton as={IconButton} icon={<HamburgerIcon />} />
                  <MenuList>
                    <MenuItem onClick={() => handleEdit(rol)}>Editar</MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal para asignar o editar roles */}
      <RoleModal
        isOpen={isOpen}
        onClose={onClose}
        initialData={selectedRole}
        mode={mode}
      />
    </Box>
  );
};

export default Roles;
