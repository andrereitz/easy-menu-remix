export async function updateBusiness(formData: FormData, request: Request) {
  const cookie = request.headers.get('cookie');
  if(!cookie) throw "Could not get cookie data";

  try {
    const resp = await fetch(`${process.env.API_URL}/user/edit/business`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        Cookie: cookie
      }
    })

    if(resp.status !== 200) {
      throw resp;
    }

    return { status: 'success', message: 'Business data updated' };

  } catch(err) {
    console.log(err)
    return { status: 'error', message: 'Failed to update business data!' };
  }
}

export async function updateAccount(formData: FormData, request: Request) {
  const password = formData.get('password')
  const passwordConfirmation = formData.get('password2')

  if(password != passwordConfirmation) {
    return {
      status: 'error',
      message: 'Password mismatch!'
    }
  }

  const cookie = request.headers.get('cookie');
  if(!cookie) throw "Could not get cookie data";

  try {
    const resp = await fetch(`${process.env.API_URL}/user/edit/account`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        Cookie: cookie
      }
    })

    if(resp.status !== 200) {
      throw resp;
    }

    return { status: 'success', message: 'Account data updated!' }

  } catch(err) {
    
    return { status: 'error', message: 'Updated failed!' }
  }
}