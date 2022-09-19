import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

function alertReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}

export default alertReducer;



// import {SET_ALERT,REMOVE_ALERT} from '../actions/types';
// import { createReducer } from '@reduxjs/toolkit'

// const alertReducer = createReducer([], (builder) => {
//     builder
//     .addCase(SET_ALERT, (state,action) => {
//         return [...state,action.payload];
//       })
//       .addCase(REMOVE_ALERT, (state, action) => {
//         // Can still return an immutably-updated value if we want to
//         return state.filter(alert =>alert.id !== action.payload);
//       })
  
// });

// export default alertReducer;