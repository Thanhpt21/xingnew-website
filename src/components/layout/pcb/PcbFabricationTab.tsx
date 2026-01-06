// components/PcbFabricationTab.tsx
"use client";

import { motion } from "framer-motion";
import FileUpload from "./FileUpload";

export interface PcbFormData {
  gerberFile: File | null;
  boardHeight: string;
  boardWidth: string;
  quantity: number;
  layerCount: string;
  material: string;
  differentCircuits: string;
  assemblyRequired: string;
  thickness: string;
  copperThickness: string;
  halfHoleMachining: string;
  minDrillHole: string;
  minTraceWidth: string;
  chipBGA: string;
  pcbColor: string;
  silkscreenColor: string;
  surfaceFinish: string;
  testMethod: string;
  boardShape: string;
  deliveryTime: string;
  deliveryMethod: string;
  paymentRatio: string;
  notes: string;
}

interface PcbFabricationTabProps {
  formData: PcbFormData;
  onFormChange: (name: string, value: any) => void;
  onFileUpload: (file: File) => void;
  fileError: string;
}

export default function PcbFabricationTab({
  formData,
  onFormChange,
  onFileUpload,
  fileError,
}: PcbFabricationTabProps) {
  const layerOptions = ["1", "2", "4", "6", "8"];
  const materialOptions = ["FR-4", "Nhôm", "Cem", "22F", "94VO", "94HB"];
  const assemblyOptions = ["Không yêu cầu ghép", "Có yêu cầu ghép"];
  const thicknessOptions = ["0.4", "0.6", "0.8", "1.0", "1.2", "1.4", "1.5", "1.6", "2.0"];
  const copperOptions = ["1oz", "2oz"];
  const halfHoleOptions = ["Không", "Có"];
  const minDrillHoleOptions = ["≥ 0.3 mm", "≥ 0.25 mm", "≥ 0.2 mm", "≥ 0.15 mm"];
  const minTraceWidthOptions = ["≥ 0.3 mm", "≥ 0.2 mm", "≥ 6 mil", "≥ 5 mil", "≥ 4 mil", "≥ 3.5 mil", "≥ 3 mil"];
  const chipBGAOptions = ["Không", "≥ 0.35", "≥ 0.3", "≥ 0.25"];
  const pcbColorOptions = ["Xanh lá", "Đỏ", "Vàng", "Xanh da trời", "Đen", "Trắng"];
  const silkscreenColorOptions = ["Trắng", "Đen", "Không in"];
  const surfaceFinishOptions = ["Thiếc chì", "Thiếc không chì", "Vàng", "OSP"];
  const testMethodOptions = ["Mắt thường (đạt>90%)", "Flying probe test (đạt≈100%)"];
  const boardShapeOptions = ["Chữ nhật", "Không phải chữ nhật"];
  const deliveryTimeOptions = ["Bình thường", "Nhanh 13-17 ngày"];
  const deliveryMethodOptions = ["Đến lấy", "Chuyển phát nhanh trả trước", "Chuyển phát nhanh trả sau"];
  const paymentRatioOptions = ["50% đơn hàng", "100% đơn hàng"];

  // Component cho radio buttons
  const RadioButtons = ({ 
    name, 
    value, 
    options, 
    onChange 
  }: { 
    name: string; 
    value: string; 
    options: string[]; 
    onChange: (name: string, value: string) => void;
  }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(name, option)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
            value === option
              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  // Xử lý input số lượng - cho phép nhập tự do
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Nếu trống thì set về 5
    if (value === "") {
      onFormChange("quantity", 5);
      return;
    }
    
    // Cho phép nhập tất cả ký tự, chỉ validate khi blur
    onFormChange("quantity", value);
  };

  const handleQuantityBlur = () => {
    // Khi blur, validate và làm tròn
    const value = formData.quantity.toString();
    
    // Chỉ giữ lại số
    const numericValue = value.replace(/[^0-9]/g, "");
    
    if (numericValue === "") {
      onFormChange("quantity", 5);
      return;
    }
    
    let num = parseInt(numericValue, 10);
    
    // Đảm bảo tối thiểu 5
    if (num < 5) {
      num = 5;
    }
    
    // Làm tròn xuống bội số của 5 gần nhất
    const rounded = Math.floor(num / 5) * 5;
    onFormChange("quantity", rounded);
  };

  // Xử lý input số mạch khác nhau - không giới hạn nhập
  const handleDifferentCircuitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Cho phép nhập tất cả ký tự
    onFormChange("differentCircuits", value);
  };

  const handleDifferentCircuitsBlur = () => {
    const value = formData.differentCircuits;
    
    if (value === "") {
      onFormChange("differentCircuits", "1");
      return;
    }
    
    // Nếu có ký tự không phải số, loại bỏ chúng
    const numericValue = value.replace(/[^0-9]/g, "");
    
    if (numericValue === "") {
      onFormChange("differentCircuits", "1");
    } else {
      onFormChange("differentCircuits", numericValue);
    }
  };

  return (
    <>
      {/* <FileUpload
        onFileUpload={onFileUpload}
        fileError={fileError}
        uploadedFile={formData.gerberFile}
      /> */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Thông số kỹ thuật</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {/* Số lớp */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Số lớp<span className="text-red-500 ml-1">*</span>
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="layerCount"
                value={formData.layerCount}
                options={layerOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Vật liệu */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Vật liệu<span className="text-red-500 ml-1">*</span>
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="material"
                value={formData.material}
                options={materialOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Kích thước */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Kích thước (cm)<span className="text-red-500 ml-1">*</span>
            </div>
            <div className="px-4 py-3 flex items-center">
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.boardHeight}
                    onChange={(e) => onFormChange("boardHeight", e.target.value)}
                    placeholder="Dài"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                  />
                </div>
                <span className="text-gray-500 font-medium">×</span>
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.boardWidth}
                    onChange={(e) => onFormChange("boardWidth", e.target.value)}
                    placeholder="Rộng"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Số lượng - KHÔNG BỊ BLOCK KHI NHẬP */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Số lượng<span className="text-red-500 ml-1">*</span>
            </div>
            <div className="px-4 py-3 flex items-center">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  onBlur={handleQuantityBlur}
                  placeholder="5"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all duration-200"
                />
                <span className="text-xs text-gray-500">(bội số của 5)</span>
              </div>
            </div>
          </div>

          {/* Số mạch khác nhau - KHÔNG BỊ BLOCK KHI NHẬP */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Số mạch khác nhau
            </div>
            <div className="px-4 py-3 flex items-center">
              <input
                type="text"
                value={formData.differentCircuits}
                onChange={handleDifferentCircuitsChange}
                onBlur={handleDifferentCircuitsBlur}
                placeholder="1"
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
              />
            </div>
          </div>

          {/* Yêu cầu ghép mạch */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Yêu cầu ghép mạch
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="assemblyRequired"
                value={formData.assemblyRequired}
                options={assemblyOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Độ dày phíp */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Độ dày phíp (mm)<span className="text-red-500 ml-1">*</span>
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="thickness"
                value={formData.thickness}
                options={thicknessOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Độ dày đồng */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Độ dày đồng<span className="text-red-500 ml-1">*</span>
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="copperThickness"
                value={formData.copperThickness}
                options={copperOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Gia công bán lỗ */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Gia công bán lỗ
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="halfHoleMachining"
                value={formData.halfHoleMachining}
                options={halfHoleOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Lỗ khoan nhỏ nhất */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Lỗ khoan nhỏ nhất
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="minDrillHole"
                value={formData.minDrillHole}
                options={minDrillHoleOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Độ rộng, Cự ly đường mạch */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Độ rộng, Cự ly đường mạch nhỏ nhất
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="minTraceWidth"
                value={formData.minTraceWidth}
                options={minTraceWidthOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Chip BGA */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Chip BGA
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="chipBGA"
                value={formData.chipBGA}
                options={chipBGAOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Màu Board */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Màu Board<span className="text-red-500 ml-1">*</span>
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="pcbColor"
                value={formData.pcbColor}
                options={pcbColorOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Màu chữ */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Màu chữ<span className="text-red-500 ml-1">*</span>
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="silkscreenColor"
                value={formData.silkscreenColor}
                options={silkscreenColorOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Mạ */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Mạ<span className="text-red-500 ml-1">*</span>
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="surfaceFinish"
                value={formData.surfaceFinish}
                options={surfaceFinishOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Phương thức kiểm tra */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Phương thức kiểm tra
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="testMethod"
                value={formData.testMethod}
                options={testMethodOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Hình dạng bảng mạch */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Hình dạng bảng mạch
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="boardShape"
                value={formData.boardShape}
                options={boardShapeOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Thời gian giao hàng */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Thời gian giao hàng
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="deliveryTime"
                value={formData.deliveryTime}
                options={deliveryTimeOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Phương thức giao hàng */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Phương thức giao hàng
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="deliveryMethod"
                value={formData.deliveryMethod}
                options={deliveryMethodOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Tỷ lệ thanh toán */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Tỷ lệ thanh toán
            </div>
            <div className="px-4 py-3 flex items-center">
              <RadioButtons
                name="paymentRatio"
                value={formData.paymentRatio}
                options={paymentRatioOptions}
                onChange={onFormChange}
              />
            </div>
          </div>

          {/* Ghi chú - CHO PHÉP NHẬP NHIỀU KÝ TỰ */}
          <div className="grid grid-cols-[30%_70%] border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="px-4 py-4 text-sm font-medium text-gray-700 flex items-center">
              Ghi chú
            </div>
            <div className="px-4 py-3 flex items-center">
              <textarea
                name="notes"
                value={formData.notes}
                onChange={(e) => onFormChange("notes", e.target.value)}
                rows={3}
                placeholder="Nhập ghi chú thêm..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}