import {
    SET_PEOPLE_LIST,
    SET_PEOPLE_ITEM,
    LIKE_USER,
    DISLIKE_USER,
    LOADING_DATA,
    CLEAR_DATA,
    SET_NOTI_PERSON
} from '../types';

const initialState = {
    peopleList: [],
    notiPerson: {},
    peopleItem: {},
    loading: false
}
export default function(state = initialState, action){
    switch(action.type){
        case CLEAR_DATA: {
            return {
                ...state,
                peopleItem: {}
            }
        }
        case LOADING_DATA: {
            return {
                ...state,
                loading: true
            };
        }
        case SET_PEOPLE_LIST:{
            return {
                ...state,
                peopleList: action.payload,
            };
        }

        case SET_PEOPLE_ITEM: {
            if (state.peopleList.length > 0){
                const index = Math.floor(Math.random() * state.peopleList.length);
                return {
                    ...state,
                    peopleItem: state.peopleList[index],
                    loading: false
                }
            } else {
                return {
                    ...state,
                    peopleItem: {},
                    loading: false
                }
            }

        }
        case SET_NOTI_PERSON: {
            return {
                ...state,
                notiPerson: action.payload,
                loading: false
            }
        }
        case LIKE_USER: {
            const index = state.peopleList.findIndex(user => user.userName === action.payload);
            state.peopleList.splice(index, 1)
            return {
                ...state,
                loading: true
            }
        }

        case DISLIKE_USER: {
            const index = state.peopleList.findIndex(user => user.userName === action.payload);
            state.peopleList.splice(index, 1);
            return {
                ...state,
                loading: true
            }
        }
        default: 
            return state
    }
}