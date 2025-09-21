import UpdateRoomPage from "../update-delete/page";

export default function UpdateRoom(props: any) {
  const roomId = Number(props.params.id);

  return (
    <div>
      <UpdateRoomPage roomId={roomId} />
    </div>
  );
}
