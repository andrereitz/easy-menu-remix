import { DashboardData, MenuItem } from "@/types/dashboard";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { Edit2, Tag, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteAlert } from "./DeleteItemAlert";

export default function MenuItems() {
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ items, setItems ] = useState<MenuItem[]>([]);
  const { config, categories } = useLoaderData<DashboardData>();
  const navigate = useNavigate()

  async function loadMenuItems() {
    try {
      const resp = await fetch(`${config.api_url}/item/all`, {
        mode: 'cors',
        credentials: 'include',
        method: 'GET',
      })
  
      if(resp.status === 200) {
        const json = await resp.json();
        setItems(json)
      } else {
        throw resp
      }
    } catch(err) {
      console.log('menu items error', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadMenuItems();
  }, [config])

  return(
    <div className="container py-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 p-4 gap-4">
      {loading && 'Loading...'}
      {!loading && items.length ? (
        items.map((item: MenuItem) => (
          <div key={item.id} className="flex flex-col rounded-md bg-slate-100">
            {item.mediaid ? (
              <AspectRatio ratio={16/9} className="px-2 pt-2">
                <img src={`${config.api_url}/item/image/${item.mediaid}`} className="object-fill w-full h-full rounded-md" />
              </AspectRatio>
            ) : (
              <AspectRatio ratio={16/9} className="bg-muted"></AspectRatio>
            )}
            <h3 className="mx-2 mt-2 mb-0 text-lg font-bold text-slate-700">
              {item.title}
            </h3>
            {item.category && (
              <h4 className="mx-2 mt-0 mb-0 uppercase text-xs text-slate-500 flex gap-2 items-center">
                <Tag size={14} />
                {categories && categories.find(category => category.id === item.category)?.title}
              </h4>
            )}
            <p className="m-2 text-slate-700">
              {item.description}
            </p>
            <div className="flex gap-1 justify-end mt-auto items-center text-slate-600">
              <span className="ml-2 mr-auto font-semibold">
                ${item.price.toFixed(2)}
              </span>
              <Button variant="ghost" size="icon"><Edit2 size={18} /></Button>
              <DeleteAlert id={item.id} />
            </div>
          </div>
        )
      )) : (
        'Error fetching menu items'
      )}
    </div>
  )
}
