"use client";

import ItemImage from "../ItemImage";

interface SubcategoryProps {
  items: Item[];
  title?: string;
}

const Subcategory = ({ items, title }: SubcategoryProps) => {
  return (
    <>
      <div className="subcategory">
        <h2>{title}</h2>
        <div className="items">
          {items
            ?.sort((a, b) => {
              if (a.order === undefined || b.order === undefined) {
                return 0;
              }
              return a.order > b.order ? 1 : -1;
            })
            .map((item) => (
              <ItemImage key={item._id} item={item} />
            ))}
        </div>
      </div>
      <style jsx>{`
        .subcategory {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </>
  );
};

export default Subcategory;
