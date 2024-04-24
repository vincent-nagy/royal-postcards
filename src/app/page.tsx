import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Royal postcards - Homepage",
  description:
    "Collection of royal postcards, this is the homepage of my collection of royal postcards",
};

export default function Home() {
  return (
    <>
      <div>
        <span className="emailContainer">If you are interested in Royal postcards you may contact me <a href="mailto:vanzwienen.karin@gmail.com">vanzwienen.karin@gmail.com</a></span>
      </div>
    </>
  );
}
