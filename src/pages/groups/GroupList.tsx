import { Avatar, Box, Button, Divider, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { GridColDef } from '@mui/x-data-grid/models/colDef/gridColDef.js';
import React, { FC, useContext } from 'react';
import { useEffect, useState } from 'react';

import { queryGroupList } from '../../hooks/group.hook';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { IGroup, IGroupProps } from '../../interfaces/IGroup';
import { UserContext } from "../../context/context.create";


const ItemGroup: FC<IGroupProps> = ({ item }: IGroupProps): JSX.Element => {

    const { userInfo, updateValue } = useContext(UserContext);
    const navigate = useNavigate();
    const handlePlayClick = (id:number)=>{
        
        userInfo.PlayingGroup = id;

        updateValue(userInfo);

        navigate(`/play`);
    }
    
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

                        <Link to="/group"
                        >
                            <DeleteIcon />
                        </Link>
                        <Link to={`/group/${item.Id.toString()}`}>
                            <EditIcon />
                        </Link>


                    </React.Fragment>
                }
            />
            {userInfo.PlayingGroup !== item.Id && <div style={{ alignSelf: 'center' }}>
                <Button variant="outlined" 
                    onClick={()=>handlePlayClick(item.Id)}
                    startIcon={<PlayArrowIcon />}>
                    Play
                </Button>
            </div>}
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

    const [result, setGetResult] = useState<IGroup[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>();

    const getData = async () => {
        setIsLoading(true);

        const { data } = await queryGroupList();
        let groups = data as IGroup[];

        setGetResult(groups);
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (result)
            setIsLoading(false);

    }, [result])

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