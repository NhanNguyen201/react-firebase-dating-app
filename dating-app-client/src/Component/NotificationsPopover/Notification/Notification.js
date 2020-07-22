import React from 'react';
import PropTypes from 'prop-types';
import LoveIcon from '../../../Img/love-icon.png'
import MatchIcon from '../../../Img/match-icon.png'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import ScheduleIcon from '@material-ui/icons/Schedule';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import InfoCard from '../../InfoCard/InfoCard';
import './Notification.css';

const Notification = ({ notification }) => {
    dayjs.extend(relativeTime);
    return (
        <Card className={ notification.read ? "notiCardRead" : "notiCardUnread"}>
            <CardMedia
                image={notification.type === "liked" ? LoveIcon : MatchIcon }
                className="notiImg"
                title="Noti icon"
            />          
            <CardContent className="notiContent">
                <Typography variant="body1">{notification.body}</Typography>
                <Typography variant="caption"><ScheduleIcon style={{transform: 'translateY(25%)'}}/>   {dayjs(notification.createdAt).fromNow()}</Typography>
                <InfoCard userName={notification.sender} className="notiInfoCard"/>
            </CardContent>
        </Card>
    );
}
Notification.propTypes = {
    notification: PropTypes.object.isRequired
}
export default Notification;