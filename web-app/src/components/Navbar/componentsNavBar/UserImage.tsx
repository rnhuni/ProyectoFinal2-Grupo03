import { Image } from "@chakra-ui/react";
import userImg from "../../../assets/d33f5bf6acf24a85bbae418113ff0276.webp";

const UserImage = () => {
  return <Image p='3px' boxSize="40px" borderRadius="full" src={userImg} />;
};

export default UserImage;
