import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ onSearch, placeholder = "Search...", className }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <ApperIcon
        name="Search"
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
        className="pl-10"
      />
    </div>
  );
};

export default SearchBar;