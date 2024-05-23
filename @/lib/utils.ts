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

export async function isUserLoggedIn(request: Request): Promise<Boolean> {
  const token = getToken(request);
  if(!token) return new Promise((_, rej) => rej(false));

  const cookies = request.headers.get('cookie');
  if(!cookies) return new Promise((_, rej) => rej(false))

  const response = await fetch(`${process.env.API_URL}/authorize`, {
    mode: 'cors',
    credentials: 'include',
    method: 'GET',
    headers: { Cookie: cookies }
  })

  return response.status === 200
}