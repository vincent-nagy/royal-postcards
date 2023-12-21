"use client";

import { Dispatch, SetStateAction } from "react";

interface SubNavbarProps {
  categories: string[];
  currentCategory: string;
  setCurrentCategory: Dispatch<SetStateAction<string>>;
}

export default function SubNavbar({
  categories,
  currentCategory,
  setCurrentCategory,
}: SubNavbarProps) {
  return (
    <>
      <div className="sub-navbar">
        {categories?.map((category) => (
          <div
            key={category}
            onClick={() => setCurrentCategory(category)}
            className="sub-navbar-item"
            style={{
              backgroundColor: currentCategory === category ? "#b30000" : "",
            }}
          >
            {category}
          </div>
        ))}
      </div>

      <style jsx>{`
        .sub-navbar {
          display: flex;
          flex-direction: row;
          width: 100%;
          box-sizing: border-box;
          color: var(--color3);
          background-color: white;
          overflow: hidden;
        }

        .sub-navbar-item {
          text-decoration: none;
          color: var(--color5);
          font-size: 1rem;
          list-style: none;
          display: inline-block;
          text-decoration: none;
          padding-right: 5px;
          padding-left: 15px;
          padding: 5px 5px 5px 5px;
          margin: 0px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
