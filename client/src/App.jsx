import React from "react";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import DefaultLayout from "./layouts/DefaultLayout";
import Mudra from "./pages/Mudra";
import About from "./pages/About";

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <DefaultLayout>
              <Home />
            </DefaultLayout>
          }
        />

        <Route path="/dashboard" element={<Mudra />} />
        <Route
          path="/about"
          element={
            <DefaultLayout>
              <About />
            </DefaultLayout>
          }
        />
      </Routes>
      {/* <Mudra /> */}
    </div>
  );
};

export default App;
