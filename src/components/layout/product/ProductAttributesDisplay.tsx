import { Card, Skeleton, Tag, Space, Typography, Checkbox, Button, Tooltip } from "antd";
import { useProductAttributes } from "@/hooks/product-attribute/useProductAttributes";
import { useSimilarProducts } from "@/hooks/product-attribute/useSimilarProducts";
import { useState, useEffect } from "react";
import { FilterOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Attribute {
  id: number;
  name: string;
  position: number;
  values: {
    id: number;
    attributeId: number;
    value: string;
  }[];
}

interface ProductAttribute {
  productId: number;
  attributeId: number;
  attribute: Attribute;
}

interface ProductAttributesDisplayProps {
  productId: number;
  categoryId?: number;
}

export default function ProductAttributesDisplay({ 
  productId, 
  categoryId 
}: ProductAttributesDisplayProps) {
  const { 
    data: attributes, 
    isLoading, 
    isError, 
    error 
  } = useProductAttributes(productId);

  const [selectedAttributes, setSelectedAttributes] = useState<{
    [attributeId: number]: number[]; // attributeId -> array of valueIds
  }>({});

  // Chuyển đổi selectedAttributes thành filters cho API
  const filters = Object.entries(selectedAttributes).flatMap(([attrId, valueIds]) => 
    valueIds.map(valueId => ({
      attributeId: parseInt(attrId),
      valueId: valueId
    }))
  );

  // Gọi API để lấy số sản phẩm tương tự
  const { 
    data: similarData, 
    isLoading: loadingSimilar, 
    isError: similarError,
    refetch: refetchSimilar 
  } = useSimilarProducts({
    filters,
    categoryId: categoryId || 0, // Sử dụng 0 nếu không có categoryId
    excludeProductId: productId,
    enabled: filters.length > 0 && !!categoryId
  });

  // Lấy số lượng sản phẩm tương tự từ API response
  const similarCount = similarData?.data?.count || 0;
  const similarAttributes = similarData?.data?.attributes || [];

  console.log("similarCount", similarCount)

  // Khi selectedAttributes thay đổi, refetch dữ liệu
  useEffect(() => {
    if (filters.length > 0 && categoryId) {
      refetchSimilar();
    }
  }, [filters, categoryId, refetchSimilar]);

  // Loading state
  if (isLoading) {
    return (
      <Card title="Thông số kỹ thuật" className="mt-6">
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card title="Thông số kỹ thuật" className="mt-6">
        <div className="text-center py-4">
          <Text type="secondary">
            {error?.message || "Không thể tải thông tin thuộc tính sản phẩm"}
          </Text>
        </div>
      </Card>
    );
  }

  // No attributes
  if (!attributes || attributes.length === 0) {
    return (
      <Card title="Thông số kỹ thuật" className="mt-6">
        <div className="text-center py-4">
          <Text type="secondary">Sản phẩm chưa có thông tin thông số kỹ thuật</Text>
        </div>
      </Card>
    );
  }

  // Sắp xếp theo position
  const sortedAttributes = [...attributes].sort(
    (a, b) => a.attribute.position - b.attribute.position
  );

  // Xử lý checkbox change
  const handleCheckboxChange = (attributeId: number, valueId: number, checked: boolean) => {
    setSelectedAttributes(prev => {
      const newSelection = { ...prev };
      
      if (checked) {
        // Thêm valueId vào mảng
        if (!newSelection[attributeId]) {
          newSelection[attributeId] = [valueId];
        } else if (!newSelection[attributeId].includes(valueId)) {
          newSelection[attributeId] = [...newSelection[attributeId], valueId];
        }
      } else {
        // Xóa valueId khỏi mảng
        if (newSelection[attributeId]) {
          newSelection[attributeId] = newSelection[attributeId].filter(id => id !== valueId);
          if (newSelection[attributeId].length === 0) {
            delete newSelection[attributeId];
          }
        }
      }
      
      return newSelection;
    });
  };

  // Tính tổng số thuộc tính đã chọn
  const totalSelected = Object.values(selectedAttributes).flat().length;

  return (
    <Card 
      title={
        <div className="flex justify-between items-center">
          <span>Thông số kỹ thuật</span>
          
          {/* Hiển thị số sản phẩm tương tự */}
          <div className="flex items-center gap-2">
            {loadingSimilar && totalSelected > 0 && (
              <span className="text-sm text-gray-500 animate-pulse">
                Đang tìm sản phẩm...
              </span>
            )}
            
            {!loadingSimilar && totalSelected > 0 && similarCount > 0 && (
              <Tooltip title={`Có ${similarCount} sản phẩm có thuộc tính tương tự`}>
                <Button 
                  type="link" 
                  icon={<FilterOutlined />}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <span className="font-medium">{similarCount}</span> sản phẩm tương tự
                </Button>
              </Tooltip>
            )}
            
            {!loadingSimilar && totalSelected > 0 && similarCount === 0 && (
              <span className="text-sm text-gray-500">
                Không tìm thấy sản phẩm tương tự
              </span>
            )}
            
            {similarError && (
              <span className="text-sm text-red-500">
                Lỗi tải dữ liệu
              </span>
            )}
          </div>
        </div>
      }
      className="mt-6"
    >
      <div className="divide-y divide-gray-100">
        {sortedAttributes.map((item: ProductAttribute) => {
          const isAnyValueSelected = item.attribute.values.some(value => 
            selectedAttributes[item.attribute.id]?.includes(value.id)
          );
          
          return (
            <div 
              key={`${item.productId}-${item.attributeId}`}
              className="px-6 py-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="grid grid-cols-12 gap-4 items-start">
                {/* Attribute name */}
                <div className="col-span-4 lg:col-span-3">
                  <Text strong className="text-gray-700">
                    {item.attribute.name}
                  </Text>
                </div>
                
                {/* Attribute values */}
                <div className="col-span-7 lg:col-span-8">
                  <Space wrap>
                    {item.attribute.values.map((value) => {
                      const isSelected = selectedAttributes[item.attribute.id]?.includes(value.id);
                      return (
                        <Tag 
                          key={value.id}
                          color={isSelected ? "blue" : "default"}
                          className={`px-3 py-1 text-sm border ${isSelected 
                            ? 'border-blue-200 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                          } cursor-pointer transition-all`}
                          onClick={() => handleCheckboxChange(
                            item.attribute.id, 
                            value.id, 
                            !isSelected
                          )}
                        >
                          {value.value}
                        </Tag>
                      );
                    })}
                  </Space>
                </div>

                {/* Checkbox ở cuối row */}
                <div className="col-span-1 lg:col-span-1 flex justify-end">
                  <Checkbox
                    checked={isAnyValueSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Chọn tất cả values của attribute này
                        const allValueIds = item.attribute.values.map(v => v.id);
                        setSelectedAttributes(prev => ({
                          ...prev,
                          [item.attribute.id]: allValueIds
                        }));
                      } else {
                        // Bỏ chọn tất cả values của attribute này
                        setSelectedAttributes(prev => {
                          const newSelection = { ...prev };
                          delete newSelection[item.attribute.id];
                          return newSelection;
                        });
                      }
                    }}
                    className="transform scale-125"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary section */}
      {totalSelected > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Text strong className="text-blue-800">
                  Đã chọn {totalSelected} thuộc tính
                </Text>
                {similarCount > 0 && !loadingSimilar && (
                  <span className="text-sm text-green-600 font-medium">
                    • {similarCount} sản phẩm tương tự
                  </span>
                )}
                {similarCount === 0 && !loadingSimilar && totalSelected > 0 && (
                  <span className="text-sm text-gray-500">
                    • Không có sản phẩm tương tự
                  </span>
                )}
              </div>
              
              <div className="text-sm text-blue-600 mt-1">
                {/* Hiển thị các thuộc tính đã chọn */}
                {similarAttributes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {similarAttributes.map((attr: any, index: number) => (
                      <Tag key={index} color="blue">
                        {attr.attributeName}: {attr.valueName}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedAttributes).map(([attrId, valueIds]) => {
                      const attribute = sortedAttributes.find(a => a.attribute.id === parseInt(attrId));
                      if (!attribute) return null;
                      
                      return valueIds.map(valueId => {
                        const value = attribute.attribute.values.find((v: any) => v.id === valueId);
                        if (!value) return null;
                        
                        return (
                          <span key={`${attrId}-${valueId}`} className="inline-block mr-2 mb-1">
                            <Tag color="blue">
                              {attribute.attribute.name}: {value.value}
                            </Tag>
                          </span>
                        );
                      });
                    })}
                  </div>
                )}
              </div>
              
              {/* Hiển thị thông báo loading hoặc error */}
              {loadingSimilar && (
                <div className="mt-2 text-sm text-gray-500">
                  ⏳ Đang tìm kiếm sản phẩm tương tự...
                </div>
              )}
              
              {similarError && (
                <div className="mt-2 text-sm text-red-500">
                  ❌ Lỗi khi tìm sản phẩm tương tự
                </div>
              )}
            </div>
            
            <Button 
              type="primary"
              onClick={() => {
                // Xử lý điều hướng đến trang tìm kiếm sản phẩm
                const searchParams = new URLSearchParams();
                
                // Thêm category
                if (categoryId) {
                  searchParams.append('categoryId', categoryId.toString());
                }
                
                // Thêm các thuộc tính đã chọn
                Object.entries(selectedAttributes).forEach(([attrId, valueIds]) => {
                  valueIds.forEach(valueId => {
                    searchParams.append(`attr_${attrId}`, valueId.toString());
                  });
                });
                
                // Điều hướng đến trang sản phẩm
                window.location.href = `/san-pham?${searchParams.toString()}`;
              }}
              disabled={similarCount === 0 || loadingSimilar}
              loading={loadingSimilar}
            >
              Xem sản phẩm tương tự
            </Button>
          </div>
        </div>
      )}

      {/* Optional: Add note */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 mt-4">
        <div className="flex justify-between items-center">
          <Text type="secondary" className="text-sm">
            * Thông số có thể thay đổi tùy theo từng phiên bản sản phẩm
          </Text>
          
          {totalSelected === 0 && (
            <Text type="secondary" className="text-sm">
              Chọn thuộc tính để xem sản phẩm tương tự
            </Text>
          )}
          
          {totalSelected > 0 && !loadingSimilar && (
            <Text type="secondary" className="text-sm">
              Có {similarCount} sản phẩm cùng danh mục có thuộc tính tương tự
            </Text>
          )}
        </div>
      </div>
    </Card>
  );
}