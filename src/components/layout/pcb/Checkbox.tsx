// components/Checkbox.tsx
"use client";

interface CheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (name: string, checked: boolean) => void;
}

export default function Checkbox({ label, name, checked, onChange }: CheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(name, e.target.checked)}
        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
      />
      <label className="ml-2 text-sm font-medium text-gray-700">{label}</label>
    </div>
  );
}