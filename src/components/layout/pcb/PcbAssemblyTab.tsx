// components/PcbAssemblyTab.tsx
"use client";

import { motion } from "framer-motion";
import FileUpload from "./FileUpload";
import DimensionInput from "./DimensionInput";
import QuantityInput from "./QuantityInput";
import RadioGrid from "./RadioGrid";
import SelectInput from "./SelectInput";
import Checkbox from "./Checkbox";
import TextArea from "./TextArea";


export interface AssemblyFormData {
  gerberFile: File | null;
  boardWidth: string;
  boardHeight: string;
  quantity: number;
  smdPoints: string;
  dipPoints: string;
  assemblySides: string;
  componentTypes: string;
  totalComponents: string;
  packaging: string;
  pcbaConfirmation: boolean;
  componentSource: string;
  notes: string;
}

interface PcbAssemblyTabProps {
  formData: AssemblyFormData;
  onFormChange: (name: string, value: any) => void;
  onFileUpload: (file: File) => void;
  fileError: string;
}

export default function PcbAssemblyTab({
  formData,
  onFormChange,
  onFileUpload,
  fileError,
}: PcbAssemblyTabProps) {
  const assemblySidesOptions = [
    { value: "one_side", label: "Một mặt" },
    { value: "two_sides", label: "Hai mặt" },
  ];

  const packagingOptions = [
    { value: "standard", label: "Đóng gói thường" },
    { value: "antistatic", label: "Đóng gói chống tĩnh điện" },
    { value: "vacuum", label: "Đóng gói hút chân không" },
  ];

  const componentSourceOptions = [
    { value: "supplier", label: "Thegioiic cung cấp" },
    { value: "customer", label: "Khách hàng cung cấp" },
    { value: "mixed", label: "Khách hàng + Thegioiic" },
  ];

  return (
    <>
      <FileUpload
        onFileUpload={onFileUpload}
        fileError={fileError}
        uploadedFile={formData.gerberFile}
        allowedTypes={[".xlsx", ".csv", ".txt"]}
        label="Upload Gerber file"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Thông số lắp ráp</h2>

        <p className="text-sm text-gray-600 mb-6">
          Vui lòng điền kích thước PCB đơn hoặc PCB ghép panel
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DimensionInput
            label="Rộng"
            name="boardWidth"
            value={formData.boardWidth}
            onChange={onFormChange}
            required
          />
          <DimensionInput
            label="Cao"
            name="boardHeight"
            value={formData.boardHeight}
            onChange={onFormChange}
            required
          />

          <QuantityInput
            value={formData.quantity}
            onChange={(value) => onFormChange("quantity", value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số mối hàn SMD *
            </label>
            <div className="relative">
              <input
                type="number"
                name="smdPoints"
                value={formData.smdPoints}
                onChange={(e) => onFormChange("smdPoints", e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-16"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500">Điểm</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số mối hàn DIP *
            </label>
            <div className="relative">
              <input
                type="number"
                name="dipPoints"
                value={formData.dipPoints}
                onChange={(e) => onFormChange("dipPoints", e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-16"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500">Điểm</span>
              </div>
            </div>
          </div>

          <RadioGrid
            label="Số mặt PCB lắp ráp"
            name="assemblySides"
            value={formData.assemblySides}
            onChange={onFormChange}
            options={assemblySidesOptions}
            gridCols="grid-cols-2"
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số linh kiện *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="number"
                  name="componentTypes"
                  value={formData.componentTypes}
                  onChange={(e) => onFormChange("componentTypes", e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-16"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">loại</span>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="totalComponents"
                  value={formData.totalComponents}
                  onChange={(e) => onFormChange("totalComponents", e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">Số linh kiện</span>
                </div>
              </div>
            </div>
          </div>

          <SelectInput
            label="Đóng gói gởi PCBA"
            name="packaging"
            value={formData.packaging}
            onChange={onFormChange}
            options={packagingOptions}
          />

          <Checkbox
            label="Gửi hình PCBA đầu tiên để xác nhận"
            name="pcbaConfirmation"
            checked={formData.pcbaConfirmation}
            onChange={onFormChange}
          />

          <div className="md:col-span-2">
            <RadioGrid
              label="Cung cấp linh kiện BOM"
              name="componentSource"
              value={formData.componentSource}
              onChange={onFormChange}
              options={componentSourceOptions}
              gridCols="grid-cols-3"
            />
          </div>
        </div>

        <div className="mt-6">
          <TextArea
            label="Ghi chú"
            name="notes"
            value={formData.notes}
            onChange={onFormChange}
            placeholder="Vui lòng điền thông số kỹ thuật lắp ráp PCB."
            rows={2}
          />
        </div>
      </motion.div>
    </>
  );
}