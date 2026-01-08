import React, { useState, useMemo, useEffect } from 'react';
import { ShippingAddress } from '@/types/shipping-address.type';
import { useRouter } from 'next/navigation';

interface ShippingAddressSelectionProps {
  shippingAddresses: ShippingAddress[];
  onSelectAddress: (selectedAddressId: number) => void;
}

const ShippingAddressSelection: React.FC<ShippingAddressSelectionProps> = ({
  shippingAddresses,
  onSelectAddress,
}) => {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // Tìm địa chỉ mặc định
  const defaultAddress = useMemo(() => {
    return shippingAddresses.find((address) => address.is_default);
  }, [shippingAddresses]);

  // Danh sách hiển thị (mặc định lên đầu)
  const addressesToDisplay = useMemo(() => {
    if (defaultAddress) {
      return [defaultAddress, ...shippingAddresses.filter((address) => address.id !== defaultAddress.id)];
    }
    return shippingAddresses;
  }, [shippingAddresses, defaultAddress]);

  // Tự động chọn địa chỉ mặc định
  useEffect(() => {
    if (!selectedAddressId && defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
      onSelectAddress(defaultAddress.id);
    }
  }, [selectedAddressId, defaultAddress, onSelectAddress]);

  const handleAddressSelect = (addressId: number) => {
    setSelectedAddressId(addressId);
    onSelectAddress(addressId);
  };

  const handleAddNewAddress = () => {
    router.push('/tai-khoan?p=address');
  };

  // Lấy địa chỉ đang chọn
  const selectedAddress = useMemo(() => {
    return shippingAddresses.find(addr => addr.id === selectedAddressId);
  }, [shippingAddresses, selectedAddressId]);

  // Nếu không có địa chỉ
  if (shippingAddresses.length === 0) {
    return (
      <div className="bg-white">
        <div className="text-center py-6">
          <p className="text-gray-600 mb-3">Bạn chưa có địa chỉ giao hàng</p>
          <button
            onClick={handleAddNewAddress}
            className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-900 transition-colors"
          >
            + Thêm địa chỉ mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mb-4">
        <button
          onClick={handleAddNewAddress}
          className="px-3 py-2 text-gray-800 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          + Thêm địa chỉ mới
        </button>
      </div>

      <div className="space-y-3">
        {addressesToDisplay.map((address) => {
          const isSelected = selectedAddressId === address.id;
          
          return (
            <div
              key={address.id}
              onClick={() => handleAddressSelect(address.id)}
              className={`
                p-3 border cursor-pointer transition-colors
                ${isSelected ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{address.name}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-700">{address.phone}</span>
                  {address.is_default && (
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1">
                      Mặc định
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                {address.address}
                {address.ward && `, ${address.ward}`}
                {address.district && `, ${address.district}`}
                {address.province && `, ${address.province}`}
              </div>
              
              {address.note && (
                <div className="mt-1 text-sm text-gray-500">
                  Ghi chú: {address.note}
                </div>
              )}
              
              {isSelected && (
                <div className="mt-2 text-sm text-gray-800 font-medium">
                  ✓ Đã chọn
                </div>
              )}
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default ShippingAddressSelection;