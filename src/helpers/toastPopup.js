import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const toastPopup = {
  error: (text) => {
    toast.error(text, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  },

  success: (text) => {
    toast.success(text, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  },
};

export default toastPopup;
