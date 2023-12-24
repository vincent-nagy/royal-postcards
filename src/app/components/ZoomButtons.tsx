"use client";

import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { useBoundStore } from "../store";

export default function ZoomButtons() {
  const baseWidth = useBoundStore((state) => state.baseWidth);
  const increaseBaseWidth = useBoundStore((state) => state.increaseBaseWidth);
  const decreaseBaseWidth = useBoundStore((state) => state.decreaseBaseWidth);

  return (
    <>
      <div id="zoom-in">
        <button className="bottom-button" onClick={increaseBaseWidth}>
          <FiZoomIn />
        </button>
      </div>
      <div id="zoom-out">
        <button className="bottom-button" onClick={decreaseBaseWidth}>
          <FiZoomOut />
        </button>
      </div>
      <style jsx>{`
        #zoom-in {
          position: fixed;
          bottom: 10px;
          right: 70px;
        }

        #zoom-out {
          position: fixed;
          bottom: 10px;
          right: 50px;
        }

        .bottom-button {
          background: none;
          color: inherit;
          border: none;
          padding: 0;
          font: inherit;
          cursor: pointer;
          outline: inherit;
        }
      `}</style>
    </>
  );
}
