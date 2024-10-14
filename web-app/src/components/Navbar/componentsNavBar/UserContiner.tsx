import { Box, Text, HStack, useColorModeValue  } from "@chakra-ui/react";
import UserImage from "./UserImage";

const UserContiner = () => {

  const color = useColorModeValue("black", "white");

  return (
    <Box
      border="1px"
      borderColor="#aaaaaa"
      as="button"
      borderRadius="md"
      color={color}
    >
      <HStack>
        <Text p="10px">Jhon Doe</Text>
        <UserImage />
      </HStack>
    </Box>
  );
};

export default UserContiner;
