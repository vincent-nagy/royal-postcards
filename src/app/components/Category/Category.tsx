"use client"

import Subcategory from "./Subcategory";

interface CategoryProps {
    items: Item[],
    categoryName?: string
}

const Category = ({ items, categoryName }: CategoryProps) => {
    const subcategories = [...new Set(items.map(item => item.subcategory))];

    return (
        <div className="categories">
            <h1>{categoryName}</h1>
            {subcategories?.map(subcategory => (
                <Subcategory key={subcategory ?? "Other"} items={items.filter(item => item.subcategory === subcategory)} title={subcategory ?? "Other"} />
            ))}
        </div>
    );
}

export default Category;