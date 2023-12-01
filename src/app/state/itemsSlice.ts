import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ItemsState {
    value: Item[]
}

const initialState: ItemsState = {
    value: [],
}

export const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        add: (state, action: PayloadAction<Item>) => {
            state.value.push(action.payload);
        },
        remove: (state, action: PayloadAction<string>) => {
            state.value = state.value.filter(item => item._id !== action.payload);
        },
        update: (state, action: PayloadAction<Item>) => {
            state.value = state.value.map(item => item._id === action.payload._id ? action.payload : item);
        },
        addAll: (state, action: PayloadAction<Item[]>) => {
            state.value = [...state.value, ...action.payload];
        }
    },
})

export const { add, remove, update, addAll } = itemsSlice.actions;

export default itemsSlice.reducer;