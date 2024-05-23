import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserLoaderData } from "@/types/user";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { EditIcon, ImageIcon, SaveIcon, X } from "lucide-react";
import { ColorResult, SketchPicker } from "@hello-pangea/color-picker";
import { useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function EditUser() {
  const { config, data } = useLoaderData<UserLoaderData>()
  const logoInputRef = useRef<HTMLInputElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const [ businessColorChange, setBusinessColorChage ] = useState<string | null>(data.business_color)

  console.log(config, data)

  async function removeImage() {
    const response = await fetch(`${config.api_url}/user/logo/delete`, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors'
    })

    console.log(response)
  }

  async function uploadLogo() {
    if(!logoInputRef.current?.files) return false;

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
    }
  }

  return(
    <>
      <Navbar />
      <div className="container max-w-[600px] flex justify-center mt-5 mb-3">
        {data.business_logo && (
            <div className="relative max-w-[200px] group">
              <img src={`${config.api_url}/${data.business_logo}`} className="object-contain max-w-[200px]" />
              <Badge
                variant="destructive" 
                className="absolute cursor-pointer top-0 right-0 h-7 w-7 justify-center items-center p-1 opacity-0 group-hover:opacity-100 transition-all"
                onClick={removeImage}
              >
                <X size={22} />
              </Badge>
            </div>
        )}
        {!data.business_logo &&(
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
      </div>
      <div className="container max-w-[600px] bg-slate-50 rounded-md py-3 px-8 mt-5">
        <Form>
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
          <div className="mt-4">
            <Label htmlFor="email">Account Email</Label>
            <Input name="email" id="email" defaultValue={data.email} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="lg" className="mt-5" name="action" value="save">
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