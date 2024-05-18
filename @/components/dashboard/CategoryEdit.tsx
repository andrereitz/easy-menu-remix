import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CategoryDataEdit } from "@/types/dashboard";
import { Form } from "@remix-run/react";
import { BookmarkCheck, Trash2 } from "lucide-react";

export default function({
  open,
  onClose,
  data
} : {
  open: boolean,
  onClose: () => void,
  data: CategoryDataEdit | null
}) {
  
  return(
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <Form method="POST" reloadDocument>
          <Input type="hidden" value={data ? data.id : 0} name="id"></Input>
          <Input type="text" placeholder={data ? data.title : ''} name="title"></Input>
          <DialogFooter className="flex items-center gap-3 mt-5">
            <Button
              variant="destructive"
            >
              <Trash2 className="mr-2" /> Delete Category
            </Button>
            <Button 
              type="submit" 
              name="action" 
              value="edit"
            >
              <BookmarkCheck className="mr-2" /> Save Category
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
