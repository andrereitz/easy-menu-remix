import type { MetaFunction, } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "@/components/ui/button";

import { Logo } from '../assets/svg'

export const meta: MetaFunction = () => {
  return [
    { title: "Easy Menu" },
    { name: "description", content: "Easily create your business menu!" },
  ];
};

export default function Index() {

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div className="text-primary-default w-full flex justify-center py-6">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div>
        <div className="px-3 md:container md:mx-auto max-w-2xl py-20 md:text-center">
          <h1 className="text-primary-default font-bold text-3xl">Easily create your business menu</h1>
          <p className="pt-3 pb-5">With easy menu you can better server your clients with a custom digital menu. Create your account, add your menu items, generate a qr code and you are done.</p>
          <div className="pt-4 flex md:justify-center">
            <Button variant="default" className="mr-3" size="lg">Register</Button>
            <Button onClick={() => window.location.href = "/login" } variant="outline" size="lg">Login</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

