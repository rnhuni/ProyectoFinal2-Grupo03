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
import { useTranslation } from "react-i18next";

const Permissions = () => {
  const { t } = useTranslation();
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
      service: "Users",
      createdAt: "Nov 30, 2023",
      updatedAt: "Dec 11, 2023",
    },
    {
      id: 2,
      name: "Ver usuarios",
      description: "Permite ver la lista de usuarios registrados.",
      service: "Users",
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

      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>{t("permissions.name")}</Th>
            <Th>{t("permissions.service")}</Th>
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
              <Td>{permission.service}</Td>
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
        onClose={onClose}
        initialData={selectedPermission}
        mode={mode}
      />
    </Box>
  );
};

export default Permissions;
