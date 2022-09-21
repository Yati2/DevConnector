import {PROFILE_ERROR,GET_PROFILE} from './types';

const initialState={
    profile : null,
    profiles:[],
    repos:[],
    loading: true,
    error:{}
}

export default function(state=initialState, action){
    const {type, payload}=action;
    switch(type){
        case PROFILE_ERROR:
            return {
                ...state,
                error : payload,
                loading:false
            };

        case GET_PROFILE:
            return { 
                ...state,
                profile:payload,
                loading:false
            };

        default:
            return state;
    }

}