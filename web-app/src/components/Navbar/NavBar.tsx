import { HStack } from "@chakra-ui/react";
import ColorModeSwitch from "./componentsNavBar/ColorModeSwitch";
import NotificationButton from "./componentsNavBar/NotificationButton";
import SearchButton from "./componentsNavBar/SearchButton";
import BellButton from "./componentsNavBar/BellButton";
import UserContiner from "./componentsNavBar/UserContiner";
import AppName from "./componentsNavBar/HeadingAppName";

const NavBar = () => {
  return (
    <HStack p="5px" boxShadow="md" justify="space-between">
      <AppName />
      <HStack spacing={1}>
        <SearchButton />
        <ColorModeSwitch />
        <NotificationButton />
        <BellButton />
        <UserContiner />
      </HStack>
    </HStack>
  );
};

export default NavBar;
