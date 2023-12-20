import { StateCreator, create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';


type AdminSlice = {
    selectedCountry: string;
    selectedCategory: string;
    selectedItem?: Item;

    setSelectedCountry: (country: string) => void;
    setSelectedCategory: (category: string) => void;
    setSelectedItem: (item: Item) => void;
}

type ItemsSlice = {
    items: Item[];
    selectedItem?: Item;

    setItems: (items: Item[]) => void;
    setSelectedItem: (item: Item) => void;
}

const createAdminSlice: StateCreator<AdminSlice & ItemsSlice, [["zustand/devtools", never]], [], AdminSlice> = (set) => ({
    selectedCountry: '',
    setSelectedCountry: (country) => set(produce((state) => {
        state.selectedCountry = country;
    })),
    selectedCategory: '',
    setSelectedCategory: (category) => set(produce((state) => {
        state.selectedCategory = category;
    })),
    selectedItem: undefined,
    setSelectedItem: (item) => set(produce((state) => {
        state.selectedItem = item;
    }))
})

const createItemsSlice: StateCreator<AdminSlice & ItemsSlice, [["zustand/devtools", never]], [], ItemsSlice> = (set) => ({
    items: [],
    selectedItem: undefined,
    setItems: (items) => set(produce((state) => {
        state.items = items;
    })),
    setSelectedItem: (item) => set(produce((state) => {
        state.selectedItem = item;
    }))
})

export const useBoundStore = create<AdminSlice & ItemsSlice>((...a) => ({
    ...createAdminSlice(...a),
    ...createItemsSlice(...a),
}))