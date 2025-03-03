import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: "all" | "active" | "completed") => void;
}

export default function SearchBar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
}: SearchBarProps) {
  return (
    <div className="flex gap-4">
      <Input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      
      <Select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value as any)}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </Select>
    </div>
  );
}
