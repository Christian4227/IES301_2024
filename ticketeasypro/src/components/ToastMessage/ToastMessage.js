import React, { useEffect } from "react";
import { string } from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles from './ToastMessage.module.css';
// import ErrorIcon from "@/components/Icons/ErrorIcon/ErrorIcon"

// eslint-disable-next-line react/prop-types
const ToastMessage = ({ type, text }) => {
  useEffect(() => {
    if (type === "success") {
      toast.success(text);
    } else if (type === "error") {
      toast.error(text);
    }
  }, [type, text]);

  return <ToastContainer />;
};
ToastMessage.propTypes = {
  type: string.isRequired,
  text: string.isRequired,
};
export default ToastMessage;
