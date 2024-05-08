export interface NewMenuItemPayload {
  title: string,
  description?: string,
  price: number,
  category?: number
}

export async function AddMenuItem(payload: FormData, request: Request) {
  const cookie = request.headers.get('cookie');

  try {
    if(!cookie) throw "Could not get cookie data";
    
    const resp = await fetch(`${process.env.API_URL}/item/new`, {
      method: 'POST',
      credentials: 'include',
      body: payload,
      headers: {
        Cookie: cookie
      }
    })
  
    if(resp.status === 200) {
      const json = await resp.json()

      return json;
    } else {
      throw resp;
    }
  } catch(err) {
    const text = await (err as Response).text();

    return {
      message: text,
      status: 'danger'
    }
  }
}

export async function DeleteMenuItem(payload: string, request: Request) {
  const cookie = request.headers.get('cookie');

  try {
    if(!cookie) throw "Could not get cookie data";

    const resp = await fetch(`${process.env.API_URL}/item/delete/${payload}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Cookie: cookie
      }
    })
  
    if(resp.status === 200) {
      const json = await resp.json()

      return json;
    } else {
      throw resp;
    }
  } catch(err) {
    const text = await (err as Response).text();

    return {
      message: text,
      status: 'danger'
    }
  }
}