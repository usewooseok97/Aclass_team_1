import { useState } from "react";
import type { FormEvent } from "react";

interface SearchInputProps {
  className?: string;
  onSearch?: (searchTerm: string) => void;
}

const SearchInput = ({ className = "", onSearch }: SearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <article
      className={`flex flex-row items-center p-2 w-[233px] h-9 bg-white rounded-[10px] ${className}`}
    >
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400"
        />
        <button type="submit" className="sr-only">
          검색
        </button>
      </form>
    </article>
  );
};

export { SearchInput };
