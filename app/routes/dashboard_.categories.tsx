import { Link, redirect, useLoaderData } from "@remix-run/react";
import { Logo } from "~/assets/svg";
import { CategoryData } from "@/types/dashboard";
import { Menu } from "@/components/Menu";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Badge } from "@/components/ui/badge";
import { CategoryEdit } from "@/components/dashboard";
import { useState } from "react";
import { EditCategory } from "~/actions/dashboardCategoriesActions";

export default function dashboard() {
  const categories = useLoaderData<CategoryData[]>();
  const [categoryEdit, setCategoryEdit] = useState<CategoryData | null>(null)

  return (
    <>
      <div className="container max-w-[600px]">
        <div className="w-full flex justify-between py-3">
          <Link to="/" className="text-primary-default">
            <Logo className="max-w-" />
          </Link>
          <Menu />
        </div>
      </div>
      <div>
        {categories.map((category: CategoryData) => (
          <Badge key={category.id} onClick={() => setCategoryEdit(category)}>
            {category.title}
          </Badge>
        ))}
      </div>
      <CategoryEdit open={categoryEdit != null} onClose={() => setCategoryEdit(null)} data={categoryEdit} />
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
    case 'edit':
      const edit = await EditCategory(formData, String(values.id), request);

      return json(edit)
    default:
      throw 'No action provided'
  }
}
