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
import useRoles from "../hooks/useRoles";

const Roles = () => {
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { roles, error } = useRoles();

  const handleEdit = (rol: Role) => {
    const role: Role = {
      id: rol.id,
      name: rol.name,
      permissions: rol.permissions,
      createdAt: rol.createdAt,
      updatedAt: rol.updatedAt,
    };

    setSelectedRole(role);
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
      {error && <Text color="red.500">{error}</Text>}
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
              <Td>
                {(rol.permissions ?? [])
                  .map((permission) => permission.id)
                  .join(", ")}
              </Td>
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
