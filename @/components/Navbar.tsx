import { Link } from "@remix-run/react";
import { Menu } from "./Menu";
import { Logo } from "~/assets/svg";

export function Navbar() {
  return(
    <div className="container max-w-[600px]">
      <div className="w-full flex justify-center items-center  py-3">
        <span className="mr-auto"></span>
        <Link to="/dashboard" className="text-primary-default">
          <Logo className="max-w-" />
        </Link>
        <div className="ml-auto">
          <Menu />
        </div>
      </div>
    </div>
  )
}