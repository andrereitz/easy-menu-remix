import { MenuItem } from "@/types/dashboard"
import { UserInfo } from "@/types/user"
import { json, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, useParams } from "@remix-run/react"

interface MenuBusinessInfo {
  id: number,
  logo: string,
  name: string,
  color: string
}

interface MenuPageData {
  business: MenuBusinessInfo,
  items: MenuItem[],
  config: Record<string, string | undefined>
}

export default function menu() {
  const loaderData = useLoaderData<MenuPageData>()

  console.log(loaderData)
  return (
    <div>
      <img src={`${loaderData.config.api_url}/${loaderData.business.logo}`} />
      this is menu
      {loaderData.items.length > 0 ? loaderData.items.map((item) => (
        <div>{item.title}</div>
      )) : (
        <div></div>
      )}
    </div>
  )
}

export async function loader({request, params}: LoaderFunctionArgs) {
  let pageData = { config: {}, business: {}, items: []} as unknown as MenuPageData;
  pageData.config.api_url = process.env.API_URL

  try {
    const resp = await fetch(`${process.env.API_URL}/menu/${params.slug}`)

    if(resp.status === 200) {
      const data = await resp.json()
    
      return {...pageData, ...data}
    } else {
      return resp;
    }
  } catch(err) {
    return err;
  }
}