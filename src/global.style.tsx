import { makeStyles } from "@material-ui/styles";
import { Theme } from "@mui/material/styles";

export const useGlobalStyles = makeStyles((theme: Theme)=>({
    root: {
        justifyContent: 'center'
    },
    p10: {
        padding: '10px'
    }
}));

