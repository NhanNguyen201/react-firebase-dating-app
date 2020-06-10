import axios from 'axios';
import {
    SET_PEOPLE_LIST,
    SET_PEOPLE_ITEM,
    LIKE_USER,
    DISLIKE_USER,
    SET_ERRORS,
    CLEAR_ERRORS,
    CLEAR_DATA,
    LOADING_UI,
    LOADING_DATA,
    STOP_LOADING_UI, 
    SET_NOTI_PERSON
} from '../types';

export const getPeopleList = () => (dispatch) => {
    dispatch({type: CLEAR_DATA});
    dispatch({type: LOADING_DATA});
    axios
        .get('/users')
        .then(res => {
            dispatch({
                type: SET_PEOPLE_LIST,
                payload: res.data
            })
        })
        .then (() => {
            dispatch({type: LOADING_DATA});
        })
        .then (() => {
            dispatch({type: SET_PEOPLE_ITEM});  
        })
        .catch(err => {
            dispatch({
                type: SET_PEOPLE_LIST,
                payload: []
            })
        })
}

export const getPeopleItem = () => dispatch => {
    dispatch({type: LOADING_DATA});
    dispatch({type: SET_PEOPLE_ITEM});  
}

export const getOneUser = userName => dispatch => {
    dispatch({type: LOADING_DATA});
    axios.get(`/user/${userName}`)
        .then(res => {
            dispatch({
                type: SET_NOTI_PERSON,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

export const like_user = userName => dispatch => {
    dispatch({type: LOADING_UI});
    dispatch({type: CLEAR_ERRORS});
    axios
        .get(`/like/${userName}`)
        .then(() => {
            dispatch({
                type: LIKE_USER,
                payload: userName
            })
        })
        .then(() => {
            dispatch({ type: STOP_LOADING_UI });
        })
        .then(() => {
            dispatch({type: SET_PEOPLE_ITEM});  
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

export const like_user_in_noti = userName => dispatch => {
    dispatch({type: LOADING_DATA});
    dispatch({type: CLEAR_ERRORS});
    axios
        .get(`/like/${userName}`)
        .then(() => {
            dispatch(getOneUser(userName))
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

export const dislike_user_in_noti = userName => dispatch => {
    dispatch({type: LOADING_DATA});
    dispatch({type: CLEAR_ERRORS});
    axios
        .get(`/dislike/${userName}`)
        .then(() => {
            dispatch(getOneUser(userName))
        })
}
export const dislike_user = userName => dispatch => {
    dispatch({type: LOADING_UI});
    dispatch({type: CLEAR_ERRORS});
    axios
        .get(`/dislike/${userName}`)
        .then(() => {
            dispatch({
                type: DISLIKE_USER,
                payload: userName
            })
        })
        .then(() => {
            dispatch({ type: STOP_LOADING_UI });
        })
        .then(() => {
            dispatch({type: SET_PEOPLE_ITEM});  
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}