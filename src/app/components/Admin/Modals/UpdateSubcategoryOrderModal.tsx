"use client";

import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useBoundStore } from "@/app/store";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import ItemsService from "@/app/services/client/ItemsService";


type UpdateSubcategoryOrderModalProps = {
    closeModal: () => void;
    isOpen: boolean;
}

const UpdateSubcategoryOrderModal = ({ closeModal, isOpen }: UpdateSubcategoryOrderModalProps) => {
    const useUpdateItem = ItemsService.useUpdateItem();

    const selectedCountry = useBoundStore(state => state.selectedCountry);
    const selectedCategory = useBoundStore(state => state.selectedCategory);

    const { data } = ItemsService.useGetItemsByCountryCategory(selectedCountry, selectedCategory);

    const [subcategories, setSubcategories] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen && data && selectedCountry !== "" && selectedCategory !== "") {
            let items = data.slice().sort((a, b) => {
                if (a.subcategoryOrder === undefined || b.subcategoryOrder === undefined) {
                    return 0;
                }
                return a.subcategoryOrder > b.subcategoryOrder ? 1 : -1;
            });

            const uniqueItems = Array.from(new Map(items.map(item => ({ subcategory: item.subcategory, subcategoryOrder: item.subcategoryOrder }))
                .map(item => [item.subcategory, item.subcategoryOrder])).keys());
            setSubcategories(uniqueItems);
        }
    }, [isOpen, data]);

    const onSortEnd = (oldIndex: number, newIndex: number) => {
        console.log("Old Index", oldIndex, "New Index", newIndex);
        setSubcategories((array) => arrayMoveImmutable(array, oldIndex, newIndex));
    }

    const updateSort = () => {
        var order = 0;

        const subcategoryOrders = subcategories.map(subcategory => {
            return { subcategory, order: order++ };
        });

        console.log("Subcategory Orders", subcategoryOrders)

        if (!data) return;
        let filteredItems = data.filter(item => item.country === selectedCountry && item.category === selectedCategory);
        filteredItems = filteredItems.map(item => {
            return { ...item, subcategoryOrder: subcategoryOrders.find(so => so.subcategory === item.subcategory)?.order };
        })

        console.log("Filtered Items ", filteredItems);
        filteredItems.forEach(item => {
            useUpdateItem.mutate(item);
        })
    }

    return (
        <>
            <Modal closeModal={closeModal} isOpen={isOpen}>
                <h2>Update subcategory order</h2>
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
                        {subcategories?.map(subcategory => (
                            <SortableItem key={subcategory}>
                                <div className="subcategory" key={subcategory}>
                                    {subcategory === "" ? "NO SUBCATEGORY" : subcategory}{""}
                                </div>
                            </SortableItem>
                        ))}
                    </SortableList>
                    <button onClick={updateSort}>Save sorting</button>
                </div>
            </Modal>
            <style jsx>{`
                .subcategory {
                    width: 100%;
                    padding: 5px;
                    margin: 5px 0;
                    text-align: center;
                    border: 1px solid black;
                }
                .sort-dragged-item {
                    opacity: 0.5;
                    border: 2px solid black;
                    z-index: 1;
                }
                `}
            </style>
        </>
    );
}

export default UpdateSubcategoryOrderModal;