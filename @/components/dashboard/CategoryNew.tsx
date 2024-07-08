import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DashboardData } from "@/types/dashboard";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { BookmarkPlus } from "lucide-react";
import { useEffect, useRef } from "react";

export default function({
  open,
  reload,
  onClose,
} : {
  open: boolean,
  reload?: boolean,
  onClose: () => void
}) {
  const { categories } = useLoaderData<DashboardData>();
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if(inputRef.current) {
      inputRef.current.value = ""
    }
  })

  return(
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add category</DialogTitle>
        </DialogHeader>
        <Form method="POST" reloadDocument={reload}>
          <Input required type="text" placeholder="Title" name="title" ref={inputRef}></Input>
          {categories && (
            <div className="mt-5 flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Link to="categories"  key={category.id}>
                  <Badge variant="secondary" className="cursor-pointer">{category.title}</Badge>
                </Link>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button 
              type="submit" 
              size="lg" 
              className="mt-5" 
              name="action" 
              value="addCategory"
            >
              <BookmarkPlus className="mr-2" />Add Category
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
