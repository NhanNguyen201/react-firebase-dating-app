import React from 'react';
import Typography from '@material-ui/core/Typography';
import LaughImg from '../../Img/laughFace.png';
import './EmptyCard.css'
const EmptyCard = () => {
    // useEffect( , [])
    return (
        <div className="empty-card-container">
            <img className="laugh-img" src={LaughImg} alt="laugh"/>
            <Typography variant="body1" className="empty-text">Your match list is now empty</Typography>
        </div>
    )   
}
export default EmptyCard;