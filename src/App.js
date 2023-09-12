import { Routes, Route, Link } from "react-router-dom";
import Home from "./Pages/Home"
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Home/>}/>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </div>
  );
}

export default App;
