"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ShippingAddress } from "@/types/shipping-address.type";
import { useShippingAddressesByUserId } from "@/hooks/shipping-address/useShippingAddressesByUserId";
import { useCreateShippingAddress } from "@/hooks/shipping-address/useCreateShippingAddress";
import { useDeleteShippingAddress } from "@/hooks/shipping-address/useDeleteShippingAddress";
import { useSetDefaultShippingAddress } from "@/hooks/shipping-address/useSetDefaultShippingAddress";
import { useUpdateShippingAddress } from "@/hooks/shipping-address/useUpdateShippingAddress";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface Province {
  code: string;
  name: string;
}
interface District {
  code: string;
  name: string;
}
interface Ward {
  code: string;
  name: string;
}

const AddressShipping: React.FC<{ userId: number | string }> = ({ userId }) => {
  const userIdNumber = Number(userId);
  const router = useRouter();
  
  const {
    data: shippingAddresses = [],
    isLoading,
    isError,
  } = useShippingAddressesByUserId(userIdNumber);
  
  const { mutate: createShippingAddress } = useCreateShippingAddress();
  const { mutate: deleteShippingAddress } = useDeleteShippingAddress();
  const { mutate: setDefaultShippingAddress } = useSetDefaultShippingAddress();
  const { mutate: updateShippingAddress } = useUpdateShippingAddress();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [formValues, setFormValues] = useState<ShippingAddress | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  
  const provincesCache = useRef<Record<string, Province[]>>({});
  const districtsCache = useRef<Record<string, District[]>>({});
  const wardsCache = useRef<Record<string, Ward[]>>({});

  const getDefaultFormValues = useCallback((): ShippingAddress => ({
    id: 0,
    userId: userIdNumber,
    name: "",
    phone: "",
    address: "",
    note: "",
    province_id: 0,
    province: "",
    district_id: 0,
    district: "",
    ward_id: 0,
    ward: "",
    province_name: "",
    district_name: "",
    ward_name: "",
    is_default: false,
    createdAt: "",
    updatedAt: "",
  }), [userIdNumber]);

  // Fetch provinces on mount with caching
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        if (provincesCache.current['all']?.length) {
          setProvinces(provincesCache.current['all']);
          return;
        }

        const res = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm');
        const data = await res.json();
        if (data.error === 0 && data.data) {
          const formatted = data.data.map((p: any) => ({
            code: p.id,
            name: p.full_name,
          }));
          setProvinces(formatted);
          provincesCache.current['all'] = formatted;
        }
      } catch (error) {
        console.error('Lỗi load tỉnh:', error);
      }
    };
    
    fetchProvinces();
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (isModalOpen) {
      if (editingAddress) {
        setFormValues({ ...editingAddress, userId: userIdNumber });
        setSelectedProvince(String(editingAddress.province_id));
        setSelectedDistrict(String(editingAddress.district_id));
        setSelectedWard(String(editingAddress.ward_id));
        
        const loadCachedData = async () => {
          const provId = String(editingAddress.province_id);
          const distId = String(editingAddress.district_id);
          
          if (provId && provId !== "0") {
            const cachedDistricts = districtsCache.current[provId];
            if (cachedDistricts) {
              setDistricts(cachedDistricts);
            } else {
              try {
                const distRes = await fetch(`https://esgoo.net/api-tinhthanh/2/${provId}.htm`);
                const distData = await distRes.json();
                if (distData.error === 0 && distData.data) {
                  const formattedDist = distData.data.map((d: any) => ({
                    code: d.id,
                    name: d.full_name,
                  }));
                  setDistricts(formattedDist);
                  districtsCache.current[provId] = formattedDist;
                }
              } catch (err) {
                console.error('Lỗi load quận/huyện:', err);
              }
            }

            if (distId && distId !== '0') {
              const cachedWards = wardsCache.current[distId];
              if (cachedWards) {
                setWards(cachedWards);
              } else {
                try {
                  const wardRes = await fetch(`https://esgoo.net/api-tinhthanh/3/${distId}.htm`);
                  const wardData = await wardRes.json();
                  if (wardData.error === 0 && wardData.data) {
                    const formattedWard = wardData.data.map((w: any) => ({
                      code: w.id,
                      name: w.full_name,
                    }));
                    setWards(formattedWard);
                    wardsCache.current[distId] = formattedWard;
                  }
                } catch (err) {
                  console.error('Lỗi load phường/xã:', err);
                }
              }
            }
          }
        };
        
        loadCachedData();
      } else {
        setFormValues(getDefaultFormValues());
        setSelectedProvince("");
        setSelectedDistrict("");
        setSelectedWard("");
        setDistricts([]);
        setWards([]);
      }
    }
  }, [isModalOpen, editingAddress, userIdNumber, getDefaultFormValues]);

  const handleProvinceChange = async (value: string) => {
    const province = provinces.find((p) => p.code === value);
    if (!province) return;

    setSelectedProvince(value);
    setSelectedDistrict("");
    setSelectedWard("");
    setWards([]);
    
    if (formValues) {
      setFormValues({
        ...formValues,
        province_id: Number(value),
        province: province.name,
        province_name: province.name,
        district_id: 0,
        district: "",
        district_name: "",
        ward_id: 0,
        ward: "",
        ward_name: "",
      });
    }

    const cachedDistricts = districtsCache.current[value];
    if (cachedDistricts) {
      setDistricts(cachedDistricts);
      return;
    }

    try {
      const res = await fetch(`https://esgoo.net/api-tinhthanh/2/${value}.htm`);
      const data = await res.json();
      if (data.error === 0 && data.data) {
        const formatted = data.data.map((d: any) => ({
          code: d.id,
          name: d.full_name,
        }));
        setDistricts(formatted);
        districtsCache.current[value] = formatted;
      }
    } catch (err) {
      console.error('Lỗi load quận/huyện:', err);
    }
  };

  const handleDistrictChange = async (value: string) => {
    const district = districts.find((d) => d.code === value);
    if (!district) return;

    setSelectedDistrict(value);
    setSelectedWard("");
    
    if (formValues) {
      setFormValues({
        ...formValues,
        district_id: Number(value),
        district: district.name,
        district_name: district.name,
        ward_id: 0,
        ward: "",
        ward_name: "",
      });
    }

    const cachedWards = wardsCache.current[value];
    if (cachedWards) {
      setWards(cachedWards);
      return;
    }

    try {
      const res = await fetch(`https://esgoo.net/api-tinhthanh/3/${value}.htm`);
      const data = await res.json();
      if (data.error === 0 && data.data) {
        const formatted = data.data.map((w: any) => ({
          code: w.id,
          name: w.full_name,
        }));
        setWards(formatted);
        wardsCache.current[value] = formatted;
      }
    } catch (err) {
      console.error('Lỗi load phường/xã:', err);
    }
  };

  const handleWardChange = (value: string) => {
    const ward = wards.find((w) => w.code === value);
    if (!ward || !formValues) return;

    setSelectedWard(value);
    setFormValues({
      ...formValues,
      ward_id: Number(value),
      ward: ward.name,
      ward_name: ward.name,
    });
  };

  const handleInputChange = useCallback((field: keyof ShippingAddress, value: any) => {
    if (formValues) {
      setFormValues({
        ...formValues,
        [field]: value,
      });
    }
  }, [formValues]);

  const openAddModal = useCallback(() => {
    setEditingAddress(null);
    setIsModalOpen(true);
  }, []);

  const handleSubmit = async () => {
    if (!formValues) return;
    
    const { name, phone, address, province_id, district_id, ward_id } = formValues;
    if (!name || !phone || !address || !province_id || !district_id || !ward_id) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    try {
      if (editingAddress) {
        await updateShippingAddress({
          id: editingAddress.id,
          data: formValues,
        });
      } else {
        await createShippingAddress({ ...formValues, userId: userIdNumber });
      }

      queryClient.invalidateQueries({
        queryKey: ["shipping-addresses", "user", userIdNumber],
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Lỗi submit:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      deleteShippingAddress(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["shipping-addresses", "user", userIdNumber],
          });
        },
      });
    }
  };

  const handleSetDefault = (addressId: number) => {
    if (confirm("Đặt làm địa chỉ mặc định?")) {
      setDefaultShippingAddress({ userId: userIdNumber, addressId }, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["shipping-addresses", "user", userIdNumber],
          });
        },
      });
    }
  };

  const handleBackToOrder = () => {
    router.push("/dat-hang");
  };

  const isAddButtonDisabled = shippingAddresses.length >= 5;

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full py-8">
        <div className="text-center p-4 bg-red-50">
          <div className="text-red-600 font-medium mb-2">Lỗi tải dữ liệu</div>
          <p className="text-gray-600">Không thể tải địa chỉ. Vui lòng thử lại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Địa chỉ giao hàng
          </h2>
          <p className="text-gray-600">
            Quản lý địa chỉ giao hàng của bạn ({shippingAddresses.length}/5)
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => isAddButtonDisabled ? null : openAddModal()}
            disabled={isAddButtonDisabled}
            className={`px-4 py-2 rounded font-medium ${
              isAddButtonDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            + Thêm địa chỉ mới
          </button>
          
          <button
            onClick={handleBackToOrder}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50"
          >
            Quay lại trang đặt hàng
          </button>
        </div>
      </div>

      {/* Address List */}
      <div className="space-y-3">
        {shippingAddresses.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 border">
            <p className="text-gray-500 font-medium mb-2">Chưa có địa chỉ nào</p>
            <p className="text-gray-400 mb-4">Thêm địa chỉ để mua sắm dễ dàng hơn</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
              >
                Thêm địa chỉ đầu tiên
              </button>
              <button
                onClick={handleBackToOrder}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50"
              >
                Quay lại đặt hàng
              </button>
            </div>
          </div>
        ) : (
          shippingAddresses.map((address: ShippingAddress) => (
            <div
              key={address.id}
              className={`bg-white p-4 border ${
                address.is_default ? "border-blue-500" : "border-gray-200"
              }`}
            >
              <div className="md:flex md:items-start gap-4">
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="font-medium text-gray-900">
                      {address.name}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {address.phone}
                    </span>
                    {address.is_default && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        Mặc định
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-2">
                    {address.address}, {address.ward_name || address.ward},{" "}
                    {address.district_name || address.district},{" "}
                    {address.province_name || address.province}
                  </p>

                  {address.note && (
                    <p className="text-sm text-gray-500">
                      Ghi chú: {address.note}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3 md:mt-0">
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    disabled={address.is_default}
                    className={`px-3 py-1 rounded text-sm ${
                      address.is_default
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    {address.is_default ? "Đang dùng" : "Đặt mặc định"}
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="px-3 py-1 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && formValues && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="border-b p-4">
              <h3 className="font-semibold text-gray-900">
                {editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
              </h3>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={formValues.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={formValues.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="0901234567"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tỉnh/Thành phố *
                  </label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Chọn tỉnh/thành</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.code}>{p.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quận/Huyện *
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    disabled={!selectedProvince}
                    className={`w-full px-3 py-2 border rounded ${
                      !selectedProvince ? "bg-gray-100 text-gray-400" : ""
                    }`}
                  >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((d) => (
                      <option key={d.code} value={d.code}>{d.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phường/Xã *
                  </label>
                  <select
                    value={selectedWard}
                    onChange={(e) => handleWardChange(e.target.value)}
                    disabled={!selectedDistrict}
                    className={`w-full px-3 py-2 border rounded ${
                      !selectedDistrict ? "bg-gray-100 text-gray-400" : ""
                    }`}
                  >
                    <option value="">Chọn phường/xã</option>
                    {wards.map((w) => (
                      <option key={w.code} value={w.code}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ chi tiết *
                </label>
                <textarea
                  value={formValues.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Số nhà, tên đường, khu vực..."
                  rows={3}
                  className="w-full px-3 py-2 border rounded resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  value={formValues.note}
                  onChange={(e) => handleInputChange("note", e.target.value)}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                  rows={2}
                  className="w-full px-3 py-2 border rounded resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
                >
                  Lưu địa chỉ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressShipping;