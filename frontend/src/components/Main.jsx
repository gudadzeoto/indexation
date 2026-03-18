import React, { useState, useEffect, useRef, useCallback } from "react";
import InfoModal from "./InfoModal";
import infoLogo from "../assets/images/info.png";

const Main = ({ language = "GE" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="w-full mt-auto">
      <div className="mt-6 bg-[#01389c] text-white text-right px-4 py-4 text-sm font-medium flex items-center justify-end gap-2 w-full mb-4">
        <span className="bpg_mrgvlovani_caps">
          {language === "GE"
            ? "გაანგარიშების ინსტრუქცია"
            : "Calculation instruction"}
        </span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center cursor-pointer"
          aria-label={language === "GE" ? "ინსტრუქციის გახსნა" : "Open instructions"}
        >
          <img src={infoLogo} alt="info" className="w-5 h-5" />
        </button>
      </div>

      <InfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={language}
      />
    </section>
  );
};

export default Main;
