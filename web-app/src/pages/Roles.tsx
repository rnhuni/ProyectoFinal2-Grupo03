// sonar.ignore
/* istanbul ignore file */
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
import { useEffect, useState } from "react";
import RoleModal from "../components/Roles/RoleModal";
import { Role } from "../interfaces/Role";
import useRoles from "../hooks/roles/useRoles";
import { useTranslation } from "react-i18next";

const Roles = () => {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { roles, error, reloadRoles } = useRoles();
  const [reloadData, setReloadData] = useState<boolean>(false);

  const handleEdit = (rol: Role) => {
    const role: Role = {
      id: rol.id,
      name: rol.name,
      permissions: rol.permissions,
      created_at: rol.created_at,
      updated_at: rol.updated_at,
    };

    setSelectedRole(role);
    setMode("edit");
    onOpen();
  };

  const handleCreate = () => {
    setSelectedRole(undefined);
    setMode("create");
    onOpen();
  };

  useEffect(() => {
    reloadRoles();
  }, [reloadData]);

  const handleOnClose = () => {
    onClose();
    reloadRoles();
  };

  return (
    <Box p={4}>
      <HStack justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          {t("role.title")}
        </Text>
        <Button
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={handleCreate}
        >
          {t("role.create")}
        </Button>
      </HStack>
      {error && <Text color="red.500">{error}</Text>}
      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>{t("role.name")}</Th>
            <Th>{t("role.permissions")}</Th>
            <Th>{t("common.creation_date")}</Th>
            <Th>{t("common.edition_date")}</Th>
            <Th>{t("common.actions")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {roles &&
            roles.map((rol) => (
              <Tr key={rol.id}>
                <Td>{rol.name}</Td>
                <Td>
                  {(rol.permissions ?? [])
                    .map((permission: { id: string }) => permission.id)
                    .join(", ")}
                </Td>
                <Td>{rol.created_at || ""}</Td>
                <Td>{rol.updated_at || ""}</Td>
                <Td>
                  <Menu>
                    <MenuButton as={IconButton} icon={<HamburgerIcon />} />
                    <MenuList>
                      <MenuItem onClick={() => handleEdit(rol)}>
                        Editar
                      </MenuItem>
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
        onClose={handleOnClose}
        initialData={selectedRole}
        mode={mode}
        setReloadData={setReloadData}
      />
    </Box>
  );
};

export default Roles;
