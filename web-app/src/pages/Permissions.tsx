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
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Permission } from "../interfaces/Permissions";
import { PermissionModal } from "../components/Permissions/PermissionsModal";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import usePermissions from "../hooks/permissions/usePermissions";

const Permissions = () => {
  const { t } = useTranslation();
  const [selectedPermission, setSelectedPermission] = useState<
    Permission | undefined
  >(undefined);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { permissions, error, reloadPermissions } = usePermissions(); // Reemplaza el hook con el nuevo hook

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

  const handleModalClose = () => {
    onClose(); // Cierra el modal
    reloadPermissions(); // Recarga los permisos
  };

  useEffect(() => {
    reloadPermissions(); // Carga inicial de permisos
  }, []);

  return (
    <Box p={4}>
      <HStack justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          {t("permissions.title")}
        </Text>
        <Button
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={handleCreate}
        >
          {t("permissions.create")}
        </Button>
      </HStack>
      {/* Mensaje de error */}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {t("permissions.error_message")}
        </Alert>
      )}

      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>{t("permissions.name")}</Th>
            <Th>{t("permissions.resource")}</Th>
            <Th>{t("permissions.description")}</Th>
            <Th>{t("common.creation_date")}</Th>
            <Th>{t("common.edition_date")}</Th>
            <Th>{t("common.actions")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {permissions.map((permission) => (
            <Tr key={permission.id}>
              <Td>{permission.name}</Td>
              <Td>{permission.resource}</Td>
              <Td>{permission.description}</Td>
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
                      {t("common.actions_edit")}
                    </MenuItem>
                    <MenuItem
                      icon={<DeleteIcon />}
                      onClick={() => console.log("Delete Permission")}
                    >
                      {t("common.actions_delete")}
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
        onClose={handleModalClose}
        initialData={selectedPermission}
        mode={mode}
      />
    </Box>
  );
};

export default Permissions;
