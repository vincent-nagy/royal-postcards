import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Royal postcards - Not found",
  description: "Collection of royal postcards, this page does not exist",
};

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
