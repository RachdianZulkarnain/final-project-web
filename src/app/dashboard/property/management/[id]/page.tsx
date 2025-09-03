import UpdatePropertyPage from "../../update/page";

const UpdateProperty = ({ params }: { params: { id: number } }) => {
  return (
    <div>
      <UpdatePropertyPage propertyId={params.id} />
    </div>
  );
};

export default UpdateProperty;
