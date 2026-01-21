import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This is a basic middleware - in production you'd want more robust auth checking
export function middleware(request: NextRequest) {
  // For now, just allow all requests
  // In production, you'd check authentication status here
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
