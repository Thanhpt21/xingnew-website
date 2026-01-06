// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

function getPublicUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_APP_URL!
  }
  return 'http://localhost:3000'
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // 🔴 TẠMP THỜI DISABLE MIDDLEWARE CHECK - VÀO ADMIN TRƯỚC
  return NextResponse.next()

  // TODO: Bật lại sau khi debug xong
  /*
  const token = req.cookies.get('access_token')?.value

  // 🔹 Nếu chưa đăng nhập → chuyển về /login
  if (!token) {
    const loginUrl = new URL('/login', getPublicUrl())
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    // Gọi API để lấy thông tin user hiện tại
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/current`,
      {
        signal: controller.signal,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }
    )

    clearTimeout(timeout)

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Kiểm tra user có role admin hay không
    // Hỗ trợ cả hai format: single role string hoặc array of roles
    const userRole = data.data?.role
    let hasAdminRole = false

    if (Array.isArray(userRole)) {
      // Nếu role là array
      hasAdminRole = userRole.some((role: string) => 
        role.toLowerCase() === 'admin'
      )
    } else if (typeof userRole === 'string') {
      // Nếu role là single string
      hasAdminRole = userRole.toLowerCase() === 'admin'
    }
    
    if (!hasAdminRole) {
      console.log('User does not have admin role:', userRole)
      return NextResponse.redirect(new URL('/403', getPublicUrl()))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('❌ Middleware error:', error)
    const loginUrl = new URL('/login', getPublicUrl())
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }
  */
}

export const config = {
  matcher: ['/admin/:path*'],
}