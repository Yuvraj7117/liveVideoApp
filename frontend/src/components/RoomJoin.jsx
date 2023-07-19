/*eslint-disable*/

const RoomJoin = ({ info, setInfo ,socket, peerIdNo,setMetaData,myPeer,peerId}) => {
    
  const handleChange = (e) => {
    const { name, value } = e.target; 
    setInfo({ ...info, [name]: value });  
  };
  // console.log(peerId)
  const joinToRoom = (peerId,info) => { 
   
    const { name, roomId } = info;
     setMetaData([info])
    socket.emit("joinRoom", { peerId, name, roomId });
    // console.log(streamId) 
    // if (!otherName) {
      
    //   setInterval(() => {
    //     statusRef.current.innerHTML = " statusRef";
    //   }, 0);
    // }
   
    
    // setInfo({ name: "", roomId: "" });
    //  let conn = myPeer.connect(peerId);
    //  conn.on("open", () => {
    //    conn.send("Niranjan");
    //  });
  //   console.log("peerId"+peerId)
  //   var conn = myPeer.connect(peerId);
  //   conn.send("Niranjan")
  //  console.log(conn)


    setInfo({name: "", roomId: ""});
  }; 
  
  return ( 
    <>
      <h5 style={{ display: "flex", justifyContent: "center",marginBlock:"15px" ,color:"blue"}}>
        Please Join in A Room
      </h5>
      <div style={{ display: "flex" }}>
        <div
          className="d-flex justify-content-around w-50 "
          style={{ marginLeft: "25%" }}
        >
          <input
            className="text-success"
            name="name"
            value={info.name}
            placeholder="Enter You Name"
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <input
            className="text-success"
            name="roomId"
            value={info.roomId}
            placeholder="Enter Room Id"
            onChange={(e) => {
              handleChange(e); 
            }}
          />
          <button
            className="btn btn-outline-primary"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => {
              joinToRoom(peerIdNo, info);
            }}
          >
            Join Room
          </button>
        </div>
      </div>
    </>
  );
};

//  RoomJoin.propTypes = { info, setInfo ,socket, peerId,setMetaData :PropTypes.Object.isRequired,}

export default RoomJoin