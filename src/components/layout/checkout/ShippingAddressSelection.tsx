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
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
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
          className="px-3 py-2 text-blue-600 border border-blue-300 hover:bg-blue-50"
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
                p-3 border cursor-pointer
                ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{address.name}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-700">{address.phone}</span>
                  {address.is_default && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1">
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
                <div className="mt-2 text-sm text-blue-600">
                  ✓ Đã chọn
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Selected address summary */}
      {selectedAddress && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200">
          <div className="font-medium text-blue-800 mb-1">
            Địa chỉ giao hàng:
          </div>
          <p className="text-sm text-gray-700">
            {selectedAddress.name} • {selectedAddress.phone}
          </p>
          <p className="text-sm text-gray-600">
            {selectedAddress.address}
            {selectedAddress.ward && `, ${selectedAddress.ward}`}
            {selectedAddress.district && `, ${selectedAddress.district}`}
            {selectedAddress.province && `, ${selectedAddress.province}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ShippingAddressSelection;