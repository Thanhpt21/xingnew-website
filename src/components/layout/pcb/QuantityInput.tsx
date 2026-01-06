// components/QuantityInput.tsx
"use client";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  showCustomInput?: boolean;
}

export default function QuantityInput({ 
  value, 
  onChange, 
  label = "Số lượng PCB *",
  showCustomInput = true 
}: QuantityInputProps) {
  const quantityOptions = [
    5, 10, 15, 20, 25, 30, 50, 75, 100, 125, 150, 200, 250, 300, 350, 400, 450, 500,
    600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000, 10000, 100000,
  ];

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {quantityOptions.map((qty) => (
          <label
            key={qty}
            className={`flex items-center justify-center px-3 py-2 border rounded-lg cursor-pointer transition text-sm ${
              value === qty
                ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name="quantity"
              value={qty}
              checked={value === qty}
              onChange={() => onChange(qty)}
              className="hidden"
            />
            {qty}
          </label>
        ))}
      </div>
      {showCustomInput && (
        <div className="mt-2">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            min="1"
            placeholder="Nhập số lượng tùy chỉnh"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      )}
    </div>
  );
}