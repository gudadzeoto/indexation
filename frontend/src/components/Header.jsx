import React from "react";
import sakstatLogoGe from "../assets/images/sakstat-logo.svg";
import sakstatLogoEn from "../assets/images/sakstat-logo-en.png";
import georgianFlag from "../assets/images/georgian-flag.svg";
import britishFlag from "../assets/images/british-flag.png";
import headerBg from "../assets/images/header-bg.jpg";
import processIcon from "../assets/images/process.png";
import compliantIcon from "../assets/images/compliant.png";
import constructionIcon from "../assets/images/construction.png";

const Header = ({ language = "GE", setLanguage = () => {} }) => {

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
        padding: "15px",
      }}
    >
      <div className="w-full max-w-[1200px] flex items-center justify-between px-4 md:px-8 py-4">
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
              className="h-[52px] md:h-[72px] hover:scale-105 transition-transform duration-300"
            />
          </a>
        </div>

        {/* Title */}
        <h1
          className="text-center text-white text-[20px] bpg_mrgvlovani_caps"
          id="titletext"
          tabIndex={0}
        >
          {language === "GE"
            ? "ფასთა ინდექსაციის კალკულატორი"
            : "Price indexation calculator"}
        </h1>

        {/* Icons & Language Switch */}
        <div className="flex items-center justify-end gap-3 mr-[38px] mt-7">
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Test icon 1"
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-white bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <img src={processIcon} alt="test-1" className="w-5 h-5 md:w-6 md:h-6" />
          </a>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Test icon 2"
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-white bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <img src={compliantIcon} alt="test-2" className="w-5 h-5 md:w-6 md:h-6" />
          </a>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Test icon 3"
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-white bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <img src={constructionIcon} alt="test-3" className="w-5 h-5 md:w-6 md:h-6" />
          </a>

          {/* Language toggle */}
          <div>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 bg-white/90 hover:bg-white px-4 py-2.5 rounded-md transition-all duration-300 cursor-pointer period-select"
            >
              <span className="text-gray-700 text-sm md:text-base font-medium cursor-pointer language-toggle">
                {language === "GE" ? "English" : "ქართული"}
              </span>
              <img
                src={language === "GE" ? britishFlag : georgianFlag}
                alt="flag"
                className="w-6 h-6 md:w-7 md:h-7"
              />
            </button>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
