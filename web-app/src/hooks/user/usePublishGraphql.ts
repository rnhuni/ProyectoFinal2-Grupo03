import { publishChannelFunc } from "../../services/useChannels";


const publishToChannel = async (data: string, id: string) => {
  // console.log("1 publishToChannel useEffect: ", id)
  const response = await publishChannelFunc(data, id);
  return response;
};

export default publishToChannel;
