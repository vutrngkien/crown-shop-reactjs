import { compose, createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";

//mac dinh la localStorage
import storage from "redux-persist/lib/storage";
// import logger from 'redux-logger';

import { rootReducer } from "./root-reducer";

const loggerMiddleware = (store) => (next) => (action) => {
  if (!action.type) {
    return next(action);
  }

  console.log("type: ", action.type);
  console.log("payload: ", action.payload);
  console.log("currentState: ", store.getState());

  next(action);

  console.log("next state: ", store.getState());
};

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["user"], // la userReducer: cai nay se khong duoc luu trong storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleWares = [loggerMiddleware];

const composeEnhancer =
  (process.env.NODE_ENV !== "production" &&
    window &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export const store = createStore(
  persistedReducer,
  undefined,
  composeEnhancer(applyMiddleware(...middleWares))
);

export const persistor = persistStore(store);
