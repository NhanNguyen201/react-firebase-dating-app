import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getOneUser, like_user_in_noti, dislike_user_in_noti } from '../../Redux/actions/dataActions';
//mui
import Card from '@material-ui/core/Card';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import './InfoContent.css';
import MyBtn from '../../Util/MyBtn';
const InfoContent = ({ userName, loading, getOneUser, notiPerson,peopleItem, like_user_in_noti, dislike_user_in_noti}) => {
    useEffect(() => {
        getOneUser(userName)
        // eslint-disable-next-line
    }, [])
    const likeUserInNoti = () => {
        if(!notiPerson.isLiked) {
            like_user_in_noti(notiPerson.userName)
        }
    }
    const dislikeUserInNoti = () => {
        if(!notiPerson.isDisliked) {
            dislike_user_in_noti(notiPerson.userName)
        }
    }
    return(
        <Card variant="outlined" className="notiPersonCard">
            <div className="cardHeader">
                {
                    loading ? (
                        <Skeleton className="cardAvatarSkeleton" variant="circle" height={140} width={140}/>
                    ) : (
                        <img src={notiPerson.imageUrl} alt="avatar" className="cardAvatar"/>
                    )
                }
            </div>
            <div className="cardBody">
                {
                    loading ? (
                        <>
                            <Skeleton variant="text"/>
                            <Skeleton variant="text"/>
                            <Skeleton variant="text"/>
                            <Skeleton variant="text"/>
                            <Skeleton variant="text"/>
                        </>
                    ) : (
                        <>
                            <Typography variant="h4" style={{textAlign: "center"}}>{notiPerson.bio}</Typography>
                            <Typography variant="body1">Year of birth: {notiPerson.birth}</Typography>
                            <Typography variant="body1">Location: {notiPerson.location}</Typography>
                            <Typography variant="body1">Favorite: {notiPerson.favorite}</Typography>
                            <Typography variant="body1">Image collection:</Typography>
        
                        </>
                    )
                }
                <div className="image-container-noti">
                    { loading || !notiPerson.imageCollection || notiPerson.imageCollection.length === 0  
                        ? (
                            <>
                                <Skeleton variant="rect" height={75} width={75} />
                                <Skeleton variant="rect" height={75} width={75} />
                                <Skeleton variant="rect" height={75} width={75} />
                            </>
                        )
                        : (
                            <>
                                {
                                    notiPerson.imageCollection.map((eachImg, index) => <img src={eachImg} alt="imgCollection" key={index} className="notiCollectionImg"/>)
                                }
                            </>
                        )
                    }
                </div>
                <div className="icon-container-noti">
                    { loading 
                        ? (
                            <>
                                <Skeleton variant="circle" height={30} width={30} className="icon-noti"/>
                                <Skeleton variant="circle" height={30} width={30} className="icon-noti"/>
                            </>
                        ) : peopleItem.userName !== notiPerson.userName ? (
                            <>
                                <MyBtn
                                    onClick={likeUserInNoti}
                                    tip={ !notiPerson.isLiked ? "Like this user" : "You have liked this person already"}
                                    btnClassName="icon-noti"
    
                                >
                                    {notiPerson.isLiked ? <FavoriteIcon color="secondary"/> : <FavoriteBorderIcon color="secondary"/>}
                                </MyBtn>
                                <MyBtn
                                    onClick={dislikeUserInNoti}
                                    tip={ !notiPerson.isDisliked ? "Dislike this user" : "You have disliked this person already"}
                                    btnClassName="icon-noti"
                                >
                                    <NotInterestedIcon/>
                                </MyBtn>
                            </>
                        ) : null
                    }
                </div>
            </div>
        </Card>
    )
}

InfoContent.propTypes = {
    userName: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    notiPerson: PropTypes.object.isRequired,
    getOneUser: PropTypes.func.isRequired,
    like_user_in_noti: PropTypes.func.isRequired,
    dislike_user_in_noti: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    loading: state.data.loading,
    notiPerson: state.data.notiPerson,
    peopleItem: state.data.peopleItem
})

export default connect(mapStateToProps, { getOneUser, like_user_in_noti, dislike_user_in_noti })(InfoContent) ;