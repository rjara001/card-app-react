import { Box, Button, Divider, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material'
import React, { FC, useContext } from 'react';
import { useEffect, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import CasesOutlinedIcon from '@mui/icons-material/CasesOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { useNavigate, useParams } from 'react-router-dom';
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
import { filterWordByWord, getLastGroupId, isNullOrUndefinedOrBlank } from '../../util/util';
import { User } from '../../models/User';
import { TokenExpiredError } from '../../models/Error';
import GoogleAutoPopupLogin from '../../components/Google/GoogleAutoPopupLogin';
import { Group } from '../../models/Group';
import { UserInfo } from 'os';
import { Navigation } from '../../models/Navigation';

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
    const [currentCycle] = useState<number>(0);
    const navigate = useNavigate();
    const handlePlayClick = (id: string) => {

        userInfo.PlayingGroup = id;

        updateValue(userInfo);

        navigate(`/play`);
    }

    const handleButtonDelete = (item: IGroup): void => {

        // const { updatedUserInfo } = Adapter.deleteGroup(userInfo, item);

        // updateValue(updatedUserInfo);
        deleteGroup(item);

    }

    const handleSaveButtonEdit = (item: IGroup): void => {
        navigate(`/group/${item.Id.toString()}/${filter}`)
    }

    const handleDownloadButton = (item: IGroup): void => {

    }

    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar style={{ alignSelf: 'center' }} id='listAvatar'>
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
                        <span style={{ display: 'flex' }}>
                            <div>
                                {item.Words.length} total |
                            </div>
                            <div>
                                &nbsp;{`${item.Words.filter(_ => _.IsKnowed).length}`} learned |
                            </div>
                            <div>
                                &nbsp;{`${Math.min(...item.Words.filter(_=>!_.Reveled).map(word => word.Cycles))}`} Cycle
                            </div>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'right' }}>

                            <DeleteButton handleDeleteItem={handleButtonDelete} item={item}></DeleteButton>
                            <IconButton onClick={() => handleSaveButtonEdit(item)}>
                                <EditIcon />
                            </IconButton>
                            {/* <IconButton onClick={() => handleDownloadButton(item)}>
                                <DownloadIcon />
                            </IconButton> */}
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
    // const [dataGroups, setDataGroups] = useState<IGroup[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [requireAuth, setRequireAuth] = useState<boolean>(false);
    const [isActiveMessageSaveData, setIsActiveMessageSaveData] = useState<boolean>(false);
    const [isSyncSuccessful, setIsSyncSuccessful] = useState<boolean>(false);
    const [messageSuccessful, setMessageSuccessful] = useState<string>('');
    const [filter, setFilter] = useState('');
    const [filteredGroups, setFilteredGroups] = useState<IGroup[]>([]);

    let { word } = useParams();


    useEffect(() => {
        setGroups(User.getGroups(userInfo));
    }, [userInfo]);

    useEffect(() => {
        setFilter(word || '');
    }, [word]);

    useEffect(()=> {
        if (groups.length>0)
            if (groups.length!==userInfo.Groups.length)
            {
                const userLoggedNav = {...userInfo, Groups: groups};

                updateValue(Navigation.TrackingAction(userLoggedNav, "signin-google", "signin"));
            }
                   
    }, [groups]);

    useEffect(() => {

        if (!isNullOrUndefinedOrBlank(filter)) {

            let _groups = groups?.filter(_group => {

                let _filter = _group.Words.filter(word => filterWordByWord(word.Name, filter) || filterWordByWord(word.Value, filter));

                return _filter.length > 0 || _group.Name.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) >= 0;
            });

            setFilteredGroups(_groups.sort((a: IGroup, b: IGroup) => a.Name.localeCompare(b.Name)));
        }
        else
            setFilteredGroups(groups.sort((a: IGroup, b: IGroup) => a.Name.localeCompare(b.Name)));

    }, [filter, groups])

    if (!userInfo) {
        return <div>Loading user information...</div>;
    }

    function handleAddClick(): void {
        const group = Group.NewGroupCreated(getLastGroupId(groups));

        setGroups((prev)=> [...prev, group]);

        // navigate(`/group/${group.Id.toString()}`);
    }

    const deleteGroup = (item: IGroup) => {
        setGroups((prev) => {
            return [...prev.filter((_) => _.Id !== item.Id)];
        })

    }

    async function handleUploadCloud(): Promise<void> {
        try {

            await Adapter.uploadCloud(userInfo);

            setIsActiveMessageSaveData(false);
            setIsSyncSuccessful(true);
            setMessageSuccessful('Upload process was complete succesfull.');

        } catch (error) {
            if (error instanceof TokenExpiredError) {
                setRequireAuth(true);

            } else {
                setIsSyncSuccessful(false);
                return;
            }
        }


    }

    const handleDownloadCloud = async () => {
        try {
            const user = await Adapter.downloadCloud(userInfo);

            updateValue(user);


            setIsSyncSuccessful(true);
            setMessageSuccessful('Sync process was complete succesfull.');

        } catch (error) {
            
            updateValue({...userInfo, });

            if (error instanceof TokenExpiredError) {
                setRequireAuth(true);
            } else {
                setIsSyncSuccessful(false);
                return;
            }
        }

    }

    return (<div>

        <Header title="My Collections" />

        {requireAuth && <GoogleAutoPopupLogin></GoogleAutoPopupLogin>}

        <MessageDialog
            open={isSyncSuccessful}
            // title="Sync successful!"
            message={messageSuccessful}
            onClose={() => setIsSyncSuccessful(false)}
        />

        <ConfirmationDialog message="Are you sure you want to save your data in the cloud?" onConfirm={handleUploadCloud} open={isActiveMessageSaveData} onClose={() => setIsActiveMessageSaveData(false)} />

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
                    {userInfo.IsInLogin && <IconButton onClick={() => handleDownloadCloud()}>
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
                    {GroupListComponent(filteredGroups, filter, deleteGroup)}
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