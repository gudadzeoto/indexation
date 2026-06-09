import React from "react";

const Footer = ({ language = "GE" }) => {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full text-center text-sm text-gray-700 py-6 mt-auto app-footer">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-4 flex items-center justify-center gap-3">
          <a
            href="https://www.facebook.com/geostat.ge/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            title="Facebook"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1877F2] text-white shadow-[0_4px_14px_rgba(24,119,242,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#166fe0] hover:shadow-[0_8px_20px_rgba(24,119,242,0.45)]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M13.5 21v-7h2.3l.4-3h-2.7V9.2c0-.9.2-1.5 1.5-1.5H16V5.1c-.2 0-.9-.1-1.8-.1-2.8 0-4.2 1.5-4.2 4.2V11H8v3h2v7h3.5z" />
            </svg>
          </a>

          <a
            href="https://x.com/Geostat100"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            title="X"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f172a] text-white shadow-[0_4px_14px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_8px_20px_rgba(15,23,42,0.5)]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M18.9 3H22l-6.8 7.8L23.2 21h-6.3l-4.9-6.2L6.6 21H3.5l7.3-8.3L1.2 3h6.4l4.4 5.7L18.9 3zm-1.1 16h1.7L6.6 4.9H4.8L17.8 19z" />
            </svg>
          </a>
        </div>

        <p className="text-sm text-gray-600 leading-5 bpg_mrgvlovani_caps footer-text">
          {language === "GE"
            ? `© ${year} ყველა უფლება დაცულია.`
            : `© ${year} All rights reserved.`}
          <br />
          {language === "GE"
            ? "საქართველოს სტატისტიკის ეროვნული სამსახური (საქსტატი)"
            : "National Statistics Office of Georgia (Geostat)"}
          <br />
          <a
            href={
              language === "GE"
                ? "https://www.geostat.ge/ka/page/monacemta-gamoyenebis-pirobebi"
                : "https://www.geostat.ge/en/page/monacemta-gamoyenebis-pirobebi"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {language === "GE"
              ? "მონაცემთა გამოყენების პირობები"
              : "Terms of Use"}
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
