import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { useTaskTableSearch } from "./task-table/search-provider";

export const TaskSearchForm: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const { search } = useTaskTableSearch();

  const handleSearch = () => {
    search(searchText);
  };

  const handleSearchReset = () => {
    setSearchText("");
    search("");
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2"
          size={18}
        />
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="h-8 w-[400px] rounded-sm border border-zinc-500 bg-transparent px-7 py-1 text-sm focus-within:border-zinc-300 focus-within:outline-hidden"
        />
        {searchText.length > 0 && (
          <button
            onClick={handleSearchReset}
            className="absolute top-1/2 right-2 -translate-y-1/2 transition-colors hover:bg-white/15"
          >
            <XIcon size={18} />
          </button>
        )}
      </div>
      <Button onClick={handleSearch}>検索</Button>
    </div>
  );
};
