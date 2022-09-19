// import { configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
// import alert from './reducers/alert';
// const store= configureStore({reducer:{alert},
//     middleware: getDefaultMiddleware({
//         serializableCheck: false
//       }),
//     });

// export default store;



import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
;

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);



export default store;