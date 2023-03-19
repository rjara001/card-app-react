import TextField from "@mui/material/TextField"
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";

import { WordList } from "../../components/WordList"
import { BoxShadow } from "../../elements/BoxShadows/BoxShadows";
import { queryGroupEdit } from "../../hooks/group.hook";
import { IGroup } from "../../interfaces/IGroup";
import { Word } from "../../models/Word";
import { groupDefault } from "../../util/util";

export const GroupEdit = () => {
    let { id } = useParams();
 
    const [result, setGetResult] = useState<IGroup>(groupDefault);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getData = async () => {
        setIsLoading(true);
        const { data } = await queryGroupEdit(id as string);
        let group = data as IGroup;
        group.Words = group.Words.map(_ => Word.newWord2(_.Name, _.Value));
        setGetResult(group);
    };
    
    useEffect(()=>{
        getData();
    }, []);

    useEffect(()=>{
        if (result)
            setIsLoading(false);

    }, [result])
    return (
        <BoxShadow>
            <BackButton />
            <TextField id="name" label="Name Group" variant="outlined" >{result.Name}</TextField>

            <WordList words={result.Words}></WordList>
        </BoxShadow>

    )
}