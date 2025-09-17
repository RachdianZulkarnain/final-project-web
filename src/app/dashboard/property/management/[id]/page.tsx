import UpdatePropertyPage from "../../update/page";

export default function UpdateProperty({ params }: any) {
  return (
    <div>
      <UpdatePropertyPage propertyId={Number(params.id)} />
    </div>
  );
}
