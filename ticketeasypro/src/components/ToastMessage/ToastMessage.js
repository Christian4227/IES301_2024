import React from 'react';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import styles from './ToastMessage.module.css';
// import ErrorIcon from "@/components/Icons/ErrorIcon/ErrorIcon"

const ToastMessage = ({ type, text }) => {
    useEffect(() => {
        if (type === 'success') {
            toast.success(text);
        } else if (type === 'error') {
            toast.error(text);
        }
    }, [type, text]);

    return (
        <>
            <ToastContainer  />
            {/* <button onClick={showToast} style={{ backgroundImage: `url(${type === 'success' ? certo : ErrorIcon})` }}></button> */}
            {/* <button onClick={showToast} className={styles.ToastButton} style={{ backgroundImage: `url(${type === 'success' ? certo : ErrorIcon})` }}></button> */}
        </>
    );
};

export default ToastMessage;
