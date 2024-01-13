import { Tab, TabList, Tabs } from "@chakra-ui/react";
import { FC } from "react";

export enum SearchType {
  DECK = "DECK",
  USER = "USER",
}
const tabIndexes = [SearchType.USER, SearchType.DECK] as const;
interface Props {
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
}
export const SearchTypeSelector: FC<Props> = ({
  searchType,
  setSearchType,
}) => {
  return (
    <>
      <Tabs
        onChange={(idx) => setSearchType(tabIndexes[idx])}
        tabIndex={tabIndexes.indexOf(searchType) ?? 0}
      >
        <TabList>
          <Tab>User search</Tab>
          <Tab>Deck search</Tab>
        </TabList>
      </Tabs>
    </>
  );
};
