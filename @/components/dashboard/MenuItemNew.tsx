import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DashboardData } from "@/types/dashboard";
import { Form, useLoaderData } from "@remix-run/react";
import { ListPlusIcon } from "lucide-react";

export default function NewMenuItem({
  open,
  onClose,
} : {
  open: boolean,
  onClose: () => void
}) {
  const { categories } = useLoaderData<DashboardData>();

  return(
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add new item to your menu
            </DialogDescription>
          </DialogHeader>
          <Form method="POST" reloadDocument>
            <Input type="text" placeholder="Title" name="title"></Input>
            <Textarea placeholder="Description" name="description" className="mt-3"></Textarea>
            <Input type="text" placeholder="Price" name="price"></Input>
            {categories && (
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
            <Button type="submit" size="lg" className="mt-5" name="action" value="AddMenuItem">
              <ListPlusIcon className="mr-2" />Add Item
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}