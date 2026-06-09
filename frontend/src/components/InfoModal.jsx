import React, { useEffect } from "react";
import InfoModalInstructionContent from "./InfoModalInstructionContent";

const InfoModal = ({ isOpen, onClose, language, questionnaireType = "questionnaire1" }) => {
  const handlePrint = () => {
    // Create a new hidden iframe
    const printFrame = document.createElement("iframe");
    printFrame.style.position = "absolute";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";
    document.body.appendChild(printFrame);

    // Get the content to print
    const contentToPrint = document
      .getElementById("modal-content")
      .cloneNode(true);

    // Remove the buttons from the clone
    const buttons = contentToPrint.querySelectorAll("button, .print\\:hidden");
    buttons.forEach((button) => button.remove());

    // Write the content to the iframe
    const frameDoc = printFrame.contentWindow.document;
    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${
            language === "GE" ? "სამომხმარებლო ფასების ინდექსის კალკულატორი" : "Consumer Price Index Calculator"
          }</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            p { margin-bottom: 1em; line-height: 1.5; }
            .font-bold { font-weight: bold; }
            .mt-4 { margin-top: 1.5em; }
            a { color: #2563eb; text-decoration: underline; }
          </style>
        </head>
        <body>
          ${contentToPrint.innerHTML}
        </body>
      </html>
    `);
    frameDoc.close();

    // Print and remove the iframe
    printFrame.contentWindow.onafterprint = () => {
      document.body.removeChild(printFrame);
    };

    printFrame.contentWindow.print();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (event.target.classList.contains("modal-backdrop")) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div id="modal-content">
          <div className="border-b p-4 flex justify-between items-center">
            <h5 className="text-xl font-bold bpg_mrgvlovani_caps">
              {language === "GE"
                ? "როგორ მუშაობს ფასთა ინდექსაციის კალკულატორი"
                : "How does the Price Indexation Calculator work"}
            </h5>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl print:hidden cursor-pointer font-bpg-nino"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="p-6 bpg_mrgvlovani_caps">
            <InfoModalInstructionContent language={language} questionnaireType={questionnaireType} />
          </div>
          <div className="border-t p-4 flex justify-end gap-2 print:hidden">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-bpg-nino cursor-pointer"
              onClick={handlePrint}
            >
              {language === "GE" ? "ბეჭდვა" : "Print"}
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-bpg-nino cursor-pointer"
              onClick={onClose}
            >
              {language === "GE" ? "დახურვა" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
