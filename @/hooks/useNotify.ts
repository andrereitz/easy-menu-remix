import { ActionPayload } from "@/types/dashboard"
import { useEffect } from "react"
import { toast } from "react-toastify"

export const useNotify = (action?: ActionPayload) => {
  useEffect(() => {
    if(action && action.message) {
      switch (action.status) {
        case 'success':
          toast.success(action.message);
          break;
        case 'error':
          toast.error(action.message);
          break;
        case 'warning':
          toast.warn(action.message);
          break;
        case 'info':
          toast.info(action.message);
          break;
        default:
          toast(action.message);
          break;
      }
    }
  }, [action])
}