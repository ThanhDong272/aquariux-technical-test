import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistState {}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {} as WishlistState,
  reducers: {},
});

export const {} = wishlistSlice.actions;

export default wishlistSlice.reducer;
