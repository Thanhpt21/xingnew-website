'use client';

import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setSearchValue(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = () => {
    const value = searchValue.trim();
    if (value) {
      router.push(`/san-pham?search=${encodeURIComponent(value)}`);
    } else {
      router.push('/san-pham');
    }
  };

  const handleClear = () => {
    setSearchValue('');
    router.push('/san-pham');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="
        flex items-center
        bg-white
        border border-gray-300
        rounded-full
        px-4
        h-11
        shadow-sm
        hover:shadow
        transition-all duration-200
        focus-within:border-gray-500
        focus-within:ring-4
        focus-within:ring-gray-200/30
      ">
        {/* ICON SEARCH */}
        <SearchOutlined className="text-gray-500 text-lg flex-shrink-0" />

        {/* INPUT */}
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Tìm kiếm giấy in nhiệt, băng keo, mã vạch..."
          className="
            flex-1
            bg-transparent
            outline-none
            text-sm
            text-gray-800
            placeholder-gray-500
            px-3
          "
        />

        {/* CLEAR BUTTON - chỉ hiện khi có nội dung */}
        {searchValue && (
          <button
            onClick={handleClear}
            className="
              flex-shrink-0
              p-1.5
              rounded-full
              bg-gray-200
              text-gray-600
              hover:bg-gray-300
              hover:text-gray-800
              transition-all duration-150
            "
            aria-label="Xóa tìm kiếm"
          >
            <CloseOutlined className="text-xs" />
          </button>
        )}

        {/* SEARCH BUTTON - nhỏ gọn, tone xám bạc */}
        <button
          onClick={handleSearch}
          className="
            flex-shrink-0
            ml-2
            px-5
            h-9
            rounded-full
            bg-gray-800
            text-white
            font-medium
            text-sm
            hover:bg-gray-900
            active:bg-gray-700
            transition-all duration-200
            flex items-center justify-center
          "
          aria-label="Tìm kiếm"
        >
          Tìm
        </button>
      </div>
    </div>
  );
};

export default SearchBar;