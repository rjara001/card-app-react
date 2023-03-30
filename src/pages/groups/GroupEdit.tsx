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

const useStyles = makeStyles({
    rigthButton: {
        textAlign: 'right'
    },
});


export const GroupEdit = () => {
    const { userInfo, updateValue } = useContext(UserContext);
    let { id } = useParams();
    const classes = useStyles();

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

    // useEffect(()=>{

    // }, [textBatch]);

    useEffect(() => {
        if (group.Words.length === 0)
            getData();
    }, []);

    useEffect(() => {
        if (group)
            setIsLoading(false);

    }, [group])

    useEffect(() => {

        if (newGroupElement)
            setLocalGroup(group);

    }, [newGroupElement])


    const handleSaveClick = async () => {
        setGroup((prev: IGroup) => {
            return { ...prev, Words: [...group.Words, word] }
        });

        setNewGroupElement(true);
    }

    const handleChangeWordName = (e: any) => {
        setWord((prev) => {
            return { ...prev, Name: e.target.value }
        })
    }

    const handleChangeWordValue = (e: any) => {
        setWord((prev) => {
            return { ...prev, Value: e.target.value }
        })
    }

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

    const handleSaveBatchClick = () => {
        setGroup((prev: IGroup) => {
            return { ...prev, Words: parseCsvBySeparator(textBatch, ';') }
        });

    }

    const editBatch = () => <Grid>
        <TextareaAutosize
            maxRows={100}
            aria-label="maximum height"
            placeholder="Word1;Word2&#10;Word1;Word2"
            defaultValue=""
            onChange={(e) => setTextBatch(e.target.value)}
            value={textBatch}
            style={{ height: '400px', width: '100%' }} />
        <Grid item className={classes.rigthButton}>
            <Button onClick={handleSaveBatchClick}>Save</Button>
        </Grid>
    </Grid>;

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
                        {editIndividualWay()}

                        <Divider></Divider>
                        <WordList words={group.Words}></WordList>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        {editBatch()}

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

    function editIndividualWay() {
        return <Grid container spacing={3}>

            <Grid container item spacing={1} direction="column" justifyContent="center">
                {/* Word name text field */}
                <Grid item>
                    <TextField sx={{ width: '100%' }} placeholder="Text" onChange={handleChangeWordName} value={word.Name} id="name" label="Word Name" variant="outlined" />
                </Grid>
                {/* Word value text field */}
                <Grid item>
                    <TextField sx={{ width: '100%' }} placeholder="Value" onChange={handleChangeWordValue} value={word.Value} id="value" label="Word Value" variant="outlined" />
                </Grid>
                {/* Save button */}
                <Grid item className={classes.rigthButton}>
                    <Button onClick={handleSaveClick}>Save</Button>
                </Grid>
            </Grid>
        </Grid>;
    }
}