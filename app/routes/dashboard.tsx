import { Link, json, useLoaderData } from "@remix-run/react";
import { Logo } from "~/assets/svg";
import { Navbar } from "@/components/Navbar";
import { LoaderFunctionArgs } from "@remix-run/node";

export default function dashboard() {
  const loaderData = useLoaderData();

  console.log(loaderData)

  return (
    <>
      <div className="container max-w-[600px]">
        <div className="w-full flex justify-between py-3">
          <Link to="/" className="text-primary-default">
            <Logo className="max-w-" />
          </Link>
          <Navbar />
        </div>
      </div>
      <div className="w-full py-5 bg-gray-50">
        <div className="container max-w-[980px]">
          menu items and business data
        </div>
      </div>
    </>
  )
}

export async function loader({request}: LoaderFunctionArgs) {
  try {
    const cookie = request.headers.get('cookie');
    if(!cookie) return;

    const resp = await fetch(`${process.env.API_URL}/user`, {
      credentials: 'include',
      mode: 'cors',
      headers: { Cookie: cookie }
    })

    if(resp.status === 200) {
      const json = await resp.json();
      console.log(json)

      return json;

    } else {
      throw resp;
    }


  } catch(err) {
    console.log(err)
  }

  return null
}