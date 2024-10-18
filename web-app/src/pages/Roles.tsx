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
      id: "id-role-222",
      name: "name-role-222",
      permissions: [
        {
          id: "pem-id-role-222-1",
          actions: [
            "write",
            "read"
          ]
        },
        {
          id: "pem-id-role-222-2",
          actions: [
            "write"
          ]
        },
        {
          id: "pem-id-role-222-3",
          actions: [
            "write",
            "read"
          ]
        }
      ],
      "createdAt": "Thu, 17 Oct 2024 18:22:49 GMT",
      "updatedAt": "Thu, 17 Oct 2024 18:22:49 GMT"
    },
    {
      id: "id-role-333",
      name: "name-role-333",
      permissions: [
        {
          id: "pem-id-role-333-1",
          actions: [
            "write",
            "read"
          ]
        },
        {
          id: "pem-id-role-333-2",
          actions: [
            "write"
          ]
        },
        {
          id: "pem-id-role-333-3",
          actions: [
            "write",
            "read"
          ]
        }
      ],
      "createdAt": "Thu, 17 Oct 2024 18:22:49 GMT",
      "updatedAt": "Thu, 17 Oct 2024 18:22:49 GMT"
    },
    {
      id: "id-role-444",
      name: "name-role-444",
      permissions: [
        {
          id: "pem-id-role-444-1",
          actions: [
            "write",
            "read"
          ]
        },
        {
          id: "pem-id-role-444-2",
          actions: [
            "write"
          ]
        },
        {
          id: "pem-id-role-444-3",
          actions: [
            "write",
            "read"
          ]
        }
      ],
      "createdAt": "Thu, 17 Oct 2024 18:22:49 GMT",
      "updatedAt": "Thu, 17 Oct 2024 18:22:49 GMT"
    }

  ];

  const handleEdit = (rol: Role) => {
    const role: Role = {
      id: rol.id,
      name: rol.name,
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
              <Td>{rol.permissions.map(permission => permission.id).join(', ')}</Td>
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
