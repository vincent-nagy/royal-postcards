import ZoomButtons from "@/app/components/ZoomButtons";
import CategoryHolder from "@/app/components/Category/CategoryHolder";

export default async function Page({ params }: { params: { countryName: string } }) {
    return (<>
        <>
            <div className="country">
                <CategoryHolder country={params.countryName} />
                <ZoomButtons />
            </div >
        </>
    </>);
}