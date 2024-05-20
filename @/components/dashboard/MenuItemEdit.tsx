import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DashboardData, MenuItem } from "@/types/dashboard";
import { Form, useLoaderData } from "@remix-run/react";
import { Delete, ListPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function({
  open,
  onClose,
  data
} : {
  open: boolean,
  onClose: () => void,
  data: MenuItem
}) {
  const { categories } = useLoaderData<DashboardData>();
  const [ editCategory, setEditCategory ] = useState<boolean>(false)

  const itemCategory = categories.find(category => category.id === data.category)
    
  useEffect(() => {
    if(!itemCategory) {
      setEditCategory(true)
    } else {
      setEditCategory(false)
    }
  }, [data, open])
  
  return(
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit</DialogTitle>
            <DialogDescription>
              Edit {data.title} details.
            </DialogDescription>
          </DialogHeader>
          <Form method="POST" reloadDocument>
            <Input type="text" placeholder={data.title} name="title"></Input>
            <Textarea placeholder={data.description} name="description" className="mt-3"></Textarea>
            <Input type="text" placeholder={String(data.price)} name="price"></Input>
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
            <Button type="submit" size="lg" className="mt-5" name="action" value="add">
              <ListPlusIcon className="mr-2" />Add Item
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}