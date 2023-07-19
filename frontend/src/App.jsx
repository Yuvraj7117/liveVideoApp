import RoomJoin from "./components/RoomJoin";
import Video from "./components/Video";
import "./App.css";
import { useEffect, useState} from "react";
import { io } from "socket.io-client";
import { Peer } from "peerjs";
// import { v4 } from "uuid";

const socket = io("https://livevideoapp.onrender.com");
function App() {
  const [info, setInfo] = useState({ name: "", roomId: "" });
  const [metaData, setMetaData] = useState([]);
  // const [peerSocketId, setPeerSocketId] = useState(" ");
  const [id, setId] = useState("");
  const [streamId, setStreamId] = useState("");
  const [otherName, setOtherName] = useState([]);
  const [peerId, setPeerId] = useState(" ");

  // const statusRef = useRef("");
 
  const myPeer = new Peer();
  // const randomId = v4().slice(29);
  

  useEffect(() => { 
    myPeer.on("open", (id) => {
      setId(id);
     
        
    }); 

 
  }, []);

  return (
    <>
      {streamId === "" ? (
        <RoomJoin
          info={info}
          setInfo={setInfo}
          socket={socket}
          peerIdNo={id}
          metaData={metaData}
          setMetaData={setMetaData} 
          myPeer={myPeer}
          setPeerId={setPeerId}
          peerId={peerId}
          
        />
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h3 className="text-success">
            You Now Connected to Room {metaData[0]?.roomId}
          </h3>
        </div>
      )}
      <Video
        socket={socket}
        myPeer={myPeer}
        info={info}
        peerIdNo={id}
        metaData={metaData}
        // peerSocketId={peerSocketId}
        // setPeerSocketId={setPeerSocketId}
        peerId={peerId}
        setPeerId={setPeerId}
        streamId={setStreamId}
        setStreamId={setStreamId}
        // statusRef={statusRef}
        otherName={otherName}
        setOtherName={setOtherName}
        // randomId={randomId}
      />
    </>
  );
}

export default App;
