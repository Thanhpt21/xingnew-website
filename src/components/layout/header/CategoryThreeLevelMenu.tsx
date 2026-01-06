"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { useCategoryTree } from "@/hooks/category/useCategoryTree";

interface CategoryTreeItem {
  id: number;
  name: string;
  slug: string;
  thumb?: string;
  level: number;
  children?: CategoryTreeItem[];
  _count: {
    products: number;
    children: number;
  };
}

interface CategoryThreeLevelMenuProps {
  onItemClick?: () => void;
  isMobile?: boolean;
}

export const CategoryThreeLevelMenu = ({
  onItemClick,
  isMobile = false,
}: CategoryThreeLevelMenuProps) => {
  const router = useRouter();
  const { data: categoryTree, isLoading } = useCategoryTree();
  
  const menuRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [hoveredLevel1, setHoveredLevel1] = useState<number | null>(null);
  const [selectedLevel2, setSelectedLevel2] = useState<number | null>(null);

  const level1Categories = useMemo(() => {
    if (!categoryTree) return [];
    return categoryTree.filter((cat: CategoryTreeItem) => cat.level === 1);
  }, [categoryTree]);

  // Auto select first category on load
  useEffect(() => {
    if (level1Categories.length > 0 && !hoveredLevel1) {
      setHoveredLevel1(level1Categories[0].id);
    }
  }, [level1Categories]);

  const level2Categories = useMemo(() => {
    if (!hoveredLevel1 || !categoryTree) return [];
    const level1Cat = categoryTree.find((cat: CategoryTreeItem) => cat.id === hoveredLevel1);
    return level1Cat?.children?.filter((child: CategoryTreeItem) => child.level === 2) || [];
  }, [hoveredLevel1, categoryTree]);

  const level3Categories = useMemo(() => {
    if (!selectedLevel2 || !categoryTree || !hoveredLevel1) return [];
    const level1Cat = categoryTree.find((cat: CategoryTreeItem) => cat.id === hoveredLevel1);
    const level2Cat = level1Cat?.children?.find((child: CategoryTreeItem) => child.id === selectedLevel2);
    return level2Cat?.children?.filter((child: CategoryTreeItem) => child.level === 3) || [];
  }, [hoveredLevel1, selectedLevel2, categoryTree]);

  const getSelectedLevel2Name = () => {
    if (!selectedLevel2) return "";
    const cat = level2Categories.find((c: CategoryTreeItem) => c.id === selectedLevel2);
    return cat?.name || "";
  };

  const handleLevel1Click = (categoryId: number) => {
    handleCategoryClick(categoryId);
  };

  const handleLevel1Hover = (categoryId: number) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setHoveredLevel1(categoryId);
    setSelectedLevel2(null);
  };

  const handleLevel2Click = (categoryId: number) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    
    const level2Cat = level2Categories.find((cat: CategoryTreeItem) => cat.id === categoryId);
    if (level2Cat?.children && level2Cat.children.length > 0) {
      setSelectedLevel2(categoryId);
    } else {
      handleCategoryClick(categoryId);
    }
  };

  const handleBackToLevel2 = () => {
    setSelectedLevel2(null);
  };

  const handleMenuLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    
    hoverTimerRef.current = setTimeout(() => {
      setHoveredLevel1(null);
      setSelectedLevel2(null);
    }, 150);
  };

  const handleCategoryClick = (categoryId: number) => {
    const params = new URLSearchParams();
    params.set('categoryId', categoryId.toString());
    params.delete('search');
    params.delete('brandId');
    params.delete('hasPromotion');
    params.delete('isFeatured');
    params.delete('page');
    
    router.push(`/san-pham?${params.toString()}`);
    
    // Đóng menu và reset state
    setHoveredLevel1(null);
    setSelectedLevel2(null);
    
    if (onItemClick) {
      onItemClick();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0B3A8F]"></div>
      </div>
    );
  }

  if (!categoryTree || level1Categories.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Không có danh mục nào
      </div>
    );
  }

  return (
    <div 
      ref={menuRef}
      className="flex bg-white shadow-lg border border-gray-200"
      onMouseLeave={handleMenuLeave}
      style={{ minHeight: '500px', width: '900px' }}
    >
      {/* Cột trái 30%: Danh mục cấp 1 */}
      <div 
        className="border-r border-gray-200 bg-gray-50"
        style={{ width: '30%', flexShrink: 0 }}
      >
        <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
          {level1Categories.map((category: CategoryTreeItem) => (
            <div
              key={category.id}
              onMouseEnter={() => handleLevel1Hover(category.id)}
              onClick={() => handleLevel1Click(category.id)}
              className={`flex items-center justify-between px-5 py-3 cursor-pointer transition-colors border-b border-gray-100 group ${
                hoveredLevel1 === category.id
                  ? 'text-[#0B3A8F] font-semibold'
                  : 'text-gray-700 hover:text-[#0B3A8F]'
              }`}
            >
              <span className="text-sm font-medium">{category.name}</span>
              {category.children && category.children.length > 0 && (
                <RightOutlined className={`text-xs transition-colors ${
                  hoveredLevel1 === category.id 
                    ? 'text-[#0B3A8F]' 
                    : 'text-gray-400 group-hover:text-[#0B3A8F]'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cột phải 70%: Menu cấp 2 hoặc cấp 3 */}
      <div 
        className="bg-white"
        style={{ width: '70%', flexShrink: 0 }}
        onMouseEnter={() => {
          if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
          }
        }}
      >
        {!hoveredLevel1 ? (
          // Trạng thái mặc định
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center px-8">
              <div className="text-4xl mb-3">🏷️</div>
              <p className="text-sm font-medium mb-1">Chọn danh mục sản phẩm</p>
              <p className="text-xs">Di chuột qua danh mục bên trái để xem chi tiết</p>
            </div>
          </div>
        ) : !selectedLevel2 ? (
          // Hiển thị menu cấp 2
          <div className="h-full flex flex-col">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-sm">
                {level1Categories.find((c: CategoryTreeItem) => c.id === hoveredLevel1)?.name}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {level2Categories.length > 0 ? (
                <div>
                  {level2Categories.map((level2Cat: CategoryTreeItem) => (
                    <div
                      key={level2Cat.id}
                      onClick={() => handleLevel2Click(level2Cat.id)}
                      className="flex items-center justify-between px-5 py-3 cursor-pointer transition-colors border-b border-gray-100 hover:text-[#0B3A8F]"
                    >
                      <span className="text-sm font-medium">
                        {level2Cat.name}
                        {level2Cat._count?.products > 0 && (
                          <span className="text-gray-500"> ({level2Cat._count.products})</span>
                        )}
                      </span>
                      {level2Cat.children && level2Cat.children.length > 0 && (
                        <RightOutlined className="text-xs" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <p className="text-sm mb-3">Không có danh mục con</p>
                    <button
                      onClick={() => handleCategoryClick(hoveredLevel1)}
                      className="px-4 py-2 text-sm bg-[#0B3A8F] text-white rounded-md hover:bg-[#0A3175] transition-colors"
                    >
                      Xem tất cả sản phẩm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Hiển thị menu cấp 3
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-sm">
                {getSelectedLevel2Name()}
              </h3>
              <button
                onClick={handleBackToLevel2}
                className="text-[#0B3A8F] hover:text-[#0A3175] flex items-center gap-1 text-sm font-medium"
              >
                <LeftOutlined className="text-xs" />
                Quay lại
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {level3Categories.length > 0 ? (
                <div>
                  {level3Categories.map((level3Cat: CategoryTreeItem) => (
                    <div
                      key={level3Cat.id}
                      onClick={() => handleCategoryClick(level3Cat.id)}
                      className="flex items-center justify-between px-5 py-3 cursor-pointer transition-colors border-b border-gray-100 hover:text-[#0B3A8F]"
                    >
                      <span className="text-sm font-medium">
                        {level3Cat.name}
                        {level3Cat._count?.products > 0 && (
                          <span className="text-gray-500"> ({level3Cat._count.products})</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <p className="text-sm mb-3">Không có danh mục con</p>
                    <button
                      onClick={() => handleCategoryClick(selectedLevel2)}
                      className="px-4 py-2 text-sm bg-[#0B3A8F] text-white rounded-md hover:bg-[#0A3175] transition-colors"
                    >
                      Xem tất cả sản phẩm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};