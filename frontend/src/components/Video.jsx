/*eslint-disable*/

import { useEffect, useState, useRef } from "react";
import {
  BsMicMuteFill,
  BsMic,
  BsCameraVideo,
  BsCameraVideoOff,
} from "react-icons/bs";

const Video = ({ socket, myPeer, metaData, setStreamId, streamId,setOtherName,peerId,setPeerId,otherName}) => {
  
  const [mute, setMute] = useState(false);
  const [screen, setScreen] = useState(true);
  const [peers, setPeers] = useState([]);
  const [firstUser,setFirstUser] = useState("")
  const [videoStreamArray, setVideoStreamArray] = useState([]);
  const myVideo = useRef(null);
  const remoteVideo = useRef([]);
  const isMounted = useRef(false);
  const [nameArr,setNameArr] = useState([])

  useEffect(() => {
    //  history.pushState(null, "roomId:", randomId);
     socket.on("name", (user) => {
       setFirstUser(user)
     }); 

    if (!isMounted.current) {
      isMounted.current = true;
      async function initiateStream() {
        let streamVideo = await getStream();
        myVideo.current.srcObject = streamVideo;
      }
      initiateStream();
     
      socket.on("joined", (data) => { 
        const { peerId, name } = data; 
        console.log("secondUser" + name)
        
        setOtherName(prev=>[...prev,name]);
        setPeerId(peerId);
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            const call = myPeer.call(peerId, stream,{metadata:{userName:name}});
            console.log(call.peer)
            
            let peersList = JSON.parse(JSON.stringify(peers));
            // let nameList = JSON.parse(JSON.stringify(nameArr));
            call.on("stream", (remoteStream) => {
              if (!peersList.includes(peerId)) {
                peersList.push(peerId);
                setPeers(peersList);
                // nameList.push(name)
                // setNameArr(nameList);

                setStreamId(remoteStream.id);
                setVideoStreamArray((prev) => [...prev, remoteStream]);
                setNameArr(prev=>[...prev,call.metadata.userName])

                // console.log(call.peer)
                // console.log(call);
              }
            });  

  
            //  let conn = myPeer.connect(peerId);
            // conn.on("open", () => {
            //   conn.send({name:"", id:peerId});
            //  });
          }); 
       
      }); 

      if (peerId) {
        myPeer.on("call", (call) => {
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
              call.answer(stream);
            });
          let peersList = JSON.parse(JSON.stringify(peers));
          call.on("stream", (remoteStream) => {
          
            if (!peersList.includes(call.peer)) {
              peersList.push(call.peer);
              setPeers(peersList);
              setStreamId(remoteStream.id);
              setVideoStreamArray((prev) => [...prev, remoteStream]);
              setNameArr(prev => [...prev, call.metadata.userName]);
              // console.log(call._remoteStream);
            }
            
            // let conn = myPeer.connect(call.peer);
            // conn.on("open", () => {
            //   conn.send({ name:"", id:call.peer });
            // });
          });
        });
      }
    }
      // myPeer.on("connection", (conn) => {
      //   conn.on("data", (data) => {
      //      const {name,id} = data
      //     if (id) {
      //                 if (id === conn.peer) {
      //                   console.log(name)
      //                 }
      //                 else if (myPeer.id !== conn.peer) {
      //                   console.log(name)
      //                   console.log(myPeer.id);
      //                  }
      //     }

      //   });
      // });
  }, []);

  useEffect(() => {
    if (videoStreamArray && videoStreamArray.length > 0) {
      videoStreamArray.map((stream, index) => {
        remoteVideo.current[index].srcObject = stream;
      });
    }
  }, [videoStreamArray]);

  const getStream = () => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((streams) => {
          resolve(streams);
        });
    });
  };

  function stopVideo() {
    let tracks = myVideo.current.srcObject.getVideoTracks();
 

    if (tracks[0].readyState == "live" && tracks[0].kind == "video") {
      // tracks[0].enabled = false;
      !myVideo.current.srcObject.getTracks()[0].enabled;
      tracks.forEach((track) => {
       
        track.stop();

        setScreen(false);
      });
    } else if (tracks[0].readyState == "ended" && tracks[0].kind == "video") {
      setScreen(true);
    myVideo.current.srcObject.getTracks()[0].enabled
      // tracks[0].enabled = true;
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          myVideo.current.srcObject = stream;
        });
    }
  }

  const toggleAudio = () => {
    let audioTrack = myVideo.current.srcObject.getTracks().find((track) => track.kind === "audio");

    if (audioTrack.enabled) {
      audioTrack.enabled = false;
      setMute(true);

    } else {
      audioTrack.enabled = true;
      setMute(false);
    }

  
  };

 
  return (
    <div className="container-fluid mt-4">
      {/* <p ref={statusRef}></p> */}
      <div className="row w-100 d-flex ">
        <div className="col-3  ">
          <div className="card">
            <div className="card-header">
              {metaData[0]?.name ? (
                <h5>{`You: ${firstUser}`}</h5>
              ) : (
                <h5>You:</h5>
              )}
            </div>
            <video ref={myVideo} autoPlay></video>
            {streamId && (
              <div
                style={{
                  position: "absolute",
                  bottom: "15px",
                  marginBottom: " 5px",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  width: "300px",
                  zIndex: 2,
                }}
              >
                <button
                  className={`rounded-circle fs-4 ${
                    !mute ? "bg bg-danger" : "bg bg-success"
                  }`}
                  onClick={() => {
                    toggleAudio();
                    // myVideo.current.srcObject.getTracks()[0].enabled =
                    //   !myVideo.current.srcObject.getTracks()[0].enabled;
                    // audioFun(myVideo.current.srcObject.getTracks()[0].enabled);
                  }}
                >
                  {!mute ? <BsMicMuteFill /> : <BsMic />}
                </button>
                <button
                  className={`rounded-circle fs-4 ${
                    !screen ? "bg bg-danger" : "bg bg-success"
                  }`}
                  onClick={() => {
                    // myVideo.current.srcObject.getTracks()[1].enabled =
                    //   !myVideo.current.srcObject.getTracks()[1].enabled
                    //  console.log(myVideo.current.srcObject.getTracks()[1])

                    // videoFun(myVideo.current.srcObject.getVideoTracks()[0]);
                    stopVideo();
                  }}
                >
                  {screen ? <BsCameraVideo /> : <BsCameraVideoOff />}
                </button>
              </div>
            )}
          </div>
        </div>

        {videoStreamArray.map((videoStream, i) => {
          return (
            <div className="col-3 " key={i}>
              <div className="card ">
                <div className="card-header">{otherName[i]} </div>

                <video
                  ref={(element) => {
                    remoteVideo.current[i] = element;
                  }}
                  autoPlay
                ></video>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Video;
