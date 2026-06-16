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
  const questionnaireButtons = [
    {
      id: 1,
      labelGe: "განკარგულება N753",
      labelEn: "Decree N753",
    },
    {
      id: 2,
      labelGe: "დადგენილება N245 გარდამავალი",
      labelEn: "Resolution N245 Transitional",
    },
    {
      id: 3,
      labelGe: "დადგენილება N245 მუდმივი",
      labelEn: "Resolution N245 Permanent",
    },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "GE" ? "EN" : "GE");
  };

  const fontClass =
    language === "GE" ? "bpg_mrgvlovani_caps" : "bpg_mrgvlovani_caps";

  const iconTitles = {
    methodology:
      language === "GE"
        ? "მშენებლობის ღირებულების ინდექსის გაანგარიშების მეთოდოლოგია"
        : "Construction Cost Index Calculation Methodology",
    decree753:
      language === "GE"
        ? "„საქართველოს მთავრობის განკარგულება №753“"
        : '"Decree of the Government of Georgia No. 753"',
    decree245:
      language === "GE"
        ? "„საქართველოს მთავრობის განკარგულება №245“"
        : '"Decree of the Government of Georgia No. 245"',
    timeSeries:
      language === "GE"
        ? "მშენებლობის ღირებულების ინდექსის დროითი მწრკივები"
        : "Construction Cost Index Time Series",
  };

  return (
    <header
      className={`relative w-full flex justify-center ${fontClass}`}
      style={{
        backgroundImage: `url(${headerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "12px 12px 18px",
      }}
    >
      <div className="w-full py-3 md:py-4">
        <div className="flex flex-col gap-5 lg:gap-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {/* Logo */}
            <div className="flex items-center justify-center sm:justify-start">
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

            {/* Icons & Language Switch */}
            <div className="flex w-full flex-wrap items-center justify-center gap-2 self-center sm:gap-3 md:justify-end xl:w-auto">
              <a
                href={
                  language === "GE"
                    ? "https://www.geostat.ge/media/80128/CCI_Methodology_GE.html"
                    : "https://www.geostat.ge/media/80171/CCI_Methodology_ENG.html"
                }
                target="_blank"
                rel="noopener noreferrer"
                title={iconTitles.methodology}
                aria-label="Test icon 1"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-white bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:h-10 sm:w-10"
              >
                <img
                  src={processIcon}
                  alt="test-1"
                  className="h-5 w-5 md:h-6 md:w-6"
                />
              </a>
              <a
                href={
                  activeQuestion === 2 || activeQuestion === 3
                    ? "https://matsne.gov.ge/ka/document/download/6883523/0/ge/pdf"
                    : "https://matsne.gov.ge/ka/document/view/5458532?publication=0"
                }
                target="_blank"
                rel="noopener noreferrer"
                title={
                  activeQuestion === 2 || activeQuestion === 3
                    ? iconTitles.decree245
                    : iconTitles.decree753
                }
                aria-label="Test icon 2"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-white bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:h-10 sm:w-10"
              >
                <img
                  src={compliantIcon}
                  alt="test-2"
                  className="h-5 w-5 md:h-6 md:w-6"
                />
              </a>
              <a
                href="https://www.geostat.ge/ka/modules/categories/655/msheneblobis-ghirebulebis-indeksi"
                target="_blank"
                rel="noopener noreferrer"
                title={iconTitles.timeSeries}
                aria-label="Test icon 3"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-white bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:h-10 sm:w-10"
              >
                <img
                  src={constructionIcon}
                  alt="test-3"
                  className="h-5 w-5 md:h-6 md:w-6"
                />
              </a>

              {/* Language toggle */}
              <div>
                <button
                  onClick={toggleLanguage}
                  className="period-select flex cursor-pointer items-center gap-2 rounded-md bg-white/90 px-3 py-2 transition-all duration-300 hover:bg-white sm:px-4 sm:py-2.5"
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

          {/* Title */}
          <div className="mx-auto w-full max-w-4xl">
            <h1
              className="bpg_mrgvlovani_caps text-center text-[18px] leading-snug text-white sm:text-[20px] xl:text-[24px]"
              id="titletext"
              tabIndex={0}
            >
              {language === "GE"
                ? "ფასთა ინდექსაციის კალკულატორი"
                : "Price indexation calculator"}
            </h1>

            <div className="mt-4 rounded-2xl border border-white/35 bg-black/20 p-2 backdrop-blur-[2px]">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {questionnaireButtons.map((question) => {
                const isActive = activeQuestion === question.id;

                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setActiveQuestion(question.id)}
                    className={`group bpg_mrgvlovani_caps flex w-full cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                      isActive
                        ? "border-white bg-white text-[#01389c] shadow-lg"
                        : "border-white/60 bg-white/5 text-white hover:bg-white/15"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isActive
                          ? "bg-[#01389c] text-white"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {question.id}
                    </span>
                    <span className="leading-tight">
                      {language === "GE" ? question.labelGe : question.labelEn}
                    </span>
                  </button>
                );
              })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
