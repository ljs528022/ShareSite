import { createContext, useContext, useState } from "react";
import "../components/css/toast.css";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(false);
    const [type, setType] = useState("default"); 
                            // default, success, error, warning 등

    const showToast = (msg, type = "default", duration = 3000) => {
        setMessage(msg);
        setType(type);
        setVisible(true);
        setTimeout(() => {
            setVisible(false);
        }, duration);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {visible && (
            <div className={`toast-message ${type}`}>
                    {message}
                </div>
            )}
        </ToastContext.Provider>
    )
}

export const useToast = () => useContext(ToastContext);