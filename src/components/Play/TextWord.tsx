import { Box, IconButton, Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../../context/context.user";
import { ofuscator } from "../../util/util";
import { IWord } from "../../interfaces/IWord";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";
import { Word } from "../../models/Word";

type TextProps = {
    word: IWord
}

export const TextWord: React.FC<TextProps> = ({ word }) => {
    const { userInfo } = useContext(UserContext);
    const navigate = useNavigate();

    const handleWordEditClick = () => {
        let workText = Word.newWord(word).getName(userInfo.FirstShowed);
        navigate('/groups/' + workText);
    }

    return (<Box>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="div" style={{ paddingTop: '10px',paddingRight:'6px', position: 'relative',top: '-6px' }}>
                {word.getName(userInfo.FirstShowed)}
            </Typography>
            <IconButton size="small" style={{ 'verticalAlign': 'bottom'}} onClick={handleWordEditClick}>
                <EditIcon fontSize="inherit"/>

            </IconButton>
        </div>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {word.Reveled===true && word.getValue(userInfo.FirstShowed)}
            {word.Reveled===false && ofuscator(word.getValue(userInfo.FirstShowed))}
        </Typography>
    </Box >)
};
