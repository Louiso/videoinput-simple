import React, { useState } from "react";
import "./App.css";
import Video from "./components/Video";

function App() {
  const [url, setUrl] = useState("");
  const _handleChange = ({ url }) => {
    console.log("TCL: _handleChange -> url", url);
    setUrl(url);
  };
  return (
    <div className="App">
      <Video src={url} onChange={_handleChange} />
    </div>
  );
}

export default App;
