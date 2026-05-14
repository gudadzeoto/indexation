import React from "react";
import sakstatLogoGe from "../assets/images/sakstat-logo.svg";
import sakstatLogoEn from "../assets/images/sakstat-logo-en.png";
import georgianFlag from "../assets/images/georgian-flag.svg";
import britishFlag from "../assets/images/british-flag.png";
import headerBg from "../assets/images/header-bg.jpg";
import processIcon from "../assets/images/process.png";
import compliantIcon from "../assets/images/compliant.png";
import constructionIcon from "../assets/images/construction.png";

const Header = ({
  language = "GE",
  setLanguage = () => {},
  activeQuestion = 1,
  setActiveQuestion = () => {},
}) => {
  const questionnaireButtons = [1, 2, 3];

  const toggleLanguage = () => {
    setLanguage(language === "GE" ? "EN" : "GE");
  };


  const fontClass = language === "GE" ? "bpg_mrgvlovani_caps" : "bpg_mrgvlovani_caps";

  return (
    <header
      className={`relative w-full flex justify-center ${fontClass}`}
      style={{
        backgroundImage: `url(${headerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "15px 15px 22px",
      }}
    >
      <div className="w-full max-w-[1200px] px-4 py-4 md:px-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        {/* Logo */}
          <div className="flex items-center justify-start">
            <a
              href="https://www.geostat.ge/ka"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Home"
            >
              <img
                src={language === "GE" ? sakstatLogoGe : sakstatLogoEn}
                alt="Logo"
                className="h-[52px] transition-transform duration-300 hover:scale-105 md:h-[72px]"
              />
            </a>
          </div>

        {/* Title */}
          <div className="flex-1">
            <h1
              className="bpg_mrgvlovani_caps text-center text-[20px] text-white"
              id="titletext"
              tabIndex={0}
            >
              {language === "GE"
                ? "ფასთა ინდექსაციის კალკულატორი"
                : "Price indexation calculator"}
            </h1>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {questionnaireButtons.map((questionNumber) => {
                const isActive = activeQuestion === questionNumber;

                return (
                  <button
                    key={questionNumber}
                    type="button"
                    onClick={() => setActiveQuestion(questionNumber)}
                    className={`bpg_mrgvlovani_caps rounded-full border px-5 py-2 text-sm transition-all duration-300 ${
                      isActive
                        ? "border-white bg-white text-[#01389c] shadow-lg"
                        : "border-white/70 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {`კითხვარი ${questionNumber}`}
                  </button>
                );
              })}
            </div>
          </div>

        {/* Icons & Language Switch */}
          <div className="flex items-center justify-end gap-3 self-end xl:mr-[38px] xl:mt-7">
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Test icon 1"
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-white bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <img src={processIcon} alt="test-1" className="h-5 w-5 md:h-6 md:w-6" />
            </a>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Test icon 2"
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-white bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <img src={compliantIcon} alt="test-2" className="h-5 w-5 md:h-6 md:w-6" />
            </a>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Test icon 3"
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-white bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <img src={constructionIcon} alt="test-3" className="h-5 w-5 md:h-6 md:w-6" />
            </a>

          {/* Language toggle */}
            <div>
              <button
                onClick={toggleLanguage}
                className="period-select flex cursor-pointer items-center gap-2 rounded-md bg-white/90 px-4 py-2.5 transition-all duration-300 hover:bg-white"
              >
                <span className="language-toggle cursor-pointer text-sm font-medium text-gray-700 md:text-base">
                  {language === "GE" ? "English" : "ქართული"}
                </span>
                <img
                  src={language === "GE" ? britishFlag : georgianFlag}
                  alt="flag"
                  className="h-6 w-6 md:h-7 md:w-7"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
