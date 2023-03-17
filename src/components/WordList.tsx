
import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { IGroup } from '../interfaces/IGroup.js';
import { Avatar, Divider, Link, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { FC } from 'react';
import { IWord, IWordProps, IWordsProps } from '../interfaces/IWord.js';

const ItemGroup = ({ item }: any) => {
    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
                primary={item.Name}
                secondary={
                    <React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                        </Typography>
                        {item.Value}
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}

export const WordList:FC<IWordsProps> = ({words: Words}): JSX.Element =>{

    return (
        <div style={{ height: 300, width: '100%' }}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {
                Words.map((item) => {
                    return (
                        <><ItemGroup item={item}></ItemGroup><Divider variant="inset" component="li" /></>
                    )
                })
            }
        </List>
        </div>
      );
}