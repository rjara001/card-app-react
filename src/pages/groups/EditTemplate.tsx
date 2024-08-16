import { Box, List, Divider } from "@mui/material";
import React, { useEffect } from "react";

import { Word } from "../../models/Word";

export const EditTemplate: React.FC = () => {

    const [words, setWords] = useState<Word[]>();

    const getData = async () => {
        const words = await getWordsFromTemplate();
        setWords(words);
    }

    useEffect(()=>{
        getData();

    }, []);

    return (
        <div style={{ height: 300, width: '100%' }}>
            <Box style={{ height: 'calc(100vh - 260px)', overflow: 'auto' }}>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {
                        words.map((item: any, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    <div>{item}</div>
                                </React.Fragment>)

                        })
                    }
                </List>
            </Box>
        </div >
    );
}

function useState<T>(): [any, any] {
    throw new Error("Function not implemented.");
}
function getWordsFromTemplate() {
    throw new Error("Function not implemented.");
}

