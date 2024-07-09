import { redirect, useActionData, useLoaderData } from "@remix-run/react";
import { CategoryData } from "@/types/dashboard";
import { ActionFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { Badge } from "@/components/ui/badge";
import { CategoryEdit, CategoryNew } from "@/components/dashboard";
import { useState } from "react";
import { DeleteCategory, EditCategory, AddCategory } from "~/actions/dashboardCategoriesActions";
import { Navbar } from "@/components/Navbar";
import { useNotify } from "@/hooks/useNotify";
import { ToastContainerConfig } from "@/components/shared/ToastContainerConfig";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";

export default function dashboard() {
  const action = useActionData<ActionFunction>()
  const categories = useLoaderData<CategoryData[]>();
  const [newCategoryOpen, setNewCategoryOpen] = useState<boolean>(false)
  const [categoryEdit, setCategoryEdit] = useState<CategoryData | null>(null)
  
  useNotify(action)

  return (
    <>
      <Navbar />
      <div className="container flex justify-center mt-5">
        <div className="flex gap-2 max-w-[600px] flex-wrap">
          {categories.map((category: CategoryData) => (
            <Badge key={category.id} onClick={() => setCategoryEdit(category)} className="cursor-pointer p-2">
              {category.title}
            </Badge>
          ))}
        </div>
      </div>
      <Button className="rounded-full fixed bottom-4 right-4" size="icon" onClick={() => setNewCategoryOpen(true)}>
        <BookmarkPlus className="h-4 w-4" />
      </Button>
      <CategoryEdit open={categoryEdit != null} onClose={() => setCategoryEdit(null)} data={categoryEdit} />
      <CategoryNew reload={true} open={newCategoryOpen} onClose={() => setNewCategoryOpen(false)} />
      <ToastContainerConfig />
    </>
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const cookie = request.headers.get('cookie');
    if(!cookie) return redirect("/");

    const resp = await fetch(`${process.env.API_URL}/category/all`, {
      credentials: 'include',
      mode: 'cors',
      headers: { Cookie: cookie }
    })

    if(resp.status === 200) {
      const json = await resp.json();

      return json
    } else {
      throw resp;
    }

  } catch(err) {
    console.log(err)
    throw err
  }
}

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const action = formData.get('action');

  switch(action) {
    case 'editCategory':
      const edit = await EditCategory(formData, String(values.id), request);

      return json(edit)
    case 'deleteCategory':
      const del = await DeleteCategory(String(values.id), request);

      return json(del)
    case 'addCategory':
      const add = await AddCategory(formData, request)

      return json(add)
    default:
      return json({ message: 'No action provided', status: 'warning' })
  }
}
