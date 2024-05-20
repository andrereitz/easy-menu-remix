export async function EditCategory(payload: FormData, id: string, request: Request) {
  const cookie = request.headers.get('cookie');
  if(!cookie) throw "Could not get cookie data";

  try {
    const resp = await fetch(`${process.env.API_URL}/category/edit/${id}`, {
      method: 'POST',
      credentials: 'include',
      body: payload as unknown as FormData,
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

export async function DeleteCategory(id: string, request: Request) {
  const cookie = request.headers.get('cookie');
  if(!cookie) throw "Could not get cookie data";

  try {
    const resp = await fetch(`${process.env.API_URL}/category/delete/${id}`, {
      mode: 'cors',
      credentials: 'include',
      method: 'POST',
      headers: {
        Cookie: cookie
      }
    })

    if(resp.status === 200) {
      const json = await resp.json()

      console.log(json)
      return json;
    } else {
      throw resp;
    }
    
  } catch(err) {
    console.log(err)
  }
}