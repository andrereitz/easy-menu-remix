import { Outlet, useActionData, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { BusinessInfo, MenuItems } from "@/components/dashboard";
import { DashboardData } from "@/types/dashboard";
import { ActionsMenu } from "@/components/dashboard";
import { AddMenuItem, DeleteMenuItem, EditMenuItem } from "~/actions/dashboardActions";
import { Navbar } from "@/components/Navbar";
import { isUserLoggedIn } from "@/lib/utils";

import { ToastContainerConfig } from "@/components/dashboard/ToastContainerConfig";
import { AddCategory } from "~/actions/dashboardCategoriesActions";

export default function dashboard() {
  const loaderData = useLoaderData<DashboardData>();

  return (
    <>
      <Navbar />
      {loaderData.user.id && (
        <BusinessInfo />
      )}
      <MenuItems />
      <ActionsMenu />
      <Outlet />
      <ToastContainerConfig />
    </>
  )
}

export async function loader({request}: LoaderFunctionArgs) {
  let pageData = { user: {}, config: {}} as DashboardData;
  pageData.config.api_url = process.env.API_URL

  try {
    const authorized = await isUserLoggedIn(request)

    if(!authorized) {
      throw authorized;
    }
  } catch(err) {

    return redirect('/logout')
  }

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

    if(categoryReponse.status === 200) {
      const json = await categoryReponse.json();

      pageData.categories = json;

    } else {

      throw categoryReponse;
    }

  } catch(err) {

    throw err
  }

  return pageData
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const action = formData.get('action');

  if (!action) return;

  switch(action) {
    case 'add':
      const add = await AddMenuItem(formData, request);

      return json(add);

    case 'delete':
      const del = await DeleteMenuItem(String(values.id), request);

      return json(del);

    case 'edit':
      const edit = await EditMenuItem(String(values.id), formData, request);

      return json(edit);

    case 'addCategory':
      const addCategory = await AddCategory(formData, request);

      return addCategory

    default:
      return json({ message: 'No action provided', status: 'warning' })
  }
}
