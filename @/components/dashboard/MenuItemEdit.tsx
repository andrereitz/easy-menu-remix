import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DashboardData, MenuItem } from "@/types/dashboard";
import { Form, useLoaderData } from "@remix-run/react";
import { Delete, ListEnd, Trash2Icon } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LoadingSpinner } from "../LoadingSpinner";

export default function({
  open,
  onClose,
  data
} : {
  open: boolean,
  onClose: () => void,
  data: MenuItem
}) {
  const { categories, config } = useLoaderData<DashboardData>();
  const [ editCategory, setEditCategory ] = useState<boolean>(false);
  const [ imageLoading, setImageLoading ] = useState<boolean>(false)
  const [ imageId, setImageId ] = useState<number | undefined>(data.mediaid)
  const imageFieldRef = useRef<any>(null)

  const itemCategory = categories.find(category => category.id === data.category);
    
  useEffect(() => {
    if(!itemCategory) {
      setEditCategory(true)
    } else {
      setEditCategory(false)
    }
  }, [open])

  async function uploadFile(e: FormEvent) {
    const formData = new FormData();
    formData.append('item_image', imageFieldRef.current.files[0]);

    setImageLoading(true)

    try {
      const upload = await fetch(`${config.api_url}/item/image/add/${data.id}`, {
        mode: 'cors',
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if(upload.status === 200) {
        const uploadJson = await upload.json()

        setImageId(uploadJson.data)
      } else {
        throw upload;
      }

    } catch(err) {
      console.log(err)
    } finally {
      setImageLoading(false)
    }
  }

  async function removeImage() {
    setImageLoading(true);

    try {
      const remove = await fetch(`${config.api_url}/item/image/remove/${data.id}`, {
        mode: 'cors',
        method: 'POST',
        credentials: 'include'
      })

      if(remove.status === 200) {
        setImageId(undefined)

      } else {
        throw remove;
      }

    } catch(err) {
      console.log(err)
    } finally {
      setImageLoading(false)
    }
  }
  
  return(
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit</DialogTitle>
            <DialogDescription>
              Edit {data.title} details.
            </DialogDescription>
          </DialogHeader>
          {imageId && !imageLoading && (
            <div className="relative">
              <AspectRatio ratio={16/9} className="px-2 pt-2">
                <img src={`${config.api_url}/item/image/${imageId}`} className="object-cover w-full h-full rounded-md" />
              </AspectRatio>
              <Badge 
                className="absolute cursor-pointer top-0 right-0 h-7 w-7 justify-center items-center p-1"
                onClick={removeImage}
                variant="destructive"
              >
                <Trash2Icon size={22} />
              </Badge>
            </div>
          )}
          
          {!imageId && !imageLoading && (
            <Form method="POST">
              <Input id="image" type="file" onChange={uploadFile} ref={imageFieldRef} />
            </Form>
          )}

          {imageLoading && (
            <AspectRatio ratio={16/9} className="flex items-center justify-center bg-slate-100">
              <LoadingSpinner />
            </AspectRatio>
          )}
          <Form method="POST" reloadDocument>
            <Input type="hidden" name="id" value={data.id} />
            <div className="grid w-full max-w-sm items-center">
              <Label htmlFor="title">Title</Label>
              <Input type="text" defaultValue={data.title} name="title" id="title"></Input>
            </div>
            <div className="grid w-full max-w-sm items-center mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea defaultValue={data.description} name="description" id="description" className="mt-3"></Textarea>
            </div>
            <div className="grid w-full max-w-sm items-center mt-4">
              <Label htmlFor="price">Price</Label>
              <Input type="text" defaultValue={String(data.price)} name="price" id="price" required></Input>
            </div>
            {!editCategory && (
              <Badge 
                variant="outline" 
                className="p-3 mt-3 cursor-pointer"
                onClick={() => setEditCategory(true)}
              >
                {itemCategory?.title}<Delete size={18} className="ml-2" />
              </Badge>
            )}
            {editCategory && (
              <div className="mt-3">
                <Select name="category">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Item category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>{category.title}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          <DialogFooter>
            <Button type="submit" size="lg" className="mt-5" name="action" value="edit">
              <ListEnd className="mr-2" />Save Item
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}