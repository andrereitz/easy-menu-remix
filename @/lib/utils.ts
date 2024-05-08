import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getToken(request: Request) {
  const cookies = request.headers.get('cookie');
  const token = cookies?.split(';').filter(cookie => cookie.startsWith('jwt-token'))

  return token;
}