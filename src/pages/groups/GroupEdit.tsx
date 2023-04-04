import TextField from "@mui/material/TextField"
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";

import { WordList } from "../../components/WordList"
import { BoxShadow } from "../../elements/BoxShadows/BoxShadows";
import { IGroup } from "../../interfaces/IGroup";
import { Word } from "../../models/Word";
import { groupDefault } from "../../util/util";
import { Adapter } from "../../locals/adapter";
import { Group } from "../../models/Group";
import { IWord } from "../../interfaces/IWord.js";
import Grid from "@mui/material/Grid";
import { Box, Button, Divider, IconButton, Tab, Tabs, TextareaAutosize, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/styles";

import { UserContext } from "../../context/context.create";
import { setLocalGroup, setLocalGroups } from "../../locals/group.local";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import EditIcon from '@mui/icons-material/Edit'
import Header from "../../components/Header";
import { parseCsvBySeparator } from "../../util/csvToJson";
import { IndividualEdit } from "./IIndividualProps";
import EditBatch from "./EditBatch";

const useStyles = makeStyles({
    rigthButton: {
        textAlign: 'right'
    },
});


export const GroupEdit = () => {
    const classes = useStyles();
    const { userInfo, updateValue } = useContext(UserContext);
    let { id } = useParams();


    const [group, setGroup] = useState<IGroup>(groupDefault);
    const [word, setWord] = useState<IWord>(Word.newWord3());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [newGroupElement, setNewGroupElement] = useState<boolean>(false);
    const [isEditingGroupName, setIsEditingGroupName] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [textBatch, setTextBatch] = useState<string>('');

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const getData = async () => {
        setIsLoading(true);
        const group = await Adapter.getGroup(userInfo.UserId, id as string) as IGroup || new Group();

        group.Words = group.Words.map(_ => Word.newWord2(_.Name, _.Value));
        setGroup(group);
    };

    useEffect(() => {
        if (group.Words.length === 0)
            getData();
    }, []);

    useEffect(() => {
        if (group)
            setIsLoading(false);

        Adapter.setGroup(userInfo.UserId, group);

    }, [group])

    useEffect(() => {

        if (newGroupElement)
            setLocalGroup(group);

    }, [newGroupElement])


    const handleSaveClick = async (word:IWord) => {
  
        setGroup((prev: IGroup) => {
            const _words = prev.Words.filter(_=>_.Name !== word.Name);
            return { ...prev, Words: [..._words, word] }
        });

        // setNewGroupElement(true);
    }

    // const handleChangeWord = (e: any) => {
    //     const { name, value } = e.target;
    //     setWord((prevState) => ({
    //       ...prevState,
    //       [name]: value,
    //     }));
    // }

    const handleChangeGroupName = (e: any) => {
        setGroup((prev) => {
            return { ...prev, Name: e.target.value }
        })
    }

    const handleEditGroupNameClick = () => {
        setIsEditingGroupName(true);
    };

    const handleSaveGroupNameClick = () => {
        setIsEditingGroupName(false);
    }

    const handleSaveBatchClick = (text:string) => {
        setGroup((prev: IGroup) => {
            return { ...prev, Words: parseCsvBySeparator(text, ';') }
        });
    }

    const handleDeleteWord = (item:IWord)=> {
        setGroup((prev: IGroup) => {
            return { ...prev, Words: prev.Words.filter(_=>_.Name !== item.Name) }
        });
    }

    // const editBatch = () => <Grid>
    //     <TextareaAutosize
    //         maxRows={100}
    //         aria-label="maximum height"
    //         placeholder="Word1;Word2&#10;Word1;Word2"
    //         defaultValue=""
    //         onChange={(e) => setTextBatch(e.target.value)}
    //         value={textBatch}
    //         style={{ height: '400px', width: '100%' }} />
    //     <Grid item className={classes.rigthButton}>
    //         <Button onClick={handleSaveBatchClick}>Save</Button>
    //     </Grid>
    // </Grid>;

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
                    <Tab label="Add One by One" />

                    <Tab label="Add Batch" />
                </Tabs>
                <div>
                    <TabPanel value={tabValue} index={0}>
                        <IndividualEdit word={word} handleSaveClick={handleSaveClick}></IndividualEdit>
                        
                        <Divider></Divider>
                        <WordList words={group.Words} onHandleClickDeleteItem={handleDeleteWord}></WordList>
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
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

}