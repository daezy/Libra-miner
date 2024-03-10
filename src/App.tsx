import React, { useState } from "react";

import "./App.css";
import LibraMiner from "./components/LibraMiner";

function App() {
  return (
    <>
      <section>
        <div className="container mx-auto px-4 ">
          <LibraMiner />
        </div>
      </section>
    </>
  );
}

export default App;
