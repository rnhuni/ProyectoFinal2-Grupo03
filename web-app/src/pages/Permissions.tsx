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
import { Permission } from "../interfaces/Permissions";
import { PermissionModal } from "../components/Permissions/PermissionsModal";

const Permissions = () => {
  const [selectedPermission, setSelectedPermission] = useState<
    Permission | undefined
  >(undefined);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const permissions: Permission[] = [
    {
      id: 1,
      name: "Crear usuarios",
      description: "Permite crear nuevos usuarios en el sistema.",
      status: "Active",
      createdAt: "Nov 30, 2023",
      updatedAt: "Dec 11, 2023",
    },
    {
      id: 2,
      name: "Ver usuarios",
      description: "Permite ver la lista de usuarios registrados.",
      status: "Active",
      createdAt: "Jun 18, 2023",
      updatedAt: "Nov 9, 2023",
    },
  ];

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setMode("edit");
    onOpen();
  };

  const handleCreate = () => {
    setSelectedPermission(undefined);
    setMode("create");
    onOpen();
  };

  return (
    <Box p={4}>
      <HStack justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Permisos de la plataforma
        </Text>
        <Button
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Crear Permiso
        </Button>
      </HStack>

      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>Nombre </Th>
            <Th>Descripci&oacute;n</Th>
            <Th>Estado</Th>
            <Th>Fecha Creación</Th>
            <Th>Fecha Edición</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {permissions.map((permission) => (
            <Tr key={permission.id}>
              <Td>{permission.name}</Td>
              <Td>{permission.description}</Td>
              <Td>{permission.status}</Td>
              <Td>{permission.createdAt || "None"}</Td>
              <Td>{permission.updatedAt || "None"}</Td>
              <Td>
                <Menu>
                  <MenuButton as={IconButton} icon={<HamburgerIcon />} />
                  <MenuList>
                    <MenuItem
                      icon={<EditIcon />}
                      onClick={() => handleEdit(permission)}
                    >
                      Editar
                    </MenuItem>
                    <MenuItem
                      icon={<DeleteIcon />}
                      onClick={() => console.log("Delete Permission")}
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

      <PermissionModal
        isOpen={isOpen}
        onClose={onClose}
        initialData={selectedPermission}
        mode={mode}
      />
    </Box>
  );
};

export default Permissions;
