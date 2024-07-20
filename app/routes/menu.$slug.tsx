import { CategoryData, MenuItem } from "@/types/dashboard"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { LoaderFunctionArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

interface MenuBusinessInfo {
  id: number,
  logo: string,
  name: string,
  color: string
}

interface MenuPageData {
  business: MenuBusinessInfo,
  items: MenuItem[],
  categories: CategoryData[],
  config: Record<string, string | undefined>
}

export default function menu() {
  const { business, items, categories, config } = useLoaderData<MenuPageData>()

  return (
    <div>
      <div className="flex justify-center">
        <img src={`${config.api_url}/${business.logo}`} className="max-w-[250px] max-h-[200px] py-3" />
      </div>
      {categories && (
        <nav className="flex justify-center sticky top-0 py-3 backdrop-blur-md bg-white/30 z-10">
          <ul className="flex gap-3">
            {categories.map(category => (
              <Link className="p-3 rounded-md bg-slate-100" to={`#${category.title}`} key={category.id}>{category.title}</Link>
            ))}
          </ul>
        </nav>
      )}
      <div className="container mx-auto max-w-[800px]">
        {categories.map(category => (
          <div key={`section-${category.id}`} id={category.title} className="flex flex-col py-5">
            <h2 className="text-2xl px-3 pb-2">{category.title}</h2>
            <div className="flex flex-col">
              {items.map(item => {
                if (item.category !== category.id) return null;

                return (
                  <div key={item.id} className="flex gap-3 mt-3">
                    <div className="max-w-[200px] w-full">
                      <AspectRatio ratio={4/3} className="px-2 pt-2">
                        <img src={`${config.api_url}/item/image/${item.mediaid}`} className="object-cover w-full h-full rounded-md" />
                      </AspectRatio>
                    </div>
                    <div className="w-full">
                      <div className="flex gap-2 items-center">
                        <h3 className="text-lg capitalize font-bold">{item.title}</h3>
                        <span className="bg-stone-100 flex-1 rounded-full h-[3px] hidden md:block"></span>
                        <span className="ml-auto font-thin text-lg">${item.price}</span>
                      </div>
                      <p className="italic">{item.description}</p>
                    </div>
                  </div>
              )})}
            </div>
          </div>
        ))}
        <div className="flex flex-col py-5">
          <h2 className="text-2xl px-3 pt-5 pb-2" id="others">Others</h2>
          <div className="flex flex-col">
            {items.map(item => {
              if (item.category) return null;

              return(
                <div key={item.id} className="flex gap-3 mt-3">
                  <div className="max-w-[200px] w-full">
                      <AspectRatio ratio={4/3} className="px-2 pt-2">
                        <img src={`${config.api_url}/item/image/${item.mediaid}`} className="object-cover w-full h-full rounded-md" />
                      </AspectRatio>
                    </div>
                    <div className="w-full">
                      <div className="flex gap-2 items-center">
                        <h3 className="text-lg capitalize font-bold">{item.title}</h3>
                        <span className="bg-stone-100 flex-1 rounded-full h-[3px] hidden md:block"></span>
                        <span className="ml-auto font-thin text-lg">${item.price}</span>
                      </div>
                      <p className="italic">{item.description}</p>
                    </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function loader({request, params}: LoaderFunctionArgs) {
  let pageData = { config: {}, business: {}, items: [], categories: []} as unknown as MenuPageData;
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