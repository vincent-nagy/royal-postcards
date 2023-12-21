import ZoomButtons from "@/app/components/ZoomButtons";
import CategoryHolder from "@/app/components/Category/CategoryHolder";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { countryName: string };
}): Promise<Metadata> {
  const { countryName } = params;
  return {
    title: `Royal postcards - Country - ${countryName}`,
    description: `Collection of royal postcards for ${countryName}`,
  };
}

export default async function Page({
  params,
}: {
  params: { countryName: string };
}) {
  return (
    <>
      <>
        <div className="country">
          <CategoryHolder country={params.countryName} />
          <ZoomButtons />
        </div>
      </>
    </>
  );
}
