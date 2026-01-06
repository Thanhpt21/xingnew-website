'use client';

import { SearchOutlined } from '@ant-design/icons';
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

  return (
    <div className="w-full max-w-2xl">
      <div className="
        flex items-center
        bg-white
        border border-gray-300
        rounded-full
        px-4
        h-12
        shadow-sm
        transition
        focus-within:border-indigo-500
        focus-within:ring-2
        focus-within:ring-indigo-200
      ">
        {/* ICON SEARCH */}
        <SearchOutlined className="text-indigo-600 text-lg mr-3" />

        {/* INPUT */}
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Tìm kiếm sản phẩm..."
          className="
            flex-1
            bg-transparent
            outline-none
            text-sm
            text-gray-800
            placeholder-gray-400
          "
        />

        {/* CLEAR */}
        {searchValue && (
          <button
            onClick={() => {
              setSearchValue('');
              router.push('/san-pham');
            }}
            className="
              mr-2
              w-5 h-5
              flex items-center justify-center
              rounded-full
              bg-gray-200
              text-gray-600
              text-xs
              hover:bg-indigo-500 hover:text-white
              transition
            "
          >
            ✕
          </button>
        )}

        {/* BUTTON SEARCH */}
        <button
          onClick={handleSearch}
          className="
            h-9
            px-5
            rounded-full
            bg-indigo-600
            text-white
            font-medium
            flex items-center gap-2
            hover:bg-indigo-700
            transition
          "
        >
          <SearchOutlined />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
