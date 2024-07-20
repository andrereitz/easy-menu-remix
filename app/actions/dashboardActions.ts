export async function AddMenuItem(payload: FormData, request: Request) {
  const cookie = request.headers.get('cookie');
  if(!cookie) throw "Could not get cookie data";

  try {
    
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

      return {
        status: 'success',
        message: json.message
      };
    } else {
      throw resp;
    }

  } catch(err) {
    const text = await (err as Response).text();

    return {
      status: 'error',
      message: text || 'Error Adding new item!'
    }
  }
}

export async function DeleteMenuItem(payload: string, request: Request) {
  const cookie = request.headers.get('cookie');
  if(!cookie) throw "Could not get cookie data";

  try {
    const resp = await fetch(`${process.env.API_URL}/item/delete/${payload}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Cookie: cookie
      }
    })
  
    if(resp.status === 200) {
      const json = await resp.json()

      return {
        status: 'success',
        message: json.message
      };
    } else {
      throw resp;
    }
    
  } catch(err) {
    const text = await (err as Response).text();

    return {
      status: 'error',
      message: text || 'Error Deletting!'
    }
  }
}

export async function EditMenuItem(id: string, payload: FormData, request: Request) {
  const cookie = request.headers.get('cookie');
  if(!cookie) throw "Could not get cookie data";

  try {
    const resp = await fetch(`${process.env.API_URL}/item/edit/${id}`, {
      method: 'POST',
      body: payload,
      credentials: 'include',
      headers: {
        Cookie: cookie
      }
    })

    if(resp.status === 200) {
      const json = await resp.json()

      return {
        status: 'success',
        message: json.message
      };
    } else {
      throw resp;
    }

  } catch(err) {
    const text = await (err as Response).text();

    return {
      status: 'error',
      message: text || 'Error editting!'
    }
  }
}
