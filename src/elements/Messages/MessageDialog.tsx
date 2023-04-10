import { Alert, AlertColor, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

interface ToastProps {
    open: boolean;
    message: string;
    onClose?: (event: any, reason?: string) => void;
    autoHideDuration?: number;
    severity?: AlertColor;
}


export const MessageDialog: React.FC<ToastProps> = ({ open, message, onClose, autoHideDuration = 3000, severity = 'success' }) => {

    const [show, setShow] = useState(open);

    useEffect(() => {
        setShow(open);
    }, [open]);

    const handleClose = (event: any, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setShow(false);

        if (onClose) {
            onClose(event, reason);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Snackbar open={show} autoHideDuration={autoHideDuration} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} style={{ position: 'fixed', top: 30, width: '100%' }}>
                {message}
            </Alert>
            </Snackbar>
        </div >
      );
}
