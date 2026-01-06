// components/RadioGrid.tsx
"use client";

interface RadioGridProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  options: Array<{ value: string; label: string }>;
  gridCols?: string;
}

export default function RadioGrid({
  label,
  name,
  value,
  onChange,
  options,
  gridCols = "grid-cols-4",
}: RadioGridProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className={`grid ${gridCols} gap-2`}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center justify-center px-3 py-2.5 border rounded-lg cursor-pointer transition text-sm ${
              value === option.value
                ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(name, e.target.value)}
              className="hidden"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}