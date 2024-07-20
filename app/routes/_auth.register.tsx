import { Form, Link, MetaFunction, useActionData } from "@remix-run/react";
import { Logo } from "~/assets/svg";
import { Input } from "@/components/ui/input";
import { ActionFunction, ActionFunctionArgs, json, redirect } from "@remix-run/node";

import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { ToastContainerConfig } from "@/components/shared/ToastContainerConfig";
import { useNotify } from "@/hooks/useNotify";
import { Button } from "@/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Register new account'
    }
  ]
}

const validator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required!" })
      .email("Email must be a valid email"),
    password: z
      .string()
      .min(1, { message: "Password is required!" }),
    confirmPassword: z
      .string()
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Password must match',
      path: ['confirmPassword'],
    })
)

export default function Register() {
  const actionData = useActionData<ActionFunction>();

  useNotify(actionData)

  return (
    <div className="container-sm max-w-lg mx-auto p-5 bg-slate-100 mt-10 rounded-md">
      <Link to="/" className="flex justify-center pb-3 text-primary-default">
        <Logo />
      </Link>
      <h1 className="py-3 text-center text-lg text-slate-700">Create a new account</h1>
      <Form method={'POST'}>
        <Input type="text" placeholder="Email" name="email"></Input>
        <Input type="password" placeholder="Password" name="password"></Input>
        <Input type="password" placeholder="Password Confirmation" name="confirmPassword"></Input>
        {actionData?.error && (
          <div className="bg-red-200 rouded-md px-3 py-2 mt-3">
            <h3 className="text-red-900 mb-2">Errors</h3>
            <ul>
              {actionData.error.map((err: string) => <li className="text-sm">- {err}</li>)}
            </ul>
          </div>
        )}
        <Button type="submit" size="lg" className="mt-5">Register</Button>
      </Form>
      <ToastContainerConfig />
    </div>
  )
}

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();

  const validation = await validator.validate(formData);

  if (validation.error) {
    const errors = Object.values(validation.error.fieldErrors)

    return { error: errors};
  }

  try {
    const resp = await fetch(`${process.env.API_URL}/register`, {
      method: 'POST',
      body: formData,
    })

    if(resp.status === 200) {
      return redirect("/login")
    }

    throw resp;

  } catch(err) {
    let message;
    if ((err as Response).text) {
      message = await (err as Response).text();
    } else {
      message = "Error message could not be retrieved";
    }

    return json({ status: 'error', message: message })
  }
}