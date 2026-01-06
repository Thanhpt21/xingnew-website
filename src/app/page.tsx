'use client'
import { Banner } from "@/components/layout/home"
import {FlashDeals} from "@/components/layout/home"
import {TopCategories} from "@/components/layout/home"
import {ProductList} from "@/components/layout/home"

import {BrandList} from "@/components/layout/home"
import BlogHome from "@/components/layout/home/BlogHome"
import HomeCategorySections from "@/components/layout/home/HomeCategorySections"
import HomeFeatures from "@/components/layout/home/HomeFeatures"


export default function Page() {
  return (
    <main className="flex flex-col bg-gray-50">
      <Banner />
      <HomeFeatures />
      <HomeCategorySections />
    </main>
  )
}