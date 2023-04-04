import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import React from 'react';

type ConfirmationDialogProps = {
    message: string;
    onConfirm: () => void;
    open: boolean;
    onClose: () => void;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ message, onConfirm, open, onClose }) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div>

            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>{message}</DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ConfirmationDialog;