import TextField from "@mui/material/TextField"
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { WordList } from "../../components/WordList"
import { BoxShadow } from "../../elements/BoxShadows/BoxShadows";
import { queryGroupEdit } from "../../hooks/group.hook";
import { IGroup } from "../../interfaces/IGroup";

export const GroupEdit = () => {

    const [result, setGetResult] = useState<IGroup>({ name: '', words: [] });

    // const { isLoading, refetch: getResult } = useQuery("group", queryGroupEdit, {
    //     onSuccess: (res) => {
    //         setGetResult(res.data);
    //     }
    // });

    // useEffect(() => {
    //     getResult();
    // }, [])

    const { isLoading, error, data, isFetching } = useQuery({ queryKey: ["group"],  queryFn: queryGroupEdit });
    
    if (isLoading) return (<div>Loading...</div>);
  
    if (error) return (<div>An error has occurred: " + error</div>)

    return (
        <BoxShadow>
            <TextField id="name" label="Name Group" variant="outlined" >{result.name}</TextField>

            <WordList words={result.words}></WordList>
        </BoxShadow>

    )
}