import { Edit, Link as LinkIcon } from "lucide-react";
import { PropsWithChildren } from "react";
import { DashboardData, UserInfo } from "../../types/dashboard";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "../ui/button";
import { loader } from "~/routes/_auth.login";

export default function BusinessInfo() {
  const loaderData = useLoaderData<DashboardData>();
  const {
    email,
    business_color,
    business_logo,
    business_name, 
    business_url,
    business_qr
  } = loaderData && loaderData.user;

  return (
    <div className="w-full py-8 bg-slate-50">
      <div className="container max-w-[980px] flex flex-col md:flex-row">
        <div className="flex-1 flex flex-col items-start">
          <h1 className="flex items-center gap-3 font-bold text-xl" style={{ color: business_color }}>
            <span className="w-6 h-6 block rounded-md" style={{ backgroundColor: business_color }}></span>
            {business_name}
          </h1>
          {business_logo && (
            <BusinessInfoItem>
              <img className="max-w-[200px] mt-4" src={business_logo} />
            </BusinessInfoItem>
          )}
          <BusinessInfoItem title="account email">
            {email}
          </BusinessInfoItem>
          <Button className="mt-4 gap-3" variant="outline">
            <Edit size={18} />
            Edit Information
          </Button>
        </div>
        <div className="flex-1 flex pt-6 md:pt-0 md:justify-end flex-wrap">
          {business_qr && (
            <>
              <Link to={business_qr} target="_blank">
                <img className="w-full max-w-[170px] rounded-md" src={business_qr} />
              </Link>
              <Link to={`/menu/${business_url}`} className="w-full flex md:justify-end items-center gap-3 mt-3 text-xs"><LinkIcon size={16} />/menu/{business_url}</Link>
            </>
          )}
        </div>
        <div>
        </div>
      </div>
    </div>
  )
}

interface BusinessInfoItemInterface extends PropsWithChildren {
  title?: string,
}

function BusinessInfoItem({
  title,
  children
} : BusinessInfoItemInterface ) {
  return(
    <div>
      {title && (
        <h2 className="text-xs uppercase mt-4 mb-1">{title}</h2>
      )}
      {children}
    </div>
  )
}