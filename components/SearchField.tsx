import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchField({
  value,
  onChange,
  placeholder = "Rechercher...",
}: SearchFieldProps) {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      leftSection={<IconSearch size={16} />}
    />
  );
}
