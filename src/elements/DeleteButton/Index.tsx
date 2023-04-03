import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from "@mui/material";
import { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { IGroup, IGroupProps } from "../../interfaces/IGroup.js";
import React from 'react';

type DeleteButtonProps = {
  handleDeleteItem: (item: IGroup) => void;
  item: IGroup;
};

const DeleteButton = ({ handleDeleteItem, item }: DeleteButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDeleteClick = () => {
        setIsOpen(true);
    };

    const handleConfirmDelete = () => {
        // Delete the item here
        setIsOpen(false);
        handleDeleteItem(item);
    };

    const handleCancelDelete = () => {
        setIsOpen(false);
     
    };

    return (
        <>
            <IconButton onClick={() => handleDeleteClick()}>
                <DeleteIcon />
            </IconButton>

            <Dialog open={isOpen} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    );
};

export default DeleteButton;
