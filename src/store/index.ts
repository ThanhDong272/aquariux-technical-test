import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { persistReducer, persistStore, PersistConfig } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import {
  asyncFunctionMiddleware,
  asyncDispatchMiddleware,
} from "./middleware/asyncMiddleware";

import LocalServices from "@services/local";

import wishlistReducer from "./wishlist/reducer";

type ReducerType = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<ReducerType> = {
  key: "root",
  version: 1,
  storage: LocalServices,
  timeout: undefined,
  // blacklist: [] as ReducerNameEnum[] as string[],
  // https://github.com/rt2zz/redux-persist#state-reconciler
  // https://blog.bam.tech/developer-news/redux-persist-how-it-works-and-how-to-change-the-structure-of-your-persisted-store
  stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers({
  wishlist: wishlistReducer,
});

const persistedReducer = persistReducer<ReducerType, AnyAction>(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    // Disable default middlewares to preserve previous behavior (no thunk/serializable/immutable checks)
    const base = getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
      immutableCheck: false,
    }).concat(asyncDispatchMiddleware, asyncFunctionMiddleware);

    return __DEV__ ? base.concat(logger) : base;
  },
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
