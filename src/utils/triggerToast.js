import { toast } from "react-toastify";

const showErrorPopup = (error) => {
  toast.error(error, {
    position: "top-right",
    autoClose: 3000,
  });
};

export default showErrorPopup