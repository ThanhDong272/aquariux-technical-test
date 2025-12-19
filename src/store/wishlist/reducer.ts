import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MovieDetailType } from "@services/apis/movie";

export interface WishlistState {
  listWishlist: MovieDetailType[];
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    listWishlist: [],
  } as WishlistState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<MovieDetailType>) => {
      const exists = state.listWishlist.find(
        (item) => item.id === action.payload.id
      );
      if (!exists) {
        state.listWishlist.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.listWishlist = state.listWishlist.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;

export const wishlistSelector = (state: { wishlist: WishlistState }) =>
  state.wishlist;

export default wishlistSlice.reducer;
