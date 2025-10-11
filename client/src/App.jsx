import React from "react";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import DefaultLayout from "./layouts/DefaultLayout";
import Mudra from "./pages/Mudra";

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
      </Routes>
      {/* <Mudra /> */}
    </div>
  );
};

export default App;
