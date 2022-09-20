import {REGISTER_FAIL,REGISTER_SUCCESS,USER_LOADED,AUTH_ERROR} from '../actions/types';


const initialState={
    token : localStorage.getItem("token"),
    loading : true,
    user: null,
    isAuthenticated : false
}

export default function(state=initialState, action){
    const {type, payload}=action;
 
    switch(type)
        {
            case REGISTER_SUCCESS:
                localStorage.setItem('token', payload.token);
              
                return {
                    ...state,
                    ...payload,
                 
                    loading: false,
                    isAuthenticated:true
                }
                case REGISTER_FAIL:
                case AUTH_ERROR:
                    localStorage.removeItem("token");
                    return {
                        ...state,
                        loading: false,
                        isAuthenticated:false,
                        token:null
                        
                    }
                case USER_LOADED:
                        return {
                            ...state,
                            loading: false,
                            isAuthenticated:true,
                            user:payload
                        }
                  
               default:
                    return state
        }
    

    
}