import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  Text,
} from "@chakra-ui/react";
import { Role } from "../../interfaces/Role";

const ManageRoles = () => {
  const roles: Role[] = [
    {
      id: 1,
      roleName: "Administrador",
      description:
        "Acceso completo al sistema, incluyendo la gestión de usuarios, roles, y planes.",
      permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Array de IDs de permisos
      status: "Active",
    },
    {
      id: 2,
      roleName: "Agente de Soporte",
      description:
        "Acceso limitado a módulos de soporte y tickets de clientes.",
      permissions: [1, 3, 5, 6, 8], // Array de IDs de permisos
      status: "Active",
    },
    {
      id: 3,
      roleName: "Cliente",
      description:
        "Acceso a su perfil personal y gestión de tickets de soporte.",
      permissions: [1, 5, 7], // Array de IDs de permisos
      status: "Inactive",
    },
  ];

  const renderStatusBadge = (status: Role["status"]) => {
    if (status === "Active") {
      return <Badge colorScheme="green">Activo</Badge>;
    }
    return <Badge colorScheme="gray">Inactivo</Badge>;
  };

  return (
    <Box p={4}>
      <HStack justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Gestión de Roles
        </Text>
        {/* Aquí puedes agregar más funcionalidades como crear nuevos roles */}
      </HStack>

      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>Nombre Rol</Th>
            <Th>Número de Permisos</Th>
            <Th>Descripción</Th>
            <Th>Estado</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {roles.map((role) => (
            <Tr key={role.id}>
              <Td>{role.roleName}</Td>
              <Td>{role.permissions.length}</Td>{" "}
              {/* Mostramos el número de permisos */}
              <Td>{role.description}</Td>
              <Td>{renderStatusBadge(role.status)}</Td>
              <Td>
                <Button colorScheme="blue" variant="outline">
                  Detalles
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ManageRoles;
