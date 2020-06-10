import React from 'react';
import PropTypes from 'prop-types';

import Notification from '../Notification/Notification';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'
const Notifications = ({ notifications }) => {
    return (
        <Paper variant="outlined" square style={{width: '500px', padding:"5px"}}>
            <Typography variant="body1">Notifications:</Typography>
            { notifications.map((eachNoti, index) => <Notification key={index} notification={eachNoti}/>) }
        </Paper>
    )
}
Notification.propTypes = {
    notifications: PropTypes.array.isRequired
}
export default Notifications;