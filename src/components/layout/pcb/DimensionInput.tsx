// components/DimensionInput.tsx
"use client";

interface DimensionInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  unit?: string;
  required?: boolean;
  placeholder?: string;
}

export default function DimensionInput({
  label,
  name,
  value,
  onChange,
  unit = "mm",
  required = false,
  placeholder = "100",
}: DimensionInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <input
          type="number"
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-12"
          required={required}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500">{unit}</span>
        </div>
      </div>
    </div>
  );
}