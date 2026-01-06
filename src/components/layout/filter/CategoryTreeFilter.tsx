"use client";

import React, { useState, useEffect } from "react";
import { useCategoryTree } from "@/hooks/category/useCategoryTree";
import { DownOutlined, RightOutlined } from "@ant-design/icons";

interface CategoryTreeFilterProps {
  selectedCategoryId: number | null;
  onCategorySelect: (categoryId: number | null) => void;
  isLoading: boolean;
  loadingCategoryId: number | null;
}

const CategoryTreeFilter: React.FC<CategoryTreeFilterProps> = ({
  selectedCategoryId,
  onCategorySelect,
  isLoading,
  loadingCategoryId,
}) => {
  const { data: categoryTree, isLoading: isTreeLoading } = useCategoryTree();
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // Auto expand when selected
  useEffect(() => {
    if (selectedCategoryId && categoryTree) {
      const findAndExpand = (categories: any[], targetId: number): boolean => {
        for (const category of categories) {
          if (category.id === targetId) return true;
          if (category.children?.length > 0) {
            if (findAndExpand(category.children, targetId)) {
              setExpandedCategories(prev => new Set(prev).add(category.id));
              return true;
            }
          }
        }
        return false;
      };
      
      findAndExpand(categoryTree, selectedCategoryId);
    }
  }, [selectedCategoryId, categoryTree]);

  const toggleExpand = (categoryId: number) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const renderCategory = (category: any, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isSelected = selectedCategoryId === category.id;
    const isExpanded = expandedCategories.has(category.id);
    const isLoadingThis = loadingCategoryId === category.id && isLoading;

    return (
      <div key={category.id} className="w-full">
        <div
          className={`
            flex items-center justify-between
            px-2 py-2 cursor-pointer
            transition-colors rounded
            ${isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : 'hover:bg-gray-50'}
            ${isLoadingThis ? 'opacity-70' : ''}
          `}
          style={{ 
            marginLeft: `${level * 16}px`,
            paddingLeft: level > 0 ? '12px' : '8px'
          }}
          onClick={() => onCategorySelect(category.id)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(category.id);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? <DownOutlined className="text-xs" /> : <RightOutlined className="text-xs" />}
              </button>
            )}
            <span className={`
              text-sm truncate
              ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}
            `}>
              {category.name}
            </span>
            {category._count?.products > 0 && (
              <span className={`
                px-1.5 py-0.5 rounded text-xs
                ${isSelected 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {category._count.products}
              </span>
            )}
          </div>
          {isLoadingThis && (
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {category.children.map((child: any) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isTreeLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="h-8 bg-gray-200 rounded animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (!categoryTree || categoryTree.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        <p className="text-sm">Không có danh mục nào</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-1">
        {categoryTree.map((category: any) => renderCategory(category))}
      </div>
    </div>
  );
};

export default CategoryTreeFilter;