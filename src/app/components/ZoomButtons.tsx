"use client"

import { useState } from "react";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { useBaseWidthContext } from "../context/BaseWidth";

export default function ZoomButtons() {
    const { baseWidth, setBaseWidth } = useBaseWidthContext();

    return (
        <>
            <div id="zoom-in">
                <button className="bottom-button" onClick={() => setBaseWidth(baseWidth >= 10 ? baseWidth + 10 : 10)}><FiZoomIn /></button>
            </div>
            <div id="zoom-out" >
                <button className="bottom-button" onClick={() => setBaseWidth(baseWidth > 10 ? baseWidth - 10 : 5)}><FiZoomOut /></button>
            </div>
        </>
    );
}