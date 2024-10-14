import { IconButton, useColorMode } from "@chakra-ui/react";
import { MoonIcon } from "@chakra-ui/icons";

const ColorModeSwitch = () => {
  const { toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="dark / light"
      icon={<MoonIcon />}
      onClick={toggleColorMode}
      variant="ghost"
    />
  );
};

export default ColorModeSwitch;
