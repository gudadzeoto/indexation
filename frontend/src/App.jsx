import React, { useState } from "react";
import Header from "./components/Header";
import QuestionOne from "./components/QuestionOne";
import QuestionTwo from "./components/QuestionTwo";
import QuestionThree from "./components/QuestionThree";
import Footer from "./components/footer";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.scss";

function App() {
  const [language, setLanguage] = useState("GE");
  const [activeQuestion, setActiveQuestion] = useState(1);

  const renderQuestionnaire = () => {
    if (activeQuestion === 2) {
      return <QuestionTwo language={language} />;
    }

    if (activeQuestion === 3) {
      return <QuestionThree language={language} />;
    }

    return <QuestionOne language={language} />;
  };

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
          <div className="w-full max-w-[1200px]">
            <Header
              language={language}
              setLanguage={setLanguage}
              activeQuestion={activeQuestion}
              setActiveQuestion={setActiveQuestion}
            />
          </div>
        </div>
        <div className="w-full flex justify-center" style={{ marginTop: 0 }}>
          <div className="w-full max-w-[1200px]">
            {renderQuestionnaire()}
          </div>
        </div>
        <Footer language={language} setLanguage={setLanguage}></Footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
