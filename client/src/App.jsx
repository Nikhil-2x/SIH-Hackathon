import React from "react";
import Mudra from "./Mudra";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

const App = () => {
  return (
    <div>
      {/* <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/dashboard" element={<Mudra />} />
      </Routes> */}
      <Mudra />
    </div>
  );
};

export default App;
