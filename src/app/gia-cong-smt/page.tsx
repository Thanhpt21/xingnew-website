// app/page.tsx - ĐÃ BỎ TÍNH PHÍ
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PcbFabricationTab, { PcbFormData } from "@/components/layout/pcb/PcbFabricationTab";
import PcbAssemblyTab, { AssemblyFormData } from "@/components/layout/pcb/PcbAssemblyTab";
import StencilTab, { StencilFormData } from "@/components/layout/pcb/StencilTab";
import TabNavigation from "@/components/layout/pcb/TabNavigation";
import PriceSummary from "@/components/layout/pcb/PriceSummary";
import ContactInfo from "@/components/layout/pcb/ContactInfo";
import CompanyInfo from "@/components/layout/pcb/CompanyInfo";

import { PcbOrderFormData, PcbOrderType, PcbOrderStatus, PcbPaymentStatus } from "@/types/pcb-order.type";
import { useCreatePcbOrder } from "@/hooks/pcb-order/useCreatePcbOrder";
import { useAuth } from "@/context/AuthContext";

export default function QuotePage() {
  const [activeTab, setActiveTab] = useState<"pcb" | "assembly" | "stencil">("pcb");
  const [isCalculating, setIsCalculating] = useState(false);
  const [fileError, setFileError] = useState("");
  const { currentUser, isLoading: isLoadingAuth } = useAuth();
  const userId = currentUser?.id;

  const createPcbOrderMutation = useCreatePcbOrder();

  // PCB FORM DATA
  const [pcbFormData, setPcbFormData] = useState<PcbFormData>({
    gerberFile: null,
    boardHeight: "",
    boardWidth: "",
    quantity: 1,
    layerCount: "2",
    material: "FR-4",
    differentCircuits: "1",
    assemblyRequired: "Không yêu cầu ghép",
    thickness: "1.6",
    copperThickness: "1oz",
    halfHoleMachining: "Không",
    minDrillHole: "≥ 0.3 mm",
    minTraceWidth: "≥ 0.3 mm",
    chipBGA: "Không",
    pcbColor: "Xanh lá",
    silkscreenColor: "Trắng",
    surfaceFinish: "Thiếc không chì",
    testMethod: "Mắt thường (đạt>90%)",
    boardShape: "Chữ nhật",
    deliveryTime: "Bình thường",
    deliveryMethod: "Chuyển phát nhanh trả sau",
    paymentRatio: "100% đơn hàng",
    notes: "",
  });

  const [assemblyFormData, setAssemblyFormData] = useState<AssemblyFormData>({
    gerberFile: null,
    boardWidth: "",
    boardHeight: "",
    quantity: 5,
    smdPoints: "",
    dipPoints: "",
    assemblySides: "one_side",
    componentTypes: "",
    totalComponents: "",
    packaging: "standard",
    pcbaConfirmation: false,
    componentSource: "customer",
    notes: "",
  });

  const [stencilFormData, setStencilFormData] = useState<StencilFormData>({
    gerberFile: null,
    boardWidth: "",
    boardHeight: "",
    quantity: 1,
    stencilType: "framed",
    electropolishing: "no",
    stencilSide: "top",
    fiducials: "none",
    notes: "",
  });

  // Price Info - ĐÃ ĐƠN GIẢN HÓA
  const [priceInfo, setPriceInfo] = useState({
    area: 0,
  });

  // HANDLERS
  const handlePcbFormChange = (name: string, value: any) => {
    setPcbFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssemblyFormChange = (name: string, value: any) => {
    setAssemblyFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStencilFormChange = (name: string, value: any) => {
    setStencilFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (file: File, type: "pcb" | "assembly" | "stencil") => {
    if (file) {
      const allowedTypes = [
        'application/zip',
        'application/x-zip-compressed',
        'application/x-rar-compressed',
        'application/rar',
        'application/x-rar',
      ];
      
      const fileExt = file.name.toLowerCase().split('.').pop();
      const isAllowedType = allowedTypes.includes(file.type) || ['zip', 'rar'].includes(fileExt || '');
      
      if (!isAllowedType) {
        setFileError('Chỉ chấp nhận file ZIP hoặc RAR');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setFileError('File quá lớn. Kích thước tối đa: 10MB');
        return;
      }
      
      setFileError("");
      
      if (type === "pcb") {
        setPcbFormData((prev) => ({ ...prev, gerberFile: file }));
      } else if (type === "assembly") {
        setAssemblyFormData((prev) => ({ ...prev, gerberFile: file }));
      } else {
        setStencilFormData((prev) => ({ ...prev, gerberFile: file }));
      }
    }
  };

  // CALCULATION FUNCTIONS - CHỈ TÍNH DIỆN TÍCH
  const calculateArea = (): number => {
    let length = 0;
    let width = 0;
    
    switch (activeTab) {
      case "pcb":
        length = parseFloat(pcbFormData.boardHeight) || 0;
        width = parseFloat(pcbFormData.boardWidth) || 0;
        break;
      case "assembly":
        width = parseFloat(assemblyFormData.boardWidth) || 0;
        length = parseFloat(assemblyFormData.boardHeight) || 0;
        break;
      case "stencil":
        width = parseFloat(stencilFormData.boardWidth) || 0;
        length = parseFloat(stencilFormData.boardHeight) || 0;
        break;
    }
    
    // Chuyển từ cm sang mm, tính diện tích mm² rồi chuyển sang m²
    const lengthMm = length * 10;
    const widthMm = width * 10;
    const areaMm2 = lengthMm * widthMm;
    return areaMm2 / 1000000;
  };

  useEffect(() => {
    const totalArea = calculateArea();
    setPriceInfo({ area: totalArea });
  }, [
    activeTab,
    pcbFormData.boardHeight,
    pcbFormData.boardWidth,
    assemblyFormData.boardWidth,
    assemblyFormData.boardHeight,
    stencilFormData.boardWidth,
    stencilFormData.boardHeight,
  ]);

  // COMPILE FORM DATA
  const compilePcbOrderFormData = (): PcbOrderFormData => {
    console.log('🔍 DEBUG compilePcbOrderFormData: Bắt đầu');
    
    if (!userId) {
      console.error('❌ DEBUG: userId KHÔNG TỒN TẠI!');
      throw new Error('Vui lòng đăng nhập để gửi yêu cầu báo giá');
    }

    const gerberFile = 
      activeTab === "pcb" ? pcbFormData.gerberFile :
      activeTab === "assembly" ? assemblyFormData.gerberFile :
      stencilFormData.gerberFile;

    const quantity = 
      activeTab === "pcb" ? pcbFormData.quantity :
      activeTab === "assembly" ? assemblyFormData.quantity :
      stencilFormData.quantity;

    const boardHeight = 
      activeTab === "pcb" ? parseFloat(pcbFormData.boardHeight) || 0 :
      activeTab === "assembly" ? parseFloat(assemblyFormData.boardHeight) || 0 :
      parseFloat(stencilFormData.boardHeight) || 0;

    const boardWidth = 
      activeTab === "pcb" ? parseFloat(pcbFormData.boardWidth) || 0 :
      activeTab === "assembly" ? parseFloat(assemblyFormData.boardWidth) || 0 :
      parseFloat(stencilFormData.boardWidth) || 0;

    const totalArea = calculateArea();

    // GIÁ TRỊ MẶC ĐỊNH = 0 (không tính phí)
    const baseFormData: PcbOrderFormData = {
      userId: userId,
      pcbOrderType: activeTab as PcbOrderType,
      quantity: quantity,
      unitPrice: 0,
      totalPrice: 0,
      fastDelivery: false,
      fastDeliveryFee: 0,
      finalTotal: 0,
      boardWidth: boardWidth,
      boardHeight: boardHeight,
      totalArea: totalArea,
      
      notes: activeTab === "pcb" ? pcbFormData.notes :
            activeTab === "assembly" ? assemblyFormData.notes :
            stencilFormData.notes,
      status: PcbOrderStatus.NEW,
      paymentStatus: PcbPaymentStatus.PENDING,
    };

    if (gerberFile) {
      baseFormData.gerberFile = gerberFile;
      baseFormData.gerberFileName = gerberFile.name;
      baseFormData.gerberFileSize = gerberFile.size;
      baseFormData.gerberFileType = gerberFile.type;
    }

    if (activeTab === "pcb") {
      baseFormData.pcbDetails = {
        layerCount: pcbFormData.layerCount,
        material: pcbFormData.material,
        differentCircuits: pcbFormData.differentCircuits,
        assemblyRequired: pcbFormData.assemblyRequired,
        thickness: pcbFormData.thickness,
        copperThickness: pcbFormData.copperThickness,
        halfHoleMachining: pcbFormData.halfHoleMachining,
        minDrillHole: pcbFormData.minDrillHole,
        minTraceWidth: pcbFormData.minTraceWidth,
        chipBGA: pcbFormData.chipBGA,
        pcbColor: pcbFormData.pcbColor,
        silkscreenColor: pcbFormData.silkscreenColor,
        surfaceFinish: pcbFormData.surfaceFinish,
        testMethod: pcbFormData.testMethod,
        boardShape: pcbFormData.boardShape,
        deliveryTime: pcbFormData.deliveryTime,
        deliveryMethod: pcbFormData.deliveryMethod,
        paymentRatio: pcbFormData.paymentRatio,
      };
    } else if (activeTab === "assembly") {
      baseFormData.assemblyDetails = {
        smdPoints: parseInt(assemblyFormData.smdPoints) || 0,
        dipPoints: parseInt(assemblyFormData.dipPoints) || 0,
        assemblySides: assemblyFormData.assemblySides,
        componentTypes: assemblyFormData.componentTypes,
        totalComponents: assemblyFormData.totalComponents,
        packaging: assemblyFormData.packaging,
        pcbaConfirmation: assemblyFormData.pcbaConfirmation,
        componentSource: assemblyFormData.componentSource,
      };
    } else if (activeTab === "stencil") {
      baseFormData.stencilDetails = {
        stencilType: stencilFormData.stencilType,
        electropolishing: stencilFormData.electropolishing,
        stencilSide: stencilFormData.stencilSide,
        fiducials: stencilFormData.fiducials,
      };
    }

    console.log('✅ DEBUG: Dữ liệu cuối cùng:', baseFormData);
    return baseFormData;
  };

  // SUBMIT HANDLER
  const handleSubmit = async () => {
    if (!userId) {
      alert('Vui lòng đăng nhập để gửi yêu cầu báo giá');
      return;
    }
    
    let boardHeight = 0;
    let boardWidth = 0;
    
    switch (activeTab) {
      case "pcb":
        boardHeight = parseFloat(pcbFormData.boardHeight);
        boardWidth = parseFloat(pcbFormData.boardWidth);
        break;
      case "assembly":
        boardWidth = parseFloat(assemblyFormData.boardWidth);
        boardHeight = parseFloat(assemblyFormData.boardHeight);
        break;
      case "stencil":
        boardWidth = parseFloat(stencilFormData.boardWidth);
        boardHeight = parseFloat(stencilFormData.boardHeight);
        break;
    }
    
    if (!boardWidth || !boardHeight || boardWidth <= 0 || boardHeight <= 0) {
      alert('Vui lòng nhập kích thước board hợp lệ');
      return;
    }
    
    try {
      const formData = compilePcbOrderFormData();
      const result = await createPcbOrderMutation.mutateAsync(formData);
      
      alert(`✅ Gửi yêu cầu báo giá thành công!\n\n📦 Mã yêu cầu: ${result.pcbOrderId}\n\nChúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất!`);
      
      // Reset form
      if (activeTab === "pcb") {
        setPcbFormData({
          gerberFile: null,
          boardHeight: "",
          boardWidth: "",
          quantity: 5,
          layerCount: "2",
          material: "FR-4",
          differentCircuits: "1",
          assemblyRequired: "Không yêu cầu ghép",
          thickness: "1.6",
          copperThickness: "1oz",
          halfHoleMachining: "Không",
          minDrillHole: "≥ 0.3 mm",
          minTraceWidth: "≥ 0.3 mm",
          chipBGA: "Không",
          pcbColor: "Xanh lá",
          silkscreenColor: "Trắng",
          surfaceFinish: "Thiếc không chì",
          testMethod: "Mắt thường (đạt>90%)",
          boardShape: "Chữ nhật",
          deliveryTime: "Bình thường",
          deliveryMethod: "Chuyển phát nhanh trả sau",
          paymentRatio: "100% đơn hàng",
          notes: "",
        });
      } else if (activeTab === "assembly") {
        setAssemblyFormData({
          gerberFile: null,
          boardWidth: "",
          boardHeight: "",
          quantity: 5,
          smdPoints: "",
          dipPoints: "",
          assemblySides: "one_side",
          componentTypes: "",
          totalComponents: "",
          packaging: "standard",
          pcbaConfirmation: false,
          componentSource: "customer",
          notes: "",
        });
      } else {
        setStencilFormData({
          gerberFile: null,
          boardWidth: "",
          boardHeight: "",
          quantity: 1,
          stencilType: "framed",
          electropolishing: "no",
          stencilSide: "top",
          fiducials: "none",
          notes: "",
        });
      }
      
      setPriceInfo({ area: 0 });
      
    } catch (error: any) {
      console.error('❌ Lỗi khi gửi yêu cầu:', error);
      
      if (error.response?.data?.message) {
        alert(`❌ ${error.response.data.message}`);
      } else if (error.message) {
        alert(`❌ ${error.message}`);
      } else {
        alert('❌ Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
      }
    }
  };

  // RENDER
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">
              Trang chủ
            </a>
            <span className="mx-2">/</span>
            <span className="font-semibold">
              {activeTab === "pcb" 
                ? "Báo giá gia công PCB" 
                : activeTab === "assembly" 
                ? "Báo giá lắp ráp PCB" 
                : "Báo giá SMT Stencil"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {activeTab === "pcb" 
              ? "Báo giá gia công PCB" 
              : activeTab === "assembly" 
              ? "Báo giá lắp ráp PCB" 
              : "Báo giá SMT Stencil"}
          </h1>
          <p className="text-gray-600">Nhận báo giá nhanh chóng trong vòng 15 phút</p>
        </motion.div>

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === "pcb" && (
              <PcbFabricationTab
                formData={pcbFormData}
                onFormChange={handlePcbFormChange}
                onFileUpload={(file) => handleFileUpload(file, "pcb")}
                fileError={fileError}
              />
            )}
          </div>

          <div className="space-y-6">
           
            <PriceSummary
              quantity={
                activeTab === "pcb" 
                  ? pcbFormData.quantity 
                  : activeTab === "assembly" 
                  ? assemblyFormData.quantity 
                  : stencilFormData.quantity
              }
              area={priceInfo.area}
              unitPrice={0}
              totalPrice={0}
              isCalculating={isCalculating}
              isSubmitting={createPcbOrderMutation.isPending}
              onSubmit={handleSubmit}
              showDeliveryOptions={activeTab === "pcb"}
            />


            <ContactInfo />
            <CompanyInfo />
          </div>
        </div>
      </div>
    </div>
  );
}