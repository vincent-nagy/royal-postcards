"use client";

import { useEffect, useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import ItemsApiService from "@/app/services/ItemsApiService";
import { FiTrash } from "react-icons/fi";
import UpdateItemModal from "./Modals/UpdateItemModal";
import UpdateSubcategoryOrderModal from "./Modals/UpdateSubcategoryOrderModal";
import { useBoundStore } from "@/app/store";
import { useDeleteItem, useGetItems } from "@/app/services/client/ItemsService";
import { ReactSortable } from "react-sortablejs";

export default function Manage() {
  const { data: items } = useGetItems();
  const deleteItem = useDeleteItem();

  const selectedCountry = useBoundStore((state) => state.selectedCountry);
  const selectedCategory = useBoundStore((state) => state.selectedCategory);
  const selectedItem = useBoundStore((state) => state.selectedItem);
  const setSelectedCountry = useBoundStore((state) => state.setSelectedCountry);
  const setSelectedCategory = useBoundStore(
    (state) => state.setSelectedCategory
  );
  const setSelectedItem = useBoundStore((state) => state.setSelectedItem);

  const [countries, setCountries] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isUpdateItemModalOpen, setIsUpdateItemModalOpen] = useState(false);
  const [
    isUpdateSubcategoryOrderModalOpen,
    setIsUpdateSubcategoryOrderModalOpen,
  ] = useState(false);

  useEffect(() => {
    if (items && items.length > 0) {
      const countries = [...new Set(items.map((item) => item.country))];
      setCountries(countries);
      if (selectedCountry === "") {
        setSelectedCountry(countries[0]);
      }
      if (selectedCategory === "") {
        setSelectedCategory(categories[0]);
      }
      updateFilteredItems();
    }
  }, [items]);

  useEffect(() => {
    setCategories([
      ...new Set(
        items
          ?.filter((item) => item.country === selectedCountry)
          .map((item) => item.category)
      ),
    ]);
  }, [selectedCountry]);

  useEffect(() => {
    setSelectedCategory(categories[0]);
  }, [categories]);

  useEffect(() => {
    updateFilteredItems();
  }, [selectedCategory]);

  const updateFilteredItems = () => {
    setFilteredItems(
      items
        ?.filter(
          (item) =>
            item.country === selectedCountry &&
            item.category === selectedCategory
        )
        .sort((a, b) => {
          if (a.order === undefined || b.order === undefined) {
            return 0;
          }
          return a.order > b.order ? 1 : -1;
        }) ?? []
    );
  };

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setFilteredItems((array) => arrayMoveImmutable(array, oldIndex, newIndex));
  };

  const updateSort = (items: Item[]) => {
    var order = 0;

    console.log(
      items.map((item) => {
        return { ...item, order: order++ };
      })
    );

    ItemsApiService.updateSort(
      items.map((item) => {
        return { ...item, order: order++ };
      })
    ).then((updatedSuccessfully) => {
      if (!updatedSuccessfully) {
        alert("Failed to update sort");
      } else {
        alert("Successfully updated sort");
      }
    });
  };

  const deleteItemOnClick = (id: string) => {
    if (confirm(`Are you sure you want to delete ${id}?`)) {
      deleteItem.mutate(id);
    }
  };

  return (
    <>
      <div>
        <h1>Manage</h1>
        <UpdateItemModal
          item={selectedItem}
          isOpen={isUpdateItemModalOpen}
          closeModal={() => setIsUpdateItemModalOpen(false)}
        />
        {selectedCountry && (
          <UpdateSubcategoryOrderModal
            isOpen={isUpdateSubcategoryOrderModalOpen}
            closeModal={() => setIsUpdateSubcategoryOrderModalOpen(false)}
          />
        )}
        <select
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
          }}
        >
          {countries?.map((country) => (
            <option value={country} key={country}>
              {country}
            </option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
          }}
        >
          {categories?.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
        <button onClick={() => updateSort(filteredItems)}>Save sorting</button>
        <button onClick={() => setIsUpdateSubcategoryOrderModalOpen(true)}>
          Update subcategory order
        </button>

        <div className="items">
          <div className="sort-list">
            {filteredItems && (
              <ReactSortable
                list={filteredItems.map((item) => ({ ...item, id: item._id }))}
                setList={setFilteredItems}
                style={{
                  display: "flex",
                  userSelect: "none",
                }}
              >
                {filteredItems.map((item) => (
                  <div
                    className="item sort-item"
                    key={item._id}
                    style={{
                      width:
                        item.layout === "horizontal" ? 10 * 2 + "%" : 10 + "%",
                      position: "relative",
                    }}
                    itemID={item._id}
                    onDoubleClick={() => {
                      setSelectedItem(item);
                      setIsUpdateItemModalOpen(true);
                    }}
                  >
                    <img
                      src={"/images/" + item.source}
                      alt={item.filename}
                      draggable={false}
                    />
                    <button
                      className="button-delete"
                      onClick={() => deleteItemOnClick(item._id)}
                    >
                      <FiTrash />
                    </button>
                  </div>
                ))}
              </ReactSortable>
            )}
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .sort-item {
            position: "relative";
            cursor: grab;
            user-select: none;
          }
          .sort-item img {
            cursor: grab;
          }
          .sort-list {
            display: "flex";
            flexwrap: "wrap";
            userselect: "none";
          }
          .sort-item-wrapper {
            display: contents;
            position: relative;
          }
          .button-delete {
            background: white;
            color: inherit;
            border: none;
            padding: 0;
            font: inherit;
            cursor: pointer;
            outline: inherit;
            position: absolute;
            top: 6px;
            right: 6px;
            height: 30px;
            width: 30px;
            border-bottom-left-radius: 10px;
          }
        `}
      </style>
    </>
  );
}
