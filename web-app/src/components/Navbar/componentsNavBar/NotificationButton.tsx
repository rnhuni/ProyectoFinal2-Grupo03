import { IconButton } from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";

const NotificationButton = () => {
  return (
    <IconButton aria-label='' icon={<QuestionOutlineIcon />} variant="ghost"/>
  )
}

export default NotificationButton