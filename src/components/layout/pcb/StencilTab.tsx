// components/StencilTab.tsx
"use client";

import { motion } from "framer-motion";
import FileUpload from "./FileUpload";
import QuantityInput from "./QuantityInput";
import TextArea from "./TextArea";


export interface StencilFormData {
  gerberFile: File | null;
  boardWidth: string;
  boardHeight: string;
  quantity: number;
  stencilType: string;
  electropolishing: string;
  stencilSide: string;
  fiducials: string;
  notes: string;
}

interface StencilTabProps {
  formData: StencilFormData;
  onFormChange: (name: string, value: any) => void;
  onFileUpload: (file: File) => void;
  fileError: string;
}

export default function StencilTab({
  formData,
  onFormChange,
  onFileUpload,
  fileError,
}: StencilTabProps) {
  const stencilTypeOptions = [
    { value: "framed", label: "Có khung" },
    { value: "frameless", label: "Không khung" },
  ];

  const electropolishingOptions = [
    { value: "yes", label: "Có" },
    { value: "no", label: "Không" },
  ];

  const stencilSideOptions = [
    { value: "top", label: "Trên" },
    { value: "bottom", label: "Dưới" },
    { value: "both_same", label: "Trên + dưới cùng 1 khung" },
    { value: "both_separate", label: "Trên + dưới 2 khung riêng" },
  ];

  const fiducialsOptions = [
    { value: "none", label: "Không" },
    { value: "half", label: "half lasered" },
    { value: "through", label: "lasered through" },
  ];

  const sizeOptions = [
    { value: "50x50", label: "50x50 mm" },
    { value: "100x100", label: "100x100 mm" },
    { value: "150x150", label: "150x150 mm" },
    { value: "200x200", label: "200x200 mm" },
    { value: "250x250", label: "250x250 mm" },
    { value: "300x300", label: "300x300 mm" },
    { value: "370x470", label: "370x470 mm" },
    { value: "custom", label: "Kích thước khác" },
  ];

  return (
    <>
      <FileUpload
        onFileUpload={onFileUpload}
        fileError={fileError}
        uploadedFile={formData.gerberFile}
        allowedTypes={[".rar", ".zip"]}
        label="Upload Gerber file"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Thông số Stencil</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kích thước (mm) *
            </label>
            <div className="mb-3">
              <select
                onChange={(e) => {
                  if (e.target.value !== "custom") {
                    const [width, height] = e.target.value.split("x");
                    onFormChange("boardWidth", width);
                    onFormChange("boardHeight", height);
                  }
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Chọn kích thước</option>
                {sizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="number"
                  name="boardWidth"
                  value={formData.boardWidth}
                  onChange={(e) => onFormChange("boardWidth", e.target.value)}
                  placeholder="Chiều rộng"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-12"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">mm</span>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="boardHeight"
                  value={formData.boardHeight}
                  onChange={(e) => onFormChange("boardHeight", e.target.value)}
                  placeholder="Chiều cao"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-12"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">mm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <QuantityInput
              value={formData.quantity}
              onChange={(value) => onFormChange("quantity", value)}
              label="Số lượng"
              showCustomInput={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại stencil</label>
            <div className="grid grid-cols-2 gap-2">
              {stencilTypeOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center justify-center px-3 py-2.5 border rounded-lg cursor-pointer transition text-sm ${
                    formData.stencilType === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="stencilType"
                    value={option.value}
                    checked={formData.stencilType === option.value}
                    onChange={(e) => onFormChange("stencilType", e.target.value)}
                    className="hidden"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Electropolishing</label>
            <div className="grid grid-cols-2 gap-2">
              {electropolishingOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center justify-center px-3 py-2.5 border rounded-lg cursor-pointer transition text-sm ${
                    formData.electropolishing === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="electropolishing"
                    value={option.value}
                    checked={formData.electropolishing === option.value}
                    onChange={(e) => onFormChange("electropolishing", e.target.value)}
                    className="hidden"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mặt stencil</label>
            <select
              name="stencilSide"
              value={formData.stencilSide}
              onChange={(e) => onFormChange("stencilSide", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Chọn mặt stencil</option>
              {stencilSideOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Existing fiducials</label>
            <div className="grid grid-cols-3 gap-2">
              {fiducialsOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center justify-center px-2 py-2 border rounded-lg cursor-pointer transition text-xs ${
                    formData.fiducials === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="fiducials"
                    value={option.value}
                    checked={formData.fiducials === option.value}
                    onChange={(e) => onFormChange("fiducials", e.target.value)}
                    className="hidden"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <TextArea
            label="Ghi chú"
            name="notes"
            value={formData.notes}
            onChange={onFormChange}
            placeholder="Vui lòng điền thông số stencil chi tiết để chúng tôi hiểu rõ yêu cầu của bạn."
            rows={3}
          />
        </div>
      </motion.div>
    </>
  );
}