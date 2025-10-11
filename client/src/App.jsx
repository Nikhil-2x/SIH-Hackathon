import React from "react";
import Mudra from "./Mudra";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import DefaultLayout from "./layouts/DefaultLayout";

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
