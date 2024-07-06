import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export const ToastContainerConfig = () => {
  return(
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  )
}