// components/SelectInput.tsx
"use client";

interface SelectInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  options: Array<{ value: string; label: string }>;
}

export default function SelectInput({ label, name, value, onChange, options }: SelectInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}