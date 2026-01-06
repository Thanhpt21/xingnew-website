"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useConfigs } from "@/hooks/config/useConfigs";

interface Slide {
  id: number;
  img: string;
  clickable: boolean;
}

export default function Banner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const moved = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

    // ✅ GỌI API CONFIG
    const {
      data: configs,
      isLoading,
      isError,
    } = useConfigs({ page: 1, limit: 1 });
  
    // ✅ LẤY PHẦN TỬ ĐẦU TIÊN
    const configData = configs?.data?.[0];

  // Lấy banner từ config
  const slides: Slide[] =
    configData?.banner?.map((url: string, idx: number) => ({
      id: idx + 1,
      img: url,
      clickable: true,
    })) || [];

  // Preload images
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.img;
    });
  }, [slides]);

  // ⚙️ Hàm tự chạy
  const startAutoPlay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % Math.max(slides.length, 1));
    }, 4000);
  };

  // ⏸️ Dừng chạy
  const stopAutoPlay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Điều khiển autoplay - không chờ hydration
  useEffect(() => {
    if (slides.length === 0) return;
    if (!paused && !dragging) startAutoPlay();
    else stopAutoPlay();
    return stopAutoPlay;
  }, [paused, dragging, slides.length]);

  // 🖱️ Xử lý kéo slide
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    startX.current = e.clientX;
    moved.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const diff = e.clientX - startX.current;
    if (Math.abs(diff) > 10) moved.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragging || slides.length === 0) return;
    const diff = e.clientX - startX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setIndex((i) => (i - 1 + slides.length) % slides.length);
      else setIndex((i) => (i + 1) % slides.length);
    }
    setDragging(false);
  };

  // 🖱️ Click slide → sang trang /san-pham
  const handleClick = (slide: Slide) => {
    if (moved.current || !slide.clickable) return;
    router.push("/san-pham");
  };

  // Loading state
  // Chỉnh sửa Skeleton: Mobile dùng aspect-video để giữ chỗ tương đối
  if (isLoading || isError || !configData || slides.length === 0) {
    return (
      <div className="w-full aspect-video sm:aspect-auto sm:h-[350px] md:h-[500px] bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
    );
  }

  return (
    <section
      className="w-full -mt-px"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ✅ CANH GIỐNG NAVBAR */}
      <div className="max-w-7xl mx-auto">
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* SLIDES */}
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((s) => (
              <div
                key={s.id}
                className={`w-full flex-shrink-0 flex items-center justify-center ${
                  s.clickable ? "cursor-pointer" : "cursor-default"
                }`}
                onClick={() => handleClick(s)}
              >
                <img
                  src={s.img}
                  alt={`Slide ${s.id}`}
                  className="
                    w-full h-full
                    object-contain
                  "
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            ))}
          </div>

          {/* LEFT BUTTON */}
          {/* <button
            onClick={() => {
              stopAutoPlay();
              setIndex((i) => (i - 1 + slides.length) % slides.length);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2
                      bg-black/40 hover:bg-black/70 text-white
                      rounded-full p-2 md:p-3 z-10 text-xl"
          >
            ‹
          </button> */}

          {/* RIGHT BUTTON */}
          {/* <button
            onClick={() => {
              stopAutoPlay();
              setIndex((i) => (i + 1) % slides.length);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2
                      bg-black/40 hover:bg-black/70 text-white
                      rounded-full p-2 md:p-3 z-10 text-xl"
          >
            ›
          </button> */}

          {/* DOTS */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2
                          hidden md:flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  stopAutoPlay();
                  setIndex(i);
                }}
                className={`h-[6px] rounded-full transition-all ${
                  i === index
                    ? "w-[14px] bg-white"
                    : "w-[6px] bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}