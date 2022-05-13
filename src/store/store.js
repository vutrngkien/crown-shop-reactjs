import { compose, createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";

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

// tuong tu cach hoat dong cua thunk
// const thunkMiddleware = (store) => (next) => (action) => {
//   if (typeof action === "function") return action(next);
//   return next(action);
// };

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"], // la userReducer: chi cai nay se duoc luu trong storage, blacklist thi nguoc lai
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleWares = [
  process.env.NODE_ENV !== "product" && loggerMiddleware,
  thunk,
].filter(Boolean);

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
