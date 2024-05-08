import { ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { Logo } from "~/assets/svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert } from "lucide-react";
import { getToken } from "@/lib/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - Easy Menu" },
  ];
};

export default function Login() {
  // const data = useLoaderData();
  const actionData = useActionData<typeof action>();

  return(
    <div className="container-sm max-w-lg mx-auto p-5 bg-slate-200 mt-10 rounded-md">
      <Link to="/" className="flex justify-center pb-3 text-primary-default">
        <Logo />
      </Link>
      <Form method="POST">
        {actionData?.message && (
          <div className="flex items-center bg-red-500/90 rounded-md text-white p-3 mb-3 mt-5 gap-3 uppercase text-xs">
            <ShieldAlert></ShieldAlert>
            <p>
              {actionData.message}
            </p>
          </div>
        )}
        <Input type="text" placeholder="Email" name="email"></Input>
        <Input type="password" placeholder="Password" name="password"></Input>
        <Button type="submit" size="lg" className="mt-5">Login</Button>
      </Form>
    </div>
  )
}

export function loader({ request }: LoaderFunctionArgs) {
  const token = getToken(request)

  if(token && token.length > 0) {
    return redirect('/dashboard')
  }

  return null
}

export async function action({request}: ActionFunctionArgs): Promise<Response | LoaderFunction>  {
  const formData = await request.formData();
  const bodyData = Object.fromEntries(formData);

  try {
    const resp = await fetch(`${process.env.API_URL}/login`, { 
      method: 'POST',
      body: JSON.stringify(bodyData),
      credentials: 'include'
    })

    if (resp.status == 200) {
      const cookies = resp.headers.get('set-cookie');

      if(!cookies) throw "Response cookie not found";

      return redirect("/dashboard", {
        headers: {
          "Set-Cookie": cookies,
        },
      });

    } else {
      throw resp;
    }

  } catch(err) {
    let message;
    if ((err as Response).text) {
      message = await (err as Response).text();
    } else {
      message = "Error message could not be retrieved";
    }

    return json({
      message
    },{
      status: (err as Response).status,
      statusText: (err as Response).statusText
    })
  }
}