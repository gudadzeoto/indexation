import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.scss";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div class="flex flex-col items-center p-7 rounded-2xl">
        <div>
          <img
            class="size-48 shadow-xl rounded-md"
            alt=""
            src="/img/cover.png"
          />
        </div>
        <div class="flex">
          <span>Class Warfare</span>
          <span>The Anti-Patterns</span>
          <span class="flex">
            <span>No. 4</span>
            <span>·</span>
            <span>2025</span>
          </span>
        </div>
      </div>
    </>
  );
}

export default App;
