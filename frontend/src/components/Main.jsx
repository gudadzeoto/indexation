import React, { useEffect, useState } from "react";
import InfoModal from "./InfoModal";
import infoLogo from "../assets/images/info.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5002/api";

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [identCode, setIdentCode] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  const [contractNumber, setContractNumber] = useState("");
  const [customer, setCustomer] = useState("");
  const [basePeriod, setBasePeriod] = useState("");

  const handleSearch = async () => {
    if (!identCode) return;
    setSearching(true);
    setSearchError("");
    setCompanyData(null);
    try {
      const res = await fetch(`${API_BASE}/personaltitle?code=${encodeURIComponent(identCode)}`);
      if (!res.ok) throw new Error("not found");
      const data = await res.json();
      if (!data || data.length === 0) throw new Error("not found");
      setCompanyData(data[0]);
    } catch {
      setSearchError("მსგავსი საწარმო ვერ მოიძებნა!");
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const isBasePeriodDisabled = !companyData || !contractNumber.trim() || !customer.trim();

  useEffect(() => {
    if (isBasePeriodDisabled && basePeriod) {
      setBasePeriod("");
    }
  }, [isBasePeriodDisabled, basePeriod]);

  return (
    <section className="w-full border" style={{ borderColor: "#01389c" }}>
      <div className="px-50 py-6">
        <h1 className="bpg_mrgvlovani_caps" style={{ fontWeight: "bold", fontSize: "16px", textAlign: "left" }}>
          გთხოვთ, მიუთითოთ შემდეგი ინფორმაცია:
        </h1>
        <p className="bpg_mrgvlovani_caps mt-4">შეიყვანეთ თქვენი საწარმოს საიდენტიფიკაციო კოდი</p>

        {/* Search input */}
        <div className="flex items-center gap-4 mt-3">
          <div
            className="flex items-center rounded-md overflow-hidden w-72 transition-colors duration-300"
            style={{
              border: searchError ? "1px solid #ef4444" : companyData ? "1px solid #22c55e" : "1px solid #d1d5db",
              backgroundColor: searchError ? "#fef2f2" : companyData ? "#f0fdf4" : "transparent",
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              value={identCode}
              onChange={(e) => setIdentCode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={handleKeyDown}
              placeholder="საიდენტიფიკაციო კოდი"
              className="bpg_mrgvlovani_caps flex-1 px-3 py-2 text-sm outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching}
              className="flex items-center justify-center px-3 py-2 text-[#01389c] hover:text-[#012d7a] transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="ძებნა"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </div>
          {searchError && (
            <p className="bpg_mrgvlovani_caps text-red-600 text-sm">{searchError}</p>
          )}
        </div>
        {companyData && (
          <div className="mt-3 p-3 border border-gray-200 rounded-md bg-gray-50 text-sm bpg_mrgvlovani_caps w-72">
            <p><span className="font-semibold">დასახელება:</span> {companyData.Full_Name}</p>
          </div>
        )}

        {/* ხელშეკრულების ნომერი */}
        <p className="bpg_mrgvlovani_caps mt-6">ხელშეკრულების ნომერი</p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-72">
            <input
              type="text"
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
              placeholder="ხელშეკრულების ნომერი"
              className="bpg_mrgvlovani_caps flex-1 px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>
        {contractNumber && (
          <div className="mt-3 p-3 border border-gray-200 rounded-md bg-gray-50 text-sm bpg_mrgvlovani_caps w-72">
            <p><span className="font-semibold">ნომერი:</span> {contractNumber}</p>
          </div>
        )}

        {/* დამკვეთი */}
        <p className="bpg_mrgvlovani_caps mt-6">დამკვეთი</p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-72">
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="დამკვეთი"
              className="bpg_mrgvlovani_caps flex-1 px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>
        {customer && (
          <div className="mt-3 p-3 border border-gray-200 rounded-md bg-gray-50 text-sm bpg_mrgvlovani_caps w-72">
            <p><span className="font-semibold">დამკვეთი:</span> {customer}</p>
          </div>
        )}

        {/* საბაზო პერიოდი */}
        <p className="bpg_mrgvlovani_caps mt-6 font-bold">1. საბაზო პერიოდი</p>
        <p className="bpg_mrgvlovani_caps mt-2 text-xs italic text-gray-600">
          პირველი პუნქტის მონიშვნის შემთხვევაში საბაზისოდ გამოიყენება 2022 წლის თებერვალი, ხოლო მე-2 პუნქტის შემთხვევაში - ტენდერის გახსნიდან 28 დღით ადრინდელი თარიღის შესაბამისი თვე (რაც არ შეიძლება, იყოს თებერვალზე ადრე).
        </p>
        <div className="flex flex-col gap-3 mt-4">
          <label className={`flex items-start gap-3 ${isBasePeriodDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
            <input
              type="radio"
              name="basePeriod"
              value="1"
              checked={basePeriod === "1"}
              onChange={(e) => setBasePeriod(e.target.value)}
              disabled={isBasePeriodDisabled}
              className={`mt-1 accent-[#01389c] ${isBasePeriodDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
            />
            <span className="bpg_mrgvlovani_caps text-sm">მიმდინარე ხელშეკრულების ფარგლებში-2022 წლის 1 აპრილიდან შესრულებული და შემდგომში ანაზღაურებული სამუშაოები</span>
          </label>
          <label className={`flex items-start gap-3 ${isBasePeriodDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
            <input
              type="radio"
              name="basePeriod"
              value="2"
              checked={basePeriod === "2"}
              onChange={(e) => setBasePeriod(e.target.value)}
              disabled={isBasePeriodDisabled}
              className={`mt-1 accent-[#01389c] ${isBasePeriodDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
            />
            <span className="bpg_mrgvlovani_caps text-sm">მიმდინარე * და 2022 წლის 1 მაისამდე გამოცხადებული ტენდერების ფარგლებში შესრულებული და შემდგომში ანაზღაურებული სამუშაოები</span>
          </label>
        </div>
      </div>

      <div className="bg-[#01389c] text-white text-right px-4 py-4 text-sm font-medium flex items-center justify-end gap-2 w-full">
        <span className="bpg_mrgvlovani_caps">
          გაანგარიშების ინსტრუქცია
        </span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center cursor-pointer"
          aria-label="ინსტრუქციის გახსნა"
        >
          <img src={infoLogo} alt="info" className="w-5 h-5" />
        </button>
      </div>

      <InfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language="GE"
      />
    </section>
  );
};

export default Main;
