// components/FileUpload.tsx
"use client";

import { motion } from "framer-motion";
import { UploadOutlined, FileZipOutlined } from "@ant-design/icons";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  fileError: string;
  uploadedFile: File | null;
  allowedTypes?: string[];
  label?: string;
}

export default function FileUpload({
  onFileUpload,
  fileError,
  uploadedFile,
  allowedTypes = [".rar", ".zip"],
  label = "Upload Gerber file",
}: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        return;
      }
      onFileUpload(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
    >
      <div className="flex items-center mb-4">
        <UploadOutlined className="text-blue-600 text-xl mr-3" />
        <h2 className="text-xl font-bold text-gray-900">{label}</h2>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chỉ chấp nhận file {allowedTypes.join(", ")}{" "}
          <a href="#" className="text-blue-600 hover:underline ml-1 text-sm">
            Xem hướng dẫn
          </a>
        </label>
        <div className="mt-2">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileZipOutlined className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click để upload file</span> hoặc kéo thả vào đây
              </p>
              <p className="text-xs text-gray-500">
                {allowedTypes.map(ext => ext.toUpperCase()).join(", ")} (Tối đa 10MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept={allowedTypes.join(",")}
              onChange={handleFileChange}
            />
          </label>
          {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
          {uploadedFile && (
            <p className="mt-2 text-sm text-green-600">✓ Đã upload: {uploadedFile.name}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}