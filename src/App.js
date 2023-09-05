import { Routes, Route, Link } from "react-router-dom";
import Home from "./Pages/Home"
import Register from "./Pages/Register";
import Login from "./Pages/Login";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/" element={<Login/>}/>
      </Routes>
    </div>
  );
}

export default App;
