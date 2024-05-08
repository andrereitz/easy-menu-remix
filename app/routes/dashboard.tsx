import { Link, Outlet } from "@remix-run/react";
import { Logo } from "~/assets/svg";
import { Navbar } from "@/components/Navbar";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { BusinessInfo, MenuItems } from "@/components/dashboard";
import { DashboardData } from "@/types/dashboard";

export default function dashboard() {
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
      <BusinessInfo />
      <MenuItems />
      <Outlet />
    </>
  )
}

export async function loader({request}: LoaderFunctionArgs) {
  let pageData = { user: {}, config: {}} as DashboardData;
  pageData.config.api_url = process.env.API_URL

  try {
    const cookie = request.headers.get('cookie');
    if(!cookie) return redirect("/");

    const resp = await fetch(`${process.env.API_URL}/user`, {
      credentials: 'include',
      mode: 'cors',
      headers: { Cookie: cookie }
    })

    if(resp.status === 200) {
      const json = await resp.json();

      json.business_logo = `${process.env.API_URL}/${json.business_logo}`;
      json.business_qr = json.business_url ? `${process.env.API_URL}/static/qrcodes/${json.id}.png` : null;
      pageData.user = json

    } else {
      throw resp;
    }

    const categoryReponse = await fetch(`${process.env.API_URL}/category/all`, {
      credentials: 'include',
      mode: 'cors',
      headers: { Cookie: cookie }
    })

    if(resp.status === 200) {
      const json = await categoryReponse.json();

      pageData.categories = json
    } else {
      throw resp;
    }

  } catch(err) {
    console.log(err)
  }

  return pageData
}