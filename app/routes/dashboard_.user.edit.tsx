import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserLoaderData } from "@/types/user";
import { ActionFunction, ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { EditIcon, ImageIcon, SaveIcon, Trash2Icon, X } from "lucide-react";
import { ColorResult, SketchPicker } from "@hello-pangea/color-picker";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { toast } from "react-toastify";
import { ToastContainerConfig } from "@/components/dashboard/ToastContainerConfig";
import { updateAccount, updateBusiness } from "~/actions/dashboardUserActions";

export default function EditUser() {
  const actionData = useActionData<ActionFunction>()
  const { config, data } = useLoaderData<UserLoaderData>()
  const logoInputRef = useRef<HTMLInputElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const [ businessLogoLoading, setBusinessLogoLoading ] = useState<Boolean>(false);
  const [ businessColorChange, setBusinessColorChage ] = useState<string | null>(data.business_color)
  const navigate = useNavigate();

  useEffect(() => {
    console.log('actiondata', actionData)
    if(actionData && actionData.status == 'error') {
      toast.error(actionData.message)
    }

    if(actionData && actionData.status == 'success') {
      toast.success(actionData.message)
    }
  }, [actionData])

  async function removeLogo() {
    setBusinessLogoLoading(true);

    try {
      const response = await fetch(`${config.api_url}/user/logo/delete`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors'
      })

      if( response.status === 200 ) {
        toast.success('Logo deleted sucessfully!')
      } else {
        throw new Error();
      }

    } catch(err) {
      toast.error('Error deleting logo...')

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
        toast.success('Logo updated!')

      } else {
        throw response;
      }
    } catch(err) {
      toast.error('Error adding logo...')

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
        <Tabs defaultValue="business">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          <TabsContent value="business">
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
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="mt-5"
                  name="action" 
                  value="businessUpdate"
                >
                  <SaveIcon size={20} className="mr-2" />Save
                </Button>
              </div>
            </Form>
          </TabsContent>
          <TabsContent value="account">
            <Form method="POST">
              <div className="mt-4">
                <Label htmlFor="email">Account Email</Label>
                <Input name="email" id="email" type="email" defaultValue={data.email} required />
              </div>
              <div className="mt-4">
                <Label htmlFor="email">New Password</Label>
                <Input name="password" id="password" type="password" />
              </div>
              <div className="mt-4">
                <Label htmlFor="password">New Password Confirmation</Label>
                <Input name="password2" id="password2" type="password" />
              </div>
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="mt-5"
                  name="action" 
                  value="accountUpdate"
                >
                  <SaveIcon size={20} className="mr-2" />Update Account
                </Button>
              </div>
            </Form>
          </TabsContent>
        </Tabs>
        <ToastContainerConfig />
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
  const action = formData.get('action')

  switch(action) {
    case 'accountUpdate':
      const accResp = await updateAccount(formData, request)

      return json(accResp)
    default:
      const busiResp = await updateBusiness(formData, request)

      return json(busiResp)
  }
  
}