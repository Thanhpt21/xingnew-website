import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/user.type";
import { useRouter } from "next/navigation";

// components/layout/pcb/PriceSummary.tsx
interface PriceSummaryProps {
  quantity: number;
  area: number;
  unitPrice: number;
  totalPrice: number;
  isCalculating: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  showDeliveryOptions: boolean;
}

export default function PriceSummary({
  quantity,
  area,
  unitPrice,
  totalPrice,
  isCalculating,
  isSubmitting,
  onSubmit,
  showDeliveryOptions,
}: PriceSummaryProps) {
    const { currentUser, isLoading: isLoadingAuth } = useAuth();
  const router = useRouter();
  
  const userPhone = currentUser?.phone || "";
  const userEmail = currentUser?.email || "";
  const userName = currentUser?.name || "";
  
  // Kiểm tra xem có trường nào chưa cập nhật không
  const hasMissingInfo = !userName || !userEmail || !userPhone;
  
  // Đếm số trường thiếu
  const missingFields = [
    !userName && "Họ tên",
    !userEmail && "Email",
    !userPhone && "Số điện thoại"
  ].filter(Boolean);
  
  const handleNavigateToProfile = () => {
    router.push("/tai-khoan?p=personal");
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt báo giá</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Số lượng</span>
          <span className="font-medium">{quantity} cái</span>
        </div>
        
        {/* Hiển thị thông tin người dùng */}
        <div className="pt-3 border-t">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ tên
              </label>
              <input
                type="text"
                value={userName || "Chưa cập nhật"}
                disabled
                className={`w-full px-3 py-2 rounded-lg border ${
                  userName 
                    ? "bg-gray-50 border-gray-300 text-gray-700 cursor-not-allowed" 
                    : "bg-red-50 border-red-300 text-red-700 cursor-not-allowed"
                }`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={userEmail || "Chưa cập nhật"}
                disabled
                className={`w-full px-3 py-2 rounded-lg border ${
                  userEmail 
                    ? "bg-gray-50 border-gray-300 text-gray-700 cursor-not-allowed" 
                    : "bg-red-50 border-red-300 text-red-700 cursor-not-allowed"
                }`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={userPhone || "Chưa cập nhật"}
                disabled
                className={`w-full px-3 py-2 rounded-lg border ${
                  userPhone 
                    ? "bg-gray-50 border-gray-300 text-gray-700 cursor-not-allowed" 
                    : "bg-red-50 border-red-300 text-red-700 cursor-not-allowed"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Nút cập nhật thông tin (luôn hiển thị nhưng bị disabled khi không thiếu thông tin) */}
      <button
        onClick={handleNavigateToProfile}
        disabled={!hasMissingInfo}
        className={`w-full py-3 px-4 mb-3 rounded-lg font-semibold text-white transition-colors flex items-center justify-center ${
          hasMissingInfo
            ? 'bg-yellow-500 hover:bg-yellow-600'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
          />
        </svg>
        {hasMissingInfo ? 'CẬP NHẬT THÔNG TIN' : 'THÔNG TIN ĐÃ ĐẦY ĐỦ'}
      </button>
      
      {/* Nút gửi yêu cầu - bị disable nếu có thông tin thiếu */}
      <button
        onClick={onSubmit}
        disabled={isSubmitting || isCalculating || hasMissingInfo}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
          isSubmitting || isCalculating || hasMissingInfo
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Đang xử lý...
          </div>
        ) : isCalculating ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Đang tính toán...
          </div>
        ) : hasMissingInfo ? (
          'VUI LÒNG CẬP NHẬT THÔNG TIN TRÊN'
        ) : (
          'GỬI YÊU CẦU BÁO GIÁ'
        )}
      </button>
      
      <p className="text-xs text-gray-500 text-center mt-3">
        {hasMissingInfo 
          ? `Vui lòng cập nhật: ${missingFields.join(", ")} để tiếp tục`
          : "Chúng tôi sẽ liên hệ gửi báo giá"
        }
      </p>
    </div>
  );
}