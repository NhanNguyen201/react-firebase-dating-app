import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import MyBtn from '../../../Util/MyBtn';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MyNotification from '../../../Util/MyNotification'
import Notifications from '../Notifications/Notifications';
import { connect } from 'react-redux';
import { markNotificationsRead } from '../../../Redux/actions/userActions';
const NotificationPopover = ({ notifications, markNotificationsRead }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    var unReadNotificationId = [];
    var notificationsClone = [];
    useEffect(() => {
        // eslint-disable-next-line
        notifications.map(notice => {
            notificationsClone.push(notice);
            if(notice.read === false) unReadNotificationId.push(notice.notification)
        })
        // eslint-disable-next-line
    })

    const openNoti = (event) => {
        setAnchorEl(event.currentTarget);
        if(unReadNotificationId.length > 0){
            markNotificationsRead(unReadNotificationId);
        }
    };
    const closeNoti = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    
    return (
        <>
            <MyBtn tip="Notifications" onClick={openNoti}>
                <MyNotification notifications={notifications}>
                    <NotificationsIcon/>
                </MyNotification>
            </MyBtn>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={closeNoti}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',    
                    horizontal: 'center',
                }}
            >
                <Notifications notifications={notificationsClone}/>
            </Popover>
        </>
    )
}

const mapStateToProps = state => ({
    notifications: state.user.notifications
})
NotificationPopover.propTypes = {
    notifications: PropTypes.array.isRequired,
    markNotificationsRead: PropTypes.func.isRequired
}
export default connect(mapStateToProps, { markNotificationsRead })(NotificationPopover);