import { Badge, Text, Box } from "@chakra-ui/react";
import { FC } from "react";

interface StatusBadgeProps {
  status: "active" | "suspended" | "inactive"; // Puedes agregar más estados según tus necesidades
}

const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "active":
        return { color: "green.500", bgColor: "green.100", text: "Active" };
      case "suspended":
        return {
          color: "orange.500",
          bgColor: "orange.100",
          text: "Suspended",
        };
      case "inactive":
        return { color: "red.500", bgColor: "red.100", text: "Inactive" };
      default:
        return { color: "gray.500", bgColor: "gray.100", text: "Unknown" };
    }
  };

  const { color, bgColor, text } = getStatusStyles();

  return (
    <Badge
      px={2}
      py={1}
      borderRadius="full"
      color={color}
      bg={bgColor}
      display="flex"
      alignItems="center"
      w={32}
    >
      <Box as="span" w={2} h={2} bg={color} borderRadius="full" mr={2} />
      <Text fontSize="sm" fontWeight="bold">
        {text}
      </Text>
    </Badge>
  );
};

export default StatusBadge;
