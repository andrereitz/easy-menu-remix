import { MetaFunction, TypedResponse, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { Logo } from "~/assets/svg";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - Easy Menu" },
  ];
};

const formSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid email address"
  }),
  password: z.string().min(3, {
    message: "Password must have at least 3 characters"
  })
})

export default function Login() {
  const data = useLoaderData();
  const actionData = useActionData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    try {
      const response = await fetch(`${process.env.API_URL}/login`, { 
        method: 'POST',
        body: JSON.stringify(values)
      })

      if (response.status != 200) {
        throw response;
      }
      const json = await response.json();

      console.log('### response json', json)
    } catch(err) {
      const errorText = await (err as Response).text();

      console.log(errorText)
    }
  }

  return(
    <div className="container-sm max-w-xl mx-auto">
      <Link to="/" className="flex justify-center py-3 text-primary-default">
        <Logo />
      </Link>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export async function loader(data: any){
  console.log(data)

  return { error: "some error" }
}

export async function action(data: any): Promise<{ error: string; } | TypedResponse>  {
  const formData = await data.request.formData();
  const bodyData = Object.fromEntries(formData);

  try {
    const response = await fetch(`${process.env.API_URL}/login`, { 
      method: 'POST',
      body: JSON.stringify(bodyData),
      credentials: 'include'
    })

    if (response.status == 200) {
      const cookies = response.headers.get('set-cookie');

      if(!cookies) throw "No Cookie Found"

      return redirect("/", {
        headers: {
          "Set-Cookie": cookies,
        },
      });

    } else {
      throw response;
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