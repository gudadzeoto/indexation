import React, { useState } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/footer";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.scss";

function App() {
  const [language, setLanguage] = useState("GE");

  return (
    <ErrorBoundary language={language}>
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "var(--app-bg)", color: "var(--app-text)" }}
      >
        <div
          className="w-full flex justify-center"
          style={{ backgroundColor: "var(--app-bg)" }}
        >
          <div className="w-full max-w-[1200px] px-4 md:px-8">
            <Header
              language={language}
              setLanguage={setLanguage}
            />
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[1200px] px-4 md:px-8">
            <Main
              language={language}
              setLanguage={setLanguage}
            />
          </div>
        </div>
        <Footer language={language} setLanguage={setLanguage}></Footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
