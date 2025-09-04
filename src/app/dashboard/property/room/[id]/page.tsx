import UpdateRoomPage from "../update-delete/page";

const UpdateRoom = ({ params }: { params: { id: number } }) => {
  return (
    <div>
      <UpdateRoomPage roomId={params.id} />
    </div>
  );
};

export default UpdateRoom;
