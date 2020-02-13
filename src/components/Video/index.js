import React, { useState, useMemo, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";

const Video = ({ src, onChange = () => {} }) => {
  const classes = useStyles();
  const videoRef = useRef();
  const chunks = useRef([]);
  const [{ url, type }, setState] = useState({
    url: src,
    type: "recording" // recording | upload
  });
  const [status, setStatus] = useState("stop");

  const [VideoController, setVideoController] = useState(null);

  const initCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    videoRef.current.srcObject = stream;
    videoRef.current.muted = true;
    videoRef.current.play();
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = function(e) {
      console.log("push");
      chunks.current.push(e.data);
    };
    return {
      stream,
      mediaRecorder
    };
  };
  const _handleClickPlay = async () => {
    let { mediaRecorder } = VideoController;
    if (!(videoRef.current && videoRef.current.srcObject)) {
      const { mediaRecorder: m, stream } = await initCamera();
      mediaRecorder = m;
      setVideoController({ mediaRecorder: m, stream });
    }
    mediaRecorder.start(1000);
    setStatus("recording");
  };
  const _handleClickStop = async () => {
    const { mediaRecorder } = VideoController;
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: chunks.current[0].type });
      const url = URL.createObjectURL(blob);
      let stream = videoRef.current.srcObject;
      let tracks = stream.getTracks();

      tracks.forEach(function(track) {
        track.stop();
      });

      videoRef.current.srcObject = null;
      onChange({ url, chunks: chunks.current });
      chunks.current = [];
      setStatus("stop");
    };
  };
  useEffect(() => {
    const main = async () => {
      const { stream, mediaRecorder } = await initCamera();
      setVideoController({
        stream,
        mediaRecorder
      });
    };
    main();
  }, []);

  useEffect(() => {
    setState({ url: src });
  }, [src]);

  console.log(url);

  return (
    <div className={classes.container}>
      <video src={url} ref={videoRef} className={classes.video} autoPlay />

      <div className={classes.layer}>
        {status === "stop" ? (
          <div onClick={_handleClickPlay}>play</div>
        ) : (
          <div onClick={_handleClickStop}>stop</div>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    height: 600,
    width: 800,
    backgroundColor: "red"
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "black"
  },
  layer: {
    transform: "translateY(calc( -100%))",
    width: "100%",
    height: "100%"
    // backgroundColor: "green"
  }
}));

export default Video;
