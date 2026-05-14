import React, { useState } from "react";
import DocumentGenerationModal from "./DocumentGenerationModal";
import docs from "../assets/images/google-docs.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5002/api";

const QuestionTwoDocumentGeneration = ({
  language = "GE",
  confirmed,
  onConfirmedChange,
  workType,
  companyData,
  identCode,
  contractNumber,
  customer,
  tableRows,
  rowTotal,
  baseMonthForDoc,
}) => {
  const t = (ge, en) => (language === "GE" ? ge : en);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const isRadio1 = workType === "1";

  const handleGenerateDocument = async () => {
    try {
      const res = await fetch(`${API_BASE}/report1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractnum: contractNumber,
          customer,
          Legal_Code: identCode,
          Full_Name: companyData?.Full_Name || "",
          rows: tableRows.map((row) => ({
            year: row.year,
            month: row.month,
            day: row.day,
            cost: row.cost,
            money: isRadio1 ? null : row.money || row.cost,
            index: row.pn ? 0 : row.index,
            pn: row.pn || null,
            result: row.result,
          })),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Report insert error:", err);
      }
    } catch (err) {
      console.error("Report insert fetch error:", err);
    }
    setIsDocModalOpen(true);
  };

  return (
    <>
      <div className="mt-4">
        <label className="flex cursor-pointer items-start gap-2 sm:items-center">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => onConfirmedChange(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-[#01389c]"
          />
          <span className="bpg_mrgvlovani_caps text-sm">
            {t(
              "ვადასტურებ და პასუხისმგებლობას ვიღებ ჩემს მიერ შევსებული ინფორმაციის სისწორეზე",
              "I confirm and take responsibility on the correctness of the information filled above",
            )}
          </span>
        </label>

        <button
          type="button"
          onClick={handleGenerateDocument}
          disabled={!confirmed}
          className="bpg_mrgvlovani_caps mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#01389c] px-4 py-2 text-sm font-semibold text-[#01389c] transition-colors hover:bg-[#01389c] hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent cursor-pointer sm:w-auto"
        >
          <img src={docs} alt="google docs" className="h-5 w-5" />
          {t("დოკუმენტის დაგენერირება", "Generate document")}
        </button>
      </div>

      <DocumentGenerationModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        language={language}
        questionnaireType="questionnaire2"
        data={{
          companyName: companyData?.Full_Name || "",
          identCode,
          contractNumber,
          customer,
          workType,
          createdAt: new Date().toISOString(),
          documentSequence: "-",
          basePeriodText: baseMonthForDoc || t("არ არის არჩეული", "Not selected"),
          tableRows,
          rowTotal,
        }}
      />
    </>
  );
};

export default QuestionTwoDocumentGeneration;
