import { Avatar, Button, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material'
import React, { FC, useContext } from 'react';
import { useEffect, useState } from 'react';

import { setLocalGroups } from '../../locals/group.local';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { Link, useNavigate } from 'react-router-dom';
import { IGroup, IGroupProps } from '../../interfaces/IGroup';
import { UserContext } from "../../context/context.create";
import { Adapter } from '../../locals/adapter';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BackupIcon from '@mui/icons-material/Backup';

import { makeStyles } from '@material-ui/styles';
import Header from '../../components/Header';
import DeleteButton from '../../elements/DeleteButton/Index';


const useStyles = makeStyles({
    button: {
        margin: '8px 8px 8px 0'
        , textAlign: 'right'
    },

    list:{
        maxWidth:'none'
    }
});

const ItemGroup: FC<IGroupProps> = ({ item, deleteGroup }: IGroupProps): JSX.Element => {

    const { userInfo, updateValue } = useContext(UserContext);
    const navigate = useNavigate();
    const handlePlayClick = (id: string) => {

        userInfo.PlayingGroup = id;

        updateValue(userInfo);

        navigate(`/play`);
    }

    function handleButtonSave(item: IGroup): void {
        Adapter.setGroup(userInfo.UserId, item);
    }

    function handleButtonDelete(item: IGroup): void {

        Adapter.deleteGroup(userInfo.UserId, item);
        deleteGroup(item);
    
    }
    function handleSaveButtonEdit(item: IGroup): void {
        navigate(`/group/${item.Id.toString()}`)
    }
    return (
        <ListItem alignItems="flex-start" id="list-group">
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
                        />
                        <div>
                            {item.Words.length} total
                        </div>
                        <div style={{ display: 'flex', alignItems: 'right' }}>
      
                            <DeleteButton handleDeleteItem={handleButtonDelete} item={item}></DeleteButton>
                            <IconButton onClick={() => handleSaveButtonEdit(item)}>
                                <EditIcon  />
                            </IconButton>
                            <IconButton onClick={() => handleButtonSave(item)}>
                                <BackupIcon />
                            </IconButton>

                        </div>
                    </React.Fragment>
                }
            />
            {userInfo.PlayingGroup !== item.Id && <div style={{ alignSelf: 'center' }}>
                <Button variant="outlined"
                    onClick={() => handlePlayClick(item.Id)}
                    startIcon={<PlayArrowIcon />}>
                    Play
                </Button>
            </div>}
        </ListItem>
    )
}
function GroupListComponent(groupList: any[], deleteGroup: (item:IGroup)=> void) {
    
    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
                groupList.map((item, i) => {
                    return (
                        <>
                        <ItemGroup key="{i}" item={item} deleteGroup={deleteGroup}></ItemGroup><Divider variant="inset" component="li" /></>
                    )
                })
            }
        </List>
    );
}


export const GroupList = () => {
    const classes = useStyles();
    const { userInfo, updateValue } = useContext(UserContext);
    const navigate = useNavigate();
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>();

    const getData = async () => {
        setIsLoading(true);

        let _groups = await Adapter.getGroups(userInfo.UserId) as IGroup[];

        setLocalGroups(_groups);

        setGroups(_groups);
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (groups)
            setIsLoading(false);

    }, [groups]);


    function handleAddClick(): void {
        navigate('/group');
    }

    const deleteGroup = (item:IGroup) => {
        setGroups((prev)=>{
            return [...prev.filter((_) => _.Id !== item.Id)];
        })
    }

    return (<div>

        <Header title="Groups" />

        <TextField id="standard-basic" label="Group" variant="standard" />

        <div>
            {isLoading ? (
                'Loading groups...'
            ) : (
                <div>
                    {GroupListComponent(groups, deleteGroup)}
                </div>
            )}
        </div>
        <div>
            <div className={classes.button}>
                <IconButton aria-label="add" size="large" color="success">
                    <AddCircleIcon fontSize="inherit" sx={{ fontSize: 40 }} onClick={handleAddClick} />
                </IconButton>
            </div>
        </div>
    </div>)
}