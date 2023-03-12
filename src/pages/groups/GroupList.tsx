import { Avatar, Box, Button, Divider, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { GridColDef } from '@mui/x-data-grid/models/colDef/gridColDef.js';
import React from 'react';
import { useEffect, useState } from 'react';

import { queryGroupList } from '../../hooks/group.hook';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const ItemGroup = ({ item }: any) => {
    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
                primary={item.name}
                secondary={
                    <React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                        </Typography>
                        {/* <Button variant="outlined" startIcon={<DeleteIcon />}>
                            
                        </Button> */}
                         <Link to="/group"
                            >
                            <DeleteIcon />
                        </Link>
                        <Link to="/group">
                            <EditIcon />
                        </Link>
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}
function GroupListComponent(groupList: any[]) {
    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {
                groupList.map((item) => {
                    return (
                        <><ItemGroup item={item}></ItemGroup><Divider variant="inset" component="li" /></>
                    )
                })
            }


        </List>
    );
}


export const GroupList = () => {

    const [result, setGetResult] = useState<any[]>([]);

    // const { isLoading, refetch: getResult } = useQuery("groups", queryGroupList, {
    //     onSuccess: (res) => {
    //         setGetResult(res.data);
    //     }
    // });

    // useEffect(() => {
    //     getResult();
    // }, [])


    const { isLoading, error, data, isFetching } = useQuery({ queryKey: ["groups"],  queryFn: queryGroupList });
    
    if (isLoading) return (<div>Loading...</div>);
  
    if (error) return (<div>An error has occurred: " + error</div>)

    return (<div>

        <h1>Searching Groups</h1>

        <TextField id="standard-basic" label="Group" variant="standard" />

        <div>
            {isLoading ? (
                'Loading groups...'
            ) : (
                <div>
                    {GroupListComponent(result)}
                </div>
            )}
        </div>
    </div>)
}