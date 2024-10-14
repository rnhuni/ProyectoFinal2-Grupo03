import { IconButton } from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons";

const SearchButton = () => {
  return (
    <IconButton aria-label='' icon={<SearchIcon />} variant="ghost" />
  )
}

export default SearchButton