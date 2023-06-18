
import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { IGroup } from '../interfaces/IGroup.js';
import { Avatar, Box, Divider, IconButton, Link, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { FC } from 'react';
import { IWord, IWordProps, IWordsProps } from '../interfaces/IWord';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IWordListProps } from '../pages/groups/IWordLIstProps.js';
import { IItemWord } from './IItemWord';
import AbcIcon from '@mui/icons-material/Abc';

const ItemWord = ({ word, handleClickDeteleItem, handleClickEditItem, handleSelectedItem }: IItemWord) => {

  
    return (
        <ListItem alignItems="flex-start" secondaryAction={
            <><IconButton edge="end" aria-label="delete" onClick={() => handleClickDeteleItem(word)}>
                <DeleteIcon />

            </IconButton><IconButton edge="end" aria-label="delete" onClick={() => handleClickEditItem(word)}>

                    <EditIcon />
                </IconButton></>
        }>
            <ListItemAvatar>
                <AbcIcon />
            </ListItemAvatar>
            <ListItemText onClick={() => handleSelectedItem(word)}
                primary={word.Name}
                secondary={
                    <React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                        </Typography>
                        {word.Value} | &nbsp;
                        {word.IsKnowed?'knowed':'unknowed'} | &nbsp;
                        {word.Reveled?'reveled':'unveiled'} | &nbsp;
                        {`Cycles:${word.Cycles}`}
                    </React.Fragment>
                }
            />

        </ListItem>
    )
}

export const WordList: FC<IWordListProps> = ({ words: Words, onHandleClickDeleteItem, handleClickEditItem, handleSelectedItem }): JSX.Element => {

    return (
        <div style={{ height: 300, width: '100%' }}>
            <Box style={{ height: 'calc(100vh - 260px)', overflow: 'auto' }}>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {
                        Words.map((item, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <ItemWord word={item} 
                                        handleClickDeteleItem={onHandleClickDeleteItem} 
                                        handleClickEditItem={handleClickEditItem}
                                        handleSelectedItem={handleSelectedItem}></ItemWord><Divider variant="inset" component="li" />
                                </React.Fragment>)

                        })
                    }
                </List>
            </Box>
        </div >
    );
}