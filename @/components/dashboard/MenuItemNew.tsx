import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DashboardData } from "@/types/dashboard";
import { useLoaderData } from "@remix-run/react";
import { ListPlusIcon } from "lucide-react";

import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { ValidatedForm } from "remix-validated-form";
import { InputValidator } from "../ui/inputValidator";

export default function NewMenuItem({
  open,
  onClose,
} : {
  open: boolean,
  onClose: () => void
}) {
  const { categories } = useLoaderData<DashboardData>();

  const validator = withZod(z.object({
    title: z
      .string()
      .min(3, "Title must have at least 3 characters"),
    description: z.string(),
    price: z.string().refine((field) => /\d+\.\d{2}/.test(field), 'Price must be in the format 10.99')
  }))

  return(
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add new item to your menu
            </DialogDescription>
          </DialogHeader>
          <ValidatedForm validator={validator} method="POST" onSubmit={() => onClose()}>
            <InputValidator type="text" placeholder="Title" name="title"></InputValidator>
            <Textarea placeholder="Description" name="description" className="mt-3"></Textarea>
            <InputValidator type="text" placeholder="Price" name="price"></InputValidator>
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
        </ValidatedForm>
      </DialogContent>
    </Dialog>
  )
}