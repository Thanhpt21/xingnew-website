// components/TextArea.tsx
"use client";

interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder = "Thêm ghi chú hoặc yêu cầu đặc biệt...",
  rows = 3,
}: TextAreaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
    </div>
  );
}