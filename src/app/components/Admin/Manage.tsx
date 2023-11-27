"use client";

import { useEffect, useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import ItemsApiService from "@/app/services/ItemsApiService";

type SortProps = {
    items: Item[]
}

export default function Manage({ items }: SortProps) {
    const countries = [...new Set(items?.map(item => item.country))]

    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>(countries[0]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [itemsToBeDeleted, setItemsToBeDeleted] = useState<Set<string>>(new Set());

    useEffect(() => {
        setCategories([...new Set(items?.filter(item => item.country === selectedCountry).map(item => item.category))]);
    }, [selectedCountry])

    useEffect(() => {
        setSelectedCategory(categories[0]);
    }, [categories])

    useEffect(() => {
        setFilteredItems(items?.filter(item => item.country === selectedCountry && item.category === selectedCategory).sort((a, b) => {
            if (a.order === undefined || b.order === undefined) {
                return 0;
            }
            return a.order > b.order ? 1 : -1;
        }));
    }, [selectedCategory])

    const onSortEnd = (oldIndex: number, newIndex: number) => {
        setFilteredItems((array) => arrayMoveImmutable(array, oldIndex, newIndex));
    }

    const updateSort = (items: Item[]) => {
        var order = 0;
        ItemsApiService.updateSort(items.map(item => {
            item.order = order++;
            return item;
        }));
    }

    const deleteItems = () => {
        confirm(`Are you sure you want to delete ${itemsToBeDeleted.size} items?`)
        //&& ItemsApiService.deleteItems(filteredItems.map(item => item.id));


        console.log(itemsToBeDeleted);
    }

    return (
        <div>
            <h1>Manage</h1>
            <select
                value={selectedCountry}
                onChange={(e) => {
                    setSelectedCountry(e.target.value);
                }}
            >
                {countries?.map(country => (
                    <option value={country} key={country}>{country}</option>
                ))}
            </select>
            <select
                value={selectedCategory}
                onChange={(e) => {
                    setSelectedCategory(e.target.value);
                }}
            >
                {categories?.map(category => (
                    <option value={category} key={category}>{category}</option>
                ))}
            </select>
            <button onClick={() => updateSort(filteredItems)}>Save sorting</button>
            <button onClick={deleteItems} style={{ backgroundColor: "red", marginLeft: "100px" }}>Delete selected items</button>
            <div className="items">
                <SortableList
                    onSortEnd={onSortEnd}
                    className="sort-list"
                    draggedItemClassName="sort-dragged-item"
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        userSelect: "none",
                    }}
                >
                    {filteredItems?.map(item => (
                        <SortableItem key={item.id}>
                            <div className="item sort-item" key={item.id} style={{ width: item.layout === "horizontal" ? 10 * 2 + "%" : 10 + "%", position: "relative" }} itemID={item.id}>
                                <img src={"/images/" + item.source} alt={item.filename} draggable={false} />
                                <input type="checkbox" id={item.id} style={{ position: "absolute", top: 7, right: 7, height: "30px", width: "30px" }} value={item.id}
                                    onChange={(event) => {
                                        if (event.target.checked) {
                                            setItemsToBeDeleted(itemsToBeDeleted.add(item.id));
                                        } else {
                                            itemsToBeDeleted.delete(item.id);
                                            setItemsToBeDeleted(itemsToBeDeleted);
                                        }
                                    }} />
                            </div>
                        </SortableItem>
                    ))}
                </SortableList>
            </div>
        </div>
    );
}