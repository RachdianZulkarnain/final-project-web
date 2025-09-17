import UpdatePropertyPage from "../../update/page";

// pakai any biar aman, karena Next.js generate types-nya kadang bikin konflik
export default function UpdateProperty({ params }: any) {
  return (
    <div>
      <UpdatePropertyPage propertyId={Number(params.id)} />
    </div>
  );
}
