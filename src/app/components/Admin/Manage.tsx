"use client";

import { useEffect, useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import ItemsApiService from "@/app/services/ItemsApiService";
import { FiTrash } from "react-icons/fi";
import UpdateItemModal from "./Modals/UpdateItemModal";
import { useDeleteItemMutation, useFetchItemsQuery } from "@/app/services/client/ItemsService";


export default function Manage() {
    const { data: items } = useFetchItemsQuery();
    const [deleteItemMutation] = useDeleteItemMutation();

    // const countries = [...new Set(items?.map(item => item.country))]
    const [countries, setCountries] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [modalItem, setModalItem] = useState<Item>();

    useEffect(() => {
        if (items && items.length > 0) {
            const countries = [...new Set(items.map(item => item.country))];
            setCountries(countries);
            if (selectedCountry === "" || selectedCountry === undefined) {
                setSelectedCountry(countries[0]);
            }
            if (selectedCategory === "" || selectedCategory === undefined) {
                setSelectedCategory(categories[0]);
            }
        }
    }, [items]);

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
        }) ?? []);
    }, [selectedCategory])

    const onSortEnd = (oldIndex: number, newIndex: number) => {
        setFilteredItems((array) => arrayMoveImmutable(array, oldIndex, newIndex));
    }

    const updateSort = (items: Item[]) => {
        var order = 0;

        console.log(items.map(item => {
            return { ...item, order: order++ };
        }));

        ItemsApiService.updateSort(items.map(item => {
            return { ...item, order: order++ };
        })).then(updatedSuccessfully => {
            if (!updatedSuccessfully) {
                alert("Failed to update sort");
            } else {
                alert("Successfully updated sort");
            }
        })
    }

    const deleteItem = (id: string) => {
        if (confirm(`Are you sure you want to delete ${id}?`)) {
            // ItemsApiService.deleteItem(id).then(deletedSuccessfully => {
            //     if (!deletedSuccessfully) {
            //         alert("Failed to delete item");
            //     } else {
            //         setFilteredItems(filteredItems.filter(item => item._id !== id));
            //     }
            // });
            deleteItemMutation(id)
                .unwrap()
                .then(() => {
                    setFilteredItems(filteredItems.filter(item => item._id !== id));
                }).catch(() => {
                    alert("Failed to delete item");
                })
        }
    }

    const openUpdateItemModal = (item: Item) => {
        console.log("Setting modalItem", item);
        setModalItem(item);
    }

    return (
        <div>
            <h1>Manage</h1>
            <UpdateItemModal item={modalItem} closeModal={() => setModalItem(undefined)} />
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
                        <SortableItem key={item._id}>
                            <div className="item sort-item"
                                key={item._id}
                                style={{ width: item.layout === "horizontal" ? 10 * 2 + "%" : 10 + "%", position: "relative" }}
                                itemID={item._id}
                                onDoubleClick={() => {
                                    openUpdateItemModal(item);
                                }}
                            >
                                <img src={"/images/" + item.source} alt={item.filename} draggable={false} />
                                <button className="button-delete" onClick={() => deleteItem(item._id)}><FiTrash /></button>
                            </div>
                        </SortableItem>
                    ))}
                </SortableList>
            </div>
        </div>
    );
}