import { Link } from "@remix-run/react";
import { Menu } from "./Menu";
import { Logo } from "~/assets/svg";

export function Navbar() {
  return(
    <div className="container max-w-[600px]">
      <div className="w-full flex justify-between items-center  py-3">
        <Link to="/" className="text-primary-default">
          <Logo className="max-w-" />
        </Link>
        <Menu />
      </div>
    </div>
  )
}