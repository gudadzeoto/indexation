import React from "react";
import {
  buildQuestionnaireDocumentContent,
  printQuestionnaireDocument,
} from "./questionnaireDocumentUtils";

const DocumentGenerationModal = ({
  isOpen,
  onClose,
  language = "GE",
  questionnaireType,
  data,
}) => {
  if (!isOpen) return null;

  const t = (ge, en) => (language === "GE" ? ge : en);
  const content = buildQuestionnaireDocumentContent({
    language,
    questionnaireType,
    data,
  });
  const showMoneyColumn = content?.showMoneyColumn !== false;

  if (!content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-5xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="bpg_mrgvlovani_caps text-lg font-bold text-[#01389c]">
            {content.title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                printQuestionnaireDocument({ language, questionnaireType, data })
              }
              className="bpg_mrgvlovani_caps rounded-md border border-[#01389c] px-3 py-1 text-sm text-[#01389c] hover:bg-[#01389c] hover:text-white cursor-pointer"
            >
              {t("ბეჭდვა", "Print")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bpg_mrgvlovani_caps rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
            >
              {t("დახურვა", "Close")}
            </button>
          </div>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-4">
          <p className="bpg_mrgvlovani_caps text-sm leading-6 text-gray-800">
            - {content.description}
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-[#01389c] text-white">
                  <th className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-2 text-center">
                    {content.tableHeaders.number}
                  </th>
                  <th className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-2 text-center">
                    {content.tableHeaders.year}
                  </th>
                  <th className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-2 text-center">
                    {content.tableHeaders.month}
                  </th>
                  <th className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-2 text-center">
                    {content.tableHeaders.day}
                  </th>
                  <th className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-2 text-center">
                    {content.tableHeaders.cost}
                  </th>
                  {showMoneyColumn && (
                    <th className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-2 text-center">
                      {content.tableHeaders.money}
                    </th>
                  )}
                  <th className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-2 text-center">
                    {content.tableHeaders.index}
                  </th>
                  <th className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-2 text-center">
                    {content.tableHeaders.result}
                  </th>
                </tr>
              </thead>
              <tbody>
                {content.tableRows.map((row) => (
                  <tr key={`doc-row-${row.id}`} className="bg-white even:bg-[#f7faff]">
                    <td className="border border-gray-300 px-2 py-1.5 text-center">{row.id}</td>
                    <td className="border border-gray-300 px-2 py-1.5 text-center">{row.year}</td>
                    <td className="border border-gray-300 px-2 py-1.5 text-center">{row.month}</td>
                    <td className="border border-gray-300 px-2 py-1.5 text-center">{row.day}</td>
                    <td className="border border-gray-300 px-2 py-1.5 text-right">{row.cost}</td>
                    {showMoneyColumn && (
                      <td className="border border-gray-300 px-2 py-1.5 text-right">{row.money}</td>
                    )}
                    <td className="border border-gray-300 px-2 py-1.5 text-right">{row.index}</td>
                    <td className="border border-gray-300 px-2 py-1.5 text-right">{row.result}</td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan={showMoneyColumn ? 7 : 6}
                    className="bpg_mrgvlovani_caps border border-gray-300 px-2 py-2 text-right font-bold"
                  >
                    {content.tableHeaders.total}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-right font-bold text-[#01389c]">
                    {content.rowTotal}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {content.notes?.length > 0 && (
            <div className="mt-3 space-y-1">
              {content.notes.map((note, index) => (
                <p
                  key={`doc-note-${index}`}
                  className="bpg_mrgvlovani_caps text-xs font-bold text-gray-700"
                >
                  {note}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerationModal;
