import { Avatar, Box, Button, Divider, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material'
import React, { FC, useContext, useMemo } from 'react';
import { useEffect, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
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
import { filterWordByType } from '../../util/util';
import { User } from '../../models/User';
import { TokenExpiredError } from '../../models/Error';

const useStyles = makeStyles({
  button: {
    margin: "8px 8px 8px 0",
    textAlign: "right",
  },

  list: {
    maxWidth: "none",
  },
});

const ItemGroup: FC<IGroupProps> = ({
  item,
  filter,
  deleteGroup,
}: IGroupProps): JSX.Element => {
  const { userInfo, updateValue } = useContext(UserContext);
  const navigate = useNavigate();
  const handlePlayClick = (id: string) => {
    userInfo.PlayingGroup = id;

    const { userInfo, updateValue } = useContext(UserContext);
    const navigate = useNavigate();

    if (!userInfo) {
        return <div>Loading user information...</div>;
    }

    const handlePlayClick = (id: string) => {

    navigate(`/play`);
  };

  function handleButtonDelete(item: IGroup): void {
    Adapter.deleteGroup(userInfo.UserId, item);
    deleteGroup(item);
  }

  const handleSaveButtonEdit = (item: IGroup): void => {
    navigate(`/group/${item.Id.toString()}/${filter}`);
  };

    const handleButtonDelete = (item: IGroup): void => {

        const { updatedUserInfo } = Adapter.deleteGroup(userInfo, item);

        updateValue(updatedUserInfo);
        deleteGroup(item);

    }

    const handleSaveButtonEdit = (item: IGroup): void => {
        navigate(`/group/${item.Id.toString()}/${filter}`)
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
            <span style={{ display: "flex" }}>
              <div>{item.Words.length} total |</div>
              <div>
                &nbsp;{`${item.Words.filter((_) => _.IsKnowed).length}`} learned
                |
              </div>
              <div>
                &nbsp;{`${item.Words.filter((_) => _.Cycles).length}`} Cycle
              </div>
            </span>
            <span style={{ display: "flex", alignItems: "right" }}>
              <DeleteButton
                handleDeleteItem={handleButtonDelete}
                item={item}
              ></DeleteButton>
              <IconButton onClick={() => handleSaveButtonEdit(item)}>
                <EditIcon />
              </IconButton>
            </span>
          </React.Fragment>
        }
      />
      {userInfo.PlayingGroup !== item.Id && (
        <div style={{ alignSelf: "center" }}>
          <Button
            variant="outlined"
            onClick={() => handlePlayClick(item.Id)}
            startIcon={<PlayArrowIcon />}
          >
            Play
          </Button>
        </div>
      )}
    </ListItem>
  );
};
function GroupListComponent(
  groupList: any[],
  filter: string,
  deleteGroup: (item: IGroup) => void
) {
  return (
    <Box style={{ height: "calc(100vh - 260px)", overflow: "auto" }}>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {groupList.map((item, i) => {
          return (
            <React.Fragment key={i}>
              <ItemGroup
                item={item}
                deleteGroup={deleteGroup}
                filter={filter}
              ></ItemGroup>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          );
        })}
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


    // Memoized value to calculate filtered groups based on filter and groups
    const filteredGroupsMemo = useMemo(() => {
        if (filter !== '') {
            return groups.filter(group => {
                const _filter = group.Words.filter(word =>
                    filterWordByType(userInfo.FirstShowed ? 'Name' : 'Value', word, filter)
                );
                return _filter.length > 0;
            });
        }
        return groups;
    }, [filter, groups]);

    // Effect to update the filtered groups state when filteredGroupsMemo changes
    useEffect(() => {
        setFilteredGroups(filteredGroupsMemo);
    }, [filteredGroupsMemo]);

    if (!userInfo) {
        return <div>Loading user information...</div>;
    }

    function handleAddClick(): void {
        navigate('/group');
    }
  }, [filter, dataGroups]);

  function handleAddClick(): void {
    navigate("/group");
  }

    async function handleUploadCloud(): Promise<void> {
        try {
            await Adapter.uploadCloud(userInfo);
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                updateValue(User.LoginClean(userInfo));
                navigate('/');
            } else {
                setIsSyncSuccessful(false);
                return;
            }
        }
        
        setIsActiveMessageSaveData(false);
        setIsSyncSuccessful(true);
        setMessageSuccessful('Upload process was complete succesfull.');
    }

    const handleDownloadCloud = async () => {
        try {
            const user = await Adapter.downloadCloud(userInfo);
            updateValue(user);

        } catch (error) {
            if (error instanceof TokenExpiredError) {
                updateValue(User.LoginClean(userInfo));
                navigate('/');
            } else {
                setIsSyncSuccessful(false);
                return;
            }
        }

    setGroups(_groups);

    setIsSyncSuccessful(true);
    setMessageSuccessful("Sync process was complete succesfull.");
  };

  return (
    <div>
      <Header title="My Collections" />

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

      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={9} sm={9}>
          <TextField
            id="standard-basic"
            label="Filter"
            variant="standard"
            style={{ width: "100%" }}
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
          />
        </Grid>
        <div>
            {isLoading ? (
                'Loading groups...'
            ) : (
                <div>
                    {GroupListComponent(filteredGroups, filter, deleteGroup)}
                </div>
            )}
          </Grid>
          <Grid item>
            {userInfo.IsInLogin && (
              <IconButton onClick={() => setIsActiveMessageSaveData(true)}>
                <BackupIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </Grid>
      <div>
        {isLoading ? (
          "Loading groups..."
        ) : (
          <div>{groups && GroupListComponent(groups, filter, deleteGroup)}</div>
        )}
      </div>
      <div>
        <div className={classes.button}>
          <IconButton
            aria-label="add"
            size="large"
            color="success"
            onClick={handleAddClick}
          >
            <AddCircleIcon fontSize="inherit" sx={{ fontSize: 40 }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
