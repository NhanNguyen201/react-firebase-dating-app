import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import NotificationPopover from '../NotificationsPopover/NotificationPopover/NotificationPopover'
// MUI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

// redux
import MyBtn from '../../Util/MyBtn';
import { connect } from 'react-redux';
import { logoutUser } from '../../Redux/actions/userActions';

const Navbar = ({ authenticated, logoutUser}) => {
    return (
        <AppBar>
            <Toolbar className="nav-container">
                {authenticated ? (
                    <Fragment>
                        <Link to="/">
                            <MyBtn tip="Home">
                                <HomeIcon/>
                            </MyBtn>
                        </Link>
                        <Link to="/user">
                            <MyBtn tip="Update your information">
                                <AccountCircleIcon/>
                            </MyBtn>
                        </Link>
                        <NotificationPopover/>
                        <MyBtn tip="logout" onClick={logoutUser}>
                            <KeyboardReturn/>
                        </MyBtn>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/signup">Signup</Button>
                    </Fragment>
                )}
            </Toolbar>
        </AppBar>
    )
}
Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    logoutUser: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    authenticated: state.user.authenticated,
})
export default connect(mapStateToProps, {logoutUser})(Navbar);