
import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { IGroup } from '../interfaces/IGroup.js';
import { Avatar, Divider, IconButton, Link, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { FC } from 'react';
import { IWord, IWordProps, IWordsProps } from '../interfaces/IWord';
import DeleteIcon from '@mui/icons-material/Delete';
import { IWordListProps } from '../pages/groups/IWordLIstProps.js';
import { IItemWord } from './IItemWord';

const ItemWord = ({ word, handleClickDeteleItem }: IItemWord) => {

    return (
        <ListItem alignItems="flex-start" secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={()=>handleClickDeteleItem(word)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
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
                        {word.Value}
                    </React.Fragment>
                }
            />
            
        </ListItem>
    )
}

export const WordList:FC<IWordListProps> = ({words: Words, onHandleClickDeleteItem}): JSX.Element =>{

    return (
        <div style={{ height: 300, width: '100%' }}>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
                Words.map((item) => {
                    return (
                        <><ItemWord word={item} handleClickDeteleItem={onHandleClickDeleteItem}></ItemWord><Divider variant="inset" component="li" /></>
                    )
                })
            }
        </List>
        </div>
      );
}