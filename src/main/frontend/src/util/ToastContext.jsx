import { createContext, useContext, useState } from "react";
import "../components/css/toast.css";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(false);

    const showToast = (msg, duration = 3000) => {
        setMessage(msg);
        setVisible(true);
        setTimeout(() => {
            setVisible(false);
        }, duration);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {visible && (
                <div className="toast-message">
                    {message}
                </div>
            )}
        </ToastContext.Provider>
    )
}

export const useToast = () => useContext(ToastContext);