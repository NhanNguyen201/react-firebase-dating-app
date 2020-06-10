import React, { useState } from 'react';
import MyBtn from '../../Util/MyBtn';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import CakeOutlinedIcon from '@material-ui/icons/CakeOutlined';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { like_user, dislike_user } from '../../Redux/actions/dataActions';
import UserCarousel from '../UserCarousel/UserCarousel';
import './UserCard.css'
const UserCard = ({ person, peopleList, like_user, dislike_user }) => {
    const likeUser = () => {
        like_user(person.userName)
    }
    const disLikeUser = () => {
        dislike_user(person.userName)
    }
    const [openInfo, setOpenInfo] = useState(false)
    const handleOpen = () => {
        setOpenInfo(!openInfo)
    }
    return(
            <div className="card-container">
                <div className="card-top">
                    <UserCarousel className="avatar-img"/>
                    <div className="overlay">
                        <Typography variant="h6">{person.bio}
                            {person.birth && (
                                <span>            <CakeOutlinedIcon style={{transform: "translateY(10%)"}}/><i> {new Date().getFullYear() - person.birth}</i></span>
                            )}
                        </Typography>
                        <Typography variant="h6">@{person.userName}
                        </Typography>
                    </div>
                </div>
                { openInfo && (person.location || person.favorite) && (
                    <div className="card-info">
                        {person.location && (
                            <Typography variant="body1">
                                <LocationOnOutlinedIcon style={{transform: "translateY(10%)"}}/> Location: {person.location}
                            </Typography>
                        )}
                        {person.favorite && (
                            <Typography variant="body1">
                                <ThumbUpOutlinedIcon style={{transform: "translateY(10%)"}}/> Favorite: {person.favorite}
                            </Typography>
                        )}
                    </div>
                )}
                <div className="card-bottom">
                    <div className="icon-container">
                        <MyBtn tip="like" btnClassName="icon" onClick={likeUser}>
                            <FavoriteBorderIcon color="secondary"/>
                        </MyBtn>
                        <MyBtn tip="infomation" btnClassName="icon" onClick={handleOpen}>
                            <InfoIcon color="primary"/>
                        </MyBtn>
                        <MyBtn tip="Skip over" btnClassName="icon" onClick={disLikeUser}>
                            <CloseIcon/>
                        </MyBtn>
                    </div>
                </div>
            </div>
    )
}

UserCard.propTypes = {
    person: PropTypes.object.isRequired,
    peopleList: PropTypes.array
}

const mapPropsToState = state => ({
    peopleList : state.data.peopleList
})

export default connect(mapPropsToState, { like_user, dislike_user })(UserCard);