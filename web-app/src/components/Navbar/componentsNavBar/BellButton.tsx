import { IconButton } from "@chakra-ui/react";

const BellButton = () => {
  return (
    <IconButton aria-label="Bell Notification" icon={<i className="bi bi-bell"></i>} variant="ghost"/>
  )
}

export default BellButton;
