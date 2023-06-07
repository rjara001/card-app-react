import { Avatar, Box, Button, Divider, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material'
import React, { FC, useContext } from 'react';
import { useEffect, useState } from 'react';

import { setLocalGroups } from '../../locals/group.local';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CasesOutlinedIcon from '@mui/icons-material/CasesOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { IGroup, IGroupProps } from '../../interfaces/IGroup';
// import { UserContext } from "../../context/context.create";
import { Adapter } from '../../locals/adapter';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BackupIcon from '@mui/icons-material/Backup';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { makeStyles } from '@material-ui/styles';
import Header from '../../components/Header';
import DeleteButton from '../../elements/DeleteButton/Index';
import ConfirmationDialog from '../../elements/Dialogs/ConfirmationDialog';
import { MessageDialog } from '../../elements/Dialogs/MessageDialog';
import { UserContext } from '../../context/context.user';
import { filterWordByType } from '../../util/util';

const useStyles = makeStyles({
    button: {
        margin: '8px 8px 8px 0'
        , textAlign: 'right'
    },

    list: {
        maxWidth: 'none'
    }
});

const ItemGroup: FC<IGroupProps> = ({ item, filter, deleteGroup }: IGroupProps): JSX.Element => {

    const { userInfo, updateValue } = useContext(UserContext);
    const navigate = useNavigate();
    const handlePlayClick = (id: string) => {

        userInfo.PlayingGroup = id;

        updateValue(userInfo);

        navigate(`/play`);
    }

    function handleButtonDelete(item: IGroup): void {

        Adapter.deleteGroup(userInfo.UserId, item);
        deleteGroup(item);

    }

    const handleSaveButtonEdit = (item: IGroup): void => {
        navigate(`/group/${item.Id.toString()}/${filter}`)
    }

    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar style={{alignSelf: 'center'}} id='listAvatar'>
                {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" /> */}
                <CasesOutlinedIcon></CasesOutlinedIcon>
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
                        <span>
                            {item.Words.length} total
                        </span>
                        <span style={{ display: 'flex', alignItems: 'right' }}>

                            <DeleteButton handleDeleteItem={handleButtonDelete} item={item}></DeleteButton>
                            <IconButton onClick={() => handleSaveButtonEdit(item)}>
                                <EditIcon />
                            </IconButton>
                        </span>
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
function GroupListComponent(groupList: any[], filter: string, deleteGroup: (item: IGroup) => void) {

    return (
        <Box style={{ height: 'calc(100vh - 260px)', overflow: 'auto' }}>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {
                    groupList.map((item, i) => {
                        return (
                            <React.Fragment key={i}>
                                <ItemGroup item={item} deleteGroup={deleteGroup} filter={filter}></ItemGroup><Divider variant="inset" component="li" />
                            </React.Fragment>
                        )
                    })
                }
            </List>
        </Box>
    );
}


export const GroupList = () => {
    const classes = useStyles();
    const { userInfo, updateValue } = useContext(UserContext);
    const navigate = useNavigate();
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [dataGroups, setDataGroups] = useState<IGroup[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isActiveMessageSaveData, setIsActiveMessageSaveData] = useState<boolean>(false);
    const [isSyncSuccessful, setIsSyncSuccessful] = useState<boolean>(false);
    const [messageSuccessful, setMessageSuccessful] = useState<string>('');
    const [filter, setFilter] = useState('');

    let { word } = useParams();

    const getData = async () => {
        setIsLoading(true);

        let _groups = await Adapter.getGroups(userInfo.UserId) as IGroup[];

        setLocalGroups(userInfo.UserId, _groups);
        setDataGroups(_groups);

        setGroups(_groups);
    };

    useEffect(() => {
        getData();
        setFilter(word || '');

    }, []);

    useEffect(() => {
        if (groups)
            setIsLoading(false);
    }, [groups]);

    useEffect(() => {

        if (filter !== undefined) {
            let _groups = dataGroups.filter(obj => {
                let _filter = obj.Words.filter(_ => filterWordByType(userInfo.FirstShowed ? 'Name' : 'Value', _, filter));

                return _filter.length > 0;
            });
            setGroups(_groups);
        }
    }, [filter])


    function handleAddClick(): void {
        navigate('/group');
    }

    const deleteGroup = (item: IGroup) => {
        setGroups((prev) => {
            return [...prev.filter((_) => _.Id !== item.Id)];
        })
    }

    function handleSaveAction(): void {
        Adapter.setGroups(userInfo.UserId);
        // Adapter.setDrive(userInfo);
        setIsActiveMessageSaveData(false);
        setIsSyncSuccessful(true);
        setMessageSuccessful('Upload process was complete succesfull.');
    }

    const handleSync = async () => {
        await Adapter.setSync(userInfo.UserId);

        let _groups = await Adapter.getGroups(userInfo.UserId) as IGroup[];

        setGroups(_groups);

        setIsSyncSuccessful(true);
        setMessageSuccessful('Sync process was complete succesfull.');
    }

    return (<div>

        <Header title="My Collections" />

        <MessageDialog
            open={isSyncSuccessful}
            // title="Sync successful!"
            message={messageSuccessful}
            onClose={() => setIsSyncSuccessful(false)}
        />

        <ConfirmationDialog message="Are you sure you want to save your data in the cloud?" onConfirm={handleSaveAction} open={isActiveMessageSaveData} onClose={() => setIsActiveMessageSaveData(false)} />

        <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={9} sm={9} >
                <TextField id="standard-basic"
                    label="Filter" variant="standard"
                    style={{ width: '100%' }}
                    onChange={(e) => setFilter(e.target.value)}
                    value={filter} />
            </Grid>
            <Grid container item xs={3} sm={3}>
                <Grid item xs={6} sm={6}>
                    {userInfo.IsInLogin && <IconButton onClick={() => handleSync()}>
                        <CloudDownloadIcon />
                    </IconButton>}
                </Grid>
                <Grid item>
                    {userInfo.IsInLogin && <IconButton onClick={() => setIsActiveMessageSaveData(true)}>
                        <BackupIcon />
                    </IconButton>}
                </Grid>
            </Grid>

        </Grid>
        <div>
            {isLoading ? (
                'Loading groups...'
            ) : (
                <div>
                    {GroupListComponent(groups, filter, deleteGroup)}
                </div>
            )}
        </div>
        <div>
            <div className={classes.button}>
                <IconButton aria-label="add" size="large" color="success" onClick={handleAddClick}>
                    <AddCircleIcon fontSize="inherit" sx={{ fontSize: 40 }} />
                </IconButton>
            </div>
        </div>
    </div>)
}