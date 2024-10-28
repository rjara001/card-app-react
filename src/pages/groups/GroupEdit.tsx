import TextField from "@mui/material/TextField"
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { IGroup } from "../../interfaces/IGroup";
import { Word } from "../../models/Word";
import { groupDefault } from "../../util/util";
import { Adapter } from "../../locals/adapter";
import { IWord } from "../../interfaces/IWord.js";
import Grid from "@mui/material/Grid";
import { Box, IconButton, Tab, Tabs, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/styles";

// import { UserContext } from "../../context/context.create";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import EditIcon from '@mui/icons-material/Edit'
import Header from "../../components/Header";
import { parseCsvBySeparator } from "../../util/csvToJson";
import EditBatch from "./EditBatch";
import { UserContext } from "../../context/context.user";
import { EditIndividual } from "./EditIndividual";
import { Navigation } from "../../models/Navigation";

const useStyles = makeStyles({
    rigthButton: {
        textAlign: 'right'
    },
});

export const GroupEdit = () => {
    const classes = useStyles();
    const { userInfo, updateValue } = useContext(UserContext);
    let { id, word: filter } = useParams();

    const [group, setGroup] = useState<IGroup>(groupDefault);
    const [word, setWord] = useState<IWord>(Word.newWord3());
    const [wordEditing, setWordEditing] = useState<IWord>(Word.newWord3());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditingGroupName, setIsEditingGroupName] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
  

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
    
            // Retrieve the groups from userInfo
            const groups = userInfo?.Groups || [];
    
            // Find the group by ID
            let group = groups.find(g => g.Id === id) as IGroup;
                // Update the state with the group
            setGroup(group);
    
            setIsLoading(false);
        };
    
            getData();
    
    }, []); // Add necessary dependencies

    useEffect(()=>{
        if (group!=null){
            const userInfoUpdated = { ...userInfo, Groups: [...userInfo.Groups.filter(_=>_.Id !== group.Id), group] };
            
            updateValue(Navigation.TrackingAction(userInfoUpdated, "GroupEdit", "Loading"));
        }
            
    }, [group])
    
    const handleSaveClick = async (word: IWord) => {

        // persistWord(word);
        setGroup((prev) => Adapter.setWordGroup(prev, word));
    };
    
    const handleChangeGroupName = (e: any) => {

        setGroup((prev) => Adapter.setGroup(prev, { Name: e.target.value }));
    }

    const handleEditGroupNameClick = () => {
        setIsEditingGroupName(true);
    };

    const handleSaveGroupNameClick = () => {

        // persistGroup(group);
        
        setIsEditingGroupName(false);
    }

    const handleSaveBatchClick = (text: string) => {

        setGroup((prev) => 
            Adapter.setGroup(prev, {
              Words: [...prev.Words, ...parseCsvBySeparator(text, ';')]
            })
          );
        // persistGroup({ ...group, Words: parseCsvBySeparator(text, ';') });
    }

    const handleDeleteWord = (item: IWord) => {
        setGroup((prev) => Adapter.setGroup(prev, { Words: prev.Words.filter(_ => _.Name !== item.Name) }));
    }

    const handleEditWord = (item:IWord) => {
        setWordEditing(item);

        setWord(item);
    }

    const handleSelectedItem = (item:IWord) => {
        setWord(item);
    }

    const filterDisclaimer = filter!==undefined?` (filtered by:${filter})`:'';
    
    return (      
        <>
            <Header title="Edit Groups" hasBack={true} />

            <form>
                <Grid item xs={12}>
                    {isEditingGroupName ? (
                        <Grid container alignItems="center">
                            <Grid item xs={10}>
                                <TextField
                                    id="group-name"
                                    label="Group Name"
                                    variant="outlined"
                                    value={group.Name}
                                    sx={{ width: '100%' }}
                                    onChange={handleChangeGroupName} />
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton onClick={handleSaveGroupNameClick}>
                                    <CheckCircleOutlineOutlinedIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container alignItems="center">
                            <Grid item xs={10}>
                                <Typography variant="h6">{group.Name}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton onClick={handleEditGroupNameClick} sx={{ marginLeft: 'auto' }}>
                                    <EditIcon sx={{ marginLeft: '10px' }} />
                                </IconButton>
                            </Grid>
                        </Grid>
                    )}

                </Grid>
                <Tabs value={tabValue} onChange={handleChange} aria-label="disabled tabs example">
                    <Tab label={`Add One by One ${filterDisclaimer}`} />

                    <Tab label="Add Batch" />
                </Tabs>
                <div>
                    <TabPanel value={tabValue} index={0}>
                        
                        <EditIndividual 
                                userInfo={userInfo} 
                                filter={filter || ''} 
                                word={word} 
                                words={group.Words.sort((a: IWord, b: IWord) => a.Name.localeCompare(b.Name))} 
                                handleDeleteWord={handleDeleteWord} 
                                handleSaveClick={handleSaveClick}
                                handleEditWord={handleEditWord}
                                handleSelectedItem={handleSelectedItem}></EditIndividual>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <EditBatch handleSaveBatchClick={handleSaveBatchClick}></EditBatch>

                    </TabPanel>

                </div>


            </form></>


    )
    interface TabPanelProps {
        children?: React.ReactNode;
        dir?: string;
        index: number;
        value: number;
    }

    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <span>{children}</span>
                    </Box>
                )}
            </div>
        );
    }

    // function persistWord(word: IWord) {

    //     group.Status = StatusChange.Modified;
    //     const { updatedUserInfo, updatedGroup } = Adapter.setWordGroup(group, word, userInfo);

    //     setGroup(updatedGroup);
    //     updateValue(updatedUserInfo);

    //     setGroup((prev: IGroup) => {
    //         return { ...prev, Words: prev.Words.filter(_ => _.Name !== item.Name) }
    //     });
    // }

    
}

