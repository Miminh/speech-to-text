/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

const Button = (props) => {
  const {
    buttonType = "primary",
    label = " ",
    onClick = () => {},
    classes = "",
    disabled = false,
  } = props;
  const buttonColor =
    buttonType === "primary"
      ? "bg-green-800"
      : buttonType === "danger"
      ? "bg-red-500"
      : "bg-orange-300";
  return (
    <button
      className={"p-3 " + buttonColor + " " + classes}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

const sendAudioData = async (data) => {
  try {
    const resp = await axios.post("http://localhost:5000/transcribe", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return resp.data;
  } catch (err) {
    throw new Error(err);
  }
};

function App() {
  const [currText, setCurrText] = useState("");
  const [processing, setProcesing] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(false);

  const mediaRecorder = useRef(null);
  let chunks = useRef([]);

  const onStartClick = () => {
    console.log("Starting recording");
    setError(false);
    setListening(true);
    mediaRecorder.current.start();
  };

  const onStopClick = () => {
    console.log("Stopping recording");
    setListening(false);
    mediaRecorder.current.requestData();
    mediaRecorder.current.stop();
  };

  const onProcessClick = async () => {
    try {
      setProcesing(true);
      const blob = new Blob(chunks.current, { type: "audio/ogg; codecs=opus" });
      const formData = new FormData();
      formData.append("audio", blob);
      const data = await sendAudioData(formData);
      chunks.current = [];
      setCurrText(data.transcription);
    } catch (err) {
      console.log(err);
    }
    setProcesing(false);
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          mediaRecorder.current = new MediaRecorder(stream);
          mediaRecorder.current.ondataavailable = (event) => {
            chunks.current.push(event.data);
          };
        })
        .catch((err) => {
          setError(true);
          console.log(err);
        });
    } else {
      console.log("getUserMedia not supported");
    }
  }, []);

  return (
    <main className="p-5">
      <div className="grid grid-cols-2 grid-rows-2  items-center w-[300px] h-[150px]">
        <Button buttonType={"primary"} label="Start" onClick={onStartClick} />
        <Button buttonType={"danger"} label="Stop" onClick={onStopClick} />
        <Button
          buttonType={"warning"}
          label="Process"
          onClick={onProcessClick}
          classes={"col-span-2"}
        />
      </div>
      {!listening && !processing && (
        <div
          className={`w-[300px] h-52 bg-white p-3 rounded-md text-black text-left ${
            !currText ? "flex items-center justify-center" : ""
          }`}
        >
          {currText
            ? currText
            : chunks.current.length > 0
            ? "Start processing by clicking on processing"
            : "Start recording by Clicking on start"}
        </div>
      )}
      {listening && <div>Listening....</div>}
      {processing && <div>Processing....</div>}
      {error && <div className="text-red-500">Some Error Occured</div>}
    </main>
  );
}

export default App;
