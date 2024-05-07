import { redirect } from "@remix-run/node"

export default function Logout() {
  return(
    <>
      <div>Logging you out...</div>
      <form method="post">
        <button type="submit">Logout</button>
      </form>
    </>
  )
}

export async function loader(data: any) {
  try {
    console.log(process.env.API_URL)
    const response = await fetch(`${process.env.API_URL}/logout`, {
      mode: 'cors',
      credentials: 'include',
      method: 'POST',
      headers: { Cookie: data.request.headers.get('cookie') }
    })

    console.log('### loader data', data.request.headers.get('cookie'))
    
    if (response.status == 200) {
      const cookies = response.headers.get('set-cookie');
      console.log('### request cookies', cookies)

      if(!cookies) throw "No Cookie Found"

      return redirect("/", {
        headers: {
          "Set-Cookie": cookies,
        },
      });

    } else {
      throw response;
    }
  } catch(err) {
    console.log(err)
  }

  return null
}

export async function action() {
  try {
    console.log(process.env.API_URL)
    const response = await fetch(`${process.env.API_URL}/user`, {
      credentials: 'include',
      method: 'POST'
    })
    

    console.log(await response.headers)
    console.log(await response.text())
  } catch(err) {
    console.log(err)
  }

  return null
}