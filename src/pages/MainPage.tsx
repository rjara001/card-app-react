import Button from "@mui/material/Button"
import { useNavigate } from "react-router-dom";




export const MainPage = () => {
    const navigate = useNavigate();

    const handleGroupClick = () => {

        navigate('/groups', { replace: true });
    }
    const handlePlayClick = () => {
       
        navigate('/play', { replace: true });
    }
    
    return (

        <>
        <Button variant="text" onClick={handleGroupClick}>Groups</Button>
        <Button variant="text" onClick={handlePlayClick}>Play</Button>
        </>
    )
}