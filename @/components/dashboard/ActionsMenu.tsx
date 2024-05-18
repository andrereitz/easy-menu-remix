import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { BookmarkPlus, FilePlus2, PlusIcon, Tag, Tags } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { MenuItemNew, CategoryNew, CategoryEdit } from "./"
import { CategoryDataEdit } from "@/types/dashboard"
import { Link } from "@remix-run/react"

export default function(){
  const [newItemOpen, setNewItemOpen] = useState<boolean>(false);
  const [newCategoryOpen, setNewCategoryOpen] = useState<boolean>(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState<boolean>(false);
  const [editCategoryData, setEditCategoryData] = useState<CategoryDataEdit | null>(null);

  return(
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="default" 
            className="rounded-full fixed right-[20px] bottom-[20px] md:right-[40px] md:bottom-[40px] w-[50px] h-[50px]"
          >
            <PlusIcon size={28} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Menu Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setNewItemOpen(true)}>
              <FilePlus2 className="mr-2 h-4 w-4" />
              <span>New Menu Item</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Tag className="mr-2 h-4 w-4" />
                <span>Categories</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Tags className="mr-2 h-4 w-4" />
                    <Link to="categories">Show all</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNewCategoryOpen(true)}>
                    <BookmarkPlus className="mr-2 h-4 w-4" />
                    <span>Add New</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <MenuItemNew open={newItemOpen} onClose={() => setNewItemOpen(false)} />
      <CategoryNew open={newCategoryOpen} onClose={() => setNewCategoryOpen(false)} />
    </>
  )
}