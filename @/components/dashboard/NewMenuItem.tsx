import { Form, useLoaderData } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardData } from "@/types/dashboard";
import { ListPlusIcon, PlusIcon } from "lucide-react";
import { DialogHeader, DialogFooter, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function NewMenuItem() {
  const { categories } = useLoaderData<DashboardData>();

  return(
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="rounded-full fixed right-[20px] bottom-[20px] md:right-[40px] md:bottom-[40px]">
          <PlusIcon className="mr-2" /> New Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add new item to your menu
            </DialogDescription>
          </DialogHeader>
          <Form method="POST" reloadDocument>
            <Input type="file" name="image" />
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
            <Button type="submit" size="lg" className="mt-5" name="action" value="add">
              <ListPlusIcon className="mr-2" />Add Item
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}