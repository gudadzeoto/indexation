import React, { useEffect, useState } from "react";
import InfoModal from "./InfoModal";
import infoLogo from "../assets/images/info.png";

const API_BASE = import.meta.env.VITE_API_BASE || "https://indexation-api.geostat.ge";

const QuestionForm = ({ questionNumber }) => {
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
      const normalizedCode = identCode.replace(/\D/g, "").trim();
      const res = await fetch(`${API_BASE}/personaltitle?code=${encodeURIComponent(normalizedCode)}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("NOT_FOUND");
        }

        const errorText = await res.text();
        throw new Error(errorText || "SERVER_ERROR");
      }
      const data = await res.json();
      if (!data || data.length === 0) throw new Error("NOT_FOUND");
      setCompanyData(data[0]);
    } catch (error) {
      if (error.message === "NOT_FOUND") {
        setSearchError("მსგავსი საწარმო ვერ მოიძებნა!");
      } else {
        setSearchError("სერვერმა ძებნა ვერ შეასრულა. გადაამოწმეთ კოდი ან სცადეთ თავიდან.");
      }
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
        <div className="mb-6 rounded-xl border border-[#d7e3ff] bg-[#f4f8ff] px-5 py-4">
          <p className="bpg_mrgvlovani_caps text-xs uppercase tracking-wide text-[#01389c]">
            კითხვარი {questionNumber}
          </p>
          <h1 className="bpg_mrgvlovani_caps mt-2 text-left text-[16px] font-bold text-[#0f172a]">
            გთხოვთ, მიუთითოთ შემდეგი ინფორმაცია:
          </h1>
        </div>

        <p className="bpg_mrgvlovani_caps mt-4">შეიყვანეთ თქვენი საწარმოს საიდენტიფიკაციო კოდი</p>

        <div className="mt-3 flex items-center gap-4">
          <div
            className="flex w-72 items-center overflow-hidden rounded-md transition-colors duration-300"
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
              className="bpg_mrgvlovani_caps flex-1 bg-transparent px-3 py-2 text-sm outline-none"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching}
              className="flex cursor-pointer items-center justify-center px-3 py-2 text-[#01389c] transition-colors hover:text-[#012d7a] disabled:opacity-50"
              aria-label="ძებნა"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </div>
          {searchError && <p className="bpg_mrgvlovani_caps text-sm text-red-600">{searchError}</p>}
        </div>
        {companyData && (
          <div className="bpg_mrgvlovani_caps mt-3 w-72 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
            <p><span className="font-semibold">დასახელება:</span> {companyData.Full_Name}</p>
          </div>
        )}

        <p className="bpg_mrgvlovani_caps mt-6">ხელშეკრულების ნომერი</p>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex w-72 items-center overflow-hidden rounded-md border border-gray-300">
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
          <div className="bpg_mrgvlovani_caps mt-3 w-72 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
            <p><span className="font-semibold">ნომერი:</span> {contractNumber}</p>
          </div>
        )}

        <p className="bpg_mrgvlovani_caps mt-6">დამკვეთი</p>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex w-72 items-center overflow-hidden rounded-md border border-gray-300">
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
          <div className="bpg_mrgvlovani_caps mt-3 w-72 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
            <p><span className="font-semibold">დამკვეთი:</span> {customer}</p>
          </div>
        )}

        <p className="bpg_mrgvlovani_caps mt-6 font-bold">1. საბაზო პერიოდი</p>
        <p className="bpg_mrgvlovani_caps mt-2 text-xs italic text-gray-600">
          პირველი პუნქტის მონიშვნის შემთხვევაში საბაზისოდ გამოიყენება 2022 წლის თებერვალი, ხოლო მე-2 პუნქტის შემთხვევაში - ტენდერის გახსნიდან 28 დღით ადრინდელი თარიღის შესაბამისი თვე (რაც არ შეიძლება, იყოს თებერვალზე ადრე).
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <label className={`flex items-start gap-3 ${isBasePeriodDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
            <input
              type="radio"
              name={`basePeriod-${questionNumber}`}
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
              name={`basePeriod-${questionNumber}`}
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

      <div className="flex w-full items-center justify-end gap-2 bg-[#01389c] px-4 py-4 text-right text-sm font-medium text-white">
        <span className="bpg_mrgvlovani_caps">გაანგარიშების ინსტრუქცია</span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex cursor-pointer items-center justify-center"
          aria-label="ინსტრუქციის გახსნა"
        >
          <img src={infoLogo} alt="info" className="h-5 w-5" />
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

export default QuestionForm;