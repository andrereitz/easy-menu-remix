import { LoaderFunctionArgs, redirect } from "@remix-run/node"

export default function Logout() {
  return(
    <div>Logging you out...</div>
  )
}

export async function loader(data: LoaderFunctionArgs) {
  try {
    const cookie = data.request.headers.get('cookie');
    if(!cookie) throw "Could not get cookie data";

    const response = await fetch(`${process.env.API_URL}/logout`, {
      mode: 'cors',
      credentials: 'include',
      method: 'POST',
      headers: { Cookie: cookie }
    })
    
    if (response.status == 200) {
      const cookies = response.headers.get('set-cookie');

      if(!cookies) throw "Response cookie not found"

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
