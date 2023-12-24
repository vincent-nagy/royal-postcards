import { StateCreator, create } from "zustand";
import { devtools } from "zustand/middleware";
import { produce } from "immer";

type AdminSlice = {
  selectedCountry: string;
  selectedCategory: string;
  selectedItem?: Item;

  setSelectedCountry: (country: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedItem: (item: Item) => void;
};

type ItemsSlice = {
  items: Item[];
  selectedItem?: Item;

  setItems: (items: Item[]) => void;
  setSelectedItem: (item: Item) => void;
};

type ConfigSlice = {
  baseWidth: number;
  increaseBaseWidth: () => void;
  decreaseBaseWidth: () => void;
};

const createAdminSlice: StateCreator<
  AdminSlice & ItemsSlice,
  [["zustand/devtools", never]],
  [],
  AdminSlice
> = (set) => ({
  selectedCountry: "",
  setSelectedCountry: (country) =>
    set(
      produce((state) => {
        state.selectedCountry = country;
      })
    ),
  selectedCategory: "",
  setSelectedCategory: (category) =>
    set(
      produce((state) => {
        state.selectedCategory = category;
      })
    ),
  selectedItem: undefined,
  setSelectedItem: (item) =>
    set(
      produce((state) => {
        state.selectedItem = item;
      })
    ),
});

const createItemsSlice: StateCreator<
  AdminSlice & ItemsSlice & ConfigSlice,
  [["zustand/devtools", never]],
  [],
  ItemsSlice
> = (set) => ({
  items: [],
  selectedItem: undefined,
  setItems: (items) =>
    set(
      produce((state) => {
        state.items = items;
      })
    ),
  setSelectedItem: (item) =>
    set(
      produce((state) => {
        state.selectedItem = item;
      })
    ),
});

const createConfigSlice: StateCreator<
  ConfigSlice & AdminSlice & ItemsSlice,
  [["zustand/devtools", never]],
  [],
  ConfigSlice
> = (set) => ({
  baseWidth: 20,
  increaseBaseWidth: () =>
    set(
      produce((state) => {
        if (state.baseWidth >= 100) {
          state.baseWidth = 100;
          return;
        }
        state.baseWidth += 10;
      })
    ),
  decreaseBaseWidth: () =>
    set(
      produce((state) => {
        if (state.baseWidth <= 10) {
          state.baseWidth = 10;
          return;
        }
        state.baseWidth -= 10;
      })
    ),
});

export const useBoundStore = create<AdminSlice & ItemsSlice & ConfigSlice>(
  (...a) => ({
    ...createAdminSlice(...a),
    ...createItemsSlice(...a),
    ...createConfigSlice(...a),
  })
);
