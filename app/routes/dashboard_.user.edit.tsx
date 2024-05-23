import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserLoaderData } from "@/types/user";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { EditIcon, ImageIcon, SaveIcon, Trash2Icon, X } from "lucide-react";
import { ColorResult, SketchPicker } from "@hello-pangea/color-picker";
import { useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Separator } from "@/components/ui/separator";

export default function EditUser() {
  const { config, data } = useLoaderData<UserLoaderData>()
  const logoInputRef = useRef<HTMLInputElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const [ businessLogoLoading, setBusinessLogoLoading ] = useState<Boolean>(false);
  const [ businessColorChange, setBusinessColorChage ] = useState<string | null>(data.business_color)
  const navigate = useNavigate();

  console.log(config, data)

  async function removeLogo() {
    setBusinessLogoLoading(true);

    try {
      const response = await fetch(`${config.api_url}/user/logo/delete`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors'
      })

    } catch(err) {
      console.log(err)
    } finally {
      setBusinessLogoLoading(false);
      navigate('.', { replace: true })
    }
  }

  async function uploadLogo() {
    if(!logoInputRef.current?.files) return false;
    setBusinessLogoLoading(true);

    const formData = new FormData()
    formData.append('logo', logoInputRef.current?.files[0])

    try{
      const response = await fetch(`${config.api_url}/user/logo/add`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: formData
      })

      if(response.status === 200) {
        const json = await response.json()

        console.log(json)
      } else {
        throw response;
      }
    } catch(err) {
      console.log(err)
    } finally {
      setBusinessLogoLoading(false);
      navigate('.', { replace: true })
    }
  }

  return(
    <>
      <Navbar />
      <div className="container max-w-[600px] flex justify-center mt-5 mb-3">
        {!businessLogoLoading && data.business_logo && (
            <div className="relative max-w-[200px] group">
              <img src={`${config.api_url}/${data.business_logo}`} className="object-contain max-w-[200px]" />
              <Badge
                variant="destructive" 
                className="absolute cursor-pointer top-0 right-0 h-7 w-7 justify-center items-center p-1 opacity-0 group-hover:opacity-100 transition-all"
                onClick={removeLogo}
              >
                <Trash2Icon size={22} />
              </Badge>
            </div>
        )}
        {!businessLogoLoading && !data.business_logo &&(
          <>
            <Button 
              className="flex gap-3"
              onClick={() => logoInputRef.current?.click()}
            >
              <ImageIcon /> Add business logo
            </Button>
            <input ref={logoInputRef} id="logo_input" type="file" style={{ display: "none"}} onChange={uploadLogo} />
          </>
        )}
        {businessLogoLoading && (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
      </div>
      <div className="container max-w-[600px] bg-slate-50 rounded-md py-3 px-8 mt-5">
        <Form method="POST">
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Label htmlFor="business_color" className="w-full">Accent Color</Label>
            <Input 
              name="business_color" 
              id="business_color" 
              ref={colorInputRef} 
              value={businessColorChange || ""}
              style={{ backgroundColor: businessColorChange || 'white' }}
              className="max-w-[150px] m-0"
              readOnly
            />
          <Popover>
            <PopoverTrigger asChild>
              <Button><EditIcon /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-full max-w-[200px] p-0">
              <SketchPicker 
                onChangeComplete={(colors: ColorResult) => setBusinessColorChage(colors.hex)} 
                defaultColor={data.business_color} 
                disableAlpha={true} 
                width="100%"
              />
            </PopoverContent>
          </Popover>
          </div>
          <div className="mt-4">
            <Label htmlFor="business_name">Business Name</Label>
            <Input name="business_name" id="business_name" defaultValue={data.business_name} />
          </div>
          <div className="mt-4">
            <Label htmlFor="business_name">Menu Slug</Label>
            <Input name="business_url" id="business_url" defaultValue={data.business_url} />
          </div>
          <Separator className="mt-5" />
          <div className="mt-4">
            <Label htmlFor="email">Account Email</Label>
            <Input name="email" id="email" type="email" defaultValue={data.email} required />
          </div>
          {/* <div className="mt-4">
            <Label htmlFor="email">New Password</Label>
            <Input name="password" id="password" type="password" />
          </div>
          <div className="mt-4">
            <Label htmlFor="password">New Password Confirmation</Label>
            <Input name="password2" id="password2" type="password" />
          </div> */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" className="mt-5">
              <SaveIcon size={20} className="mr-2" />Save
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}

export async function loader({request}: LoaderFunctionArgs) {
  let pageData = { data: {}, config: {} } as UserLoaderData;
  pageData.config.api_url = process.env.API_URL

  try {
    const cookie = request.headers.get('cookie');
    if(!cookie) return redirect("/");

    const resp = await fetch(`${process.env.API_URL}/user`, {
      credentials: 'include',
      mode: 'cors',
      headers: { Cookie: cookie }
    })

    if(resp.status === 200) {
      const json = await resp.json();
      pageData.data = json

      return pageData

    } else {
      throw resp;
    }

  } catch(err) {
    console.log(err)
    throw err
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const cookie = request.headers.get('cookie');
  if(!cookie) throw "Could not get cookie data";

  try {
    const resp = await fetch(`${process.env.API_URL}/user`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        Cookie: cookie
      }
    })

    if(resp.status !== 200) {
      throw resp;
    }

    return resp;
  } catch(err) {
    console.log(err)
    return err;
  }
}