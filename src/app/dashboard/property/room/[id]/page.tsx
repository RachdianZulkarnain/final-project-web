import UpdateRoomPage from "../update-delete/page";

export default function UpdateRoom(props: any) {
  const roomId = Number(props.params.id); // params.id selalu string

  return (
    <div>
      <UpdateRoomPage roomId={roomId} />
    </div>
  );
}
