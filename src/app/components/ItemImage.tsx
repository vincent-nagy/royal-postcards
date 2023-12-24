"use client";

import ModalImage from "react-modal-image";
import { useBoundStore } from "../store";

type ItemImageProps = {
  item: Item;
};

const ItemImage = ({ item }: ItemImageProps) => {
  const baseWidth = useBoundStore((state) => state.baseWidth);

  return (
    <>
      <div
        className="item"
        key={item._id}
        style={{
          width:
            item.layout === "horizontal"
              ? baseWidth * 2 + "%"
              : baseWidth + "%",
        }}
        itemID={item._id}
      >
        <ModalImage
          large={"/images/" + item.source}
          small={"/images/" + item.source}
          alt={item.filename}
          hideDownload={true}
          draggable={false}
        />
      </div>
    </>
  );
};

export default ItemImage;
