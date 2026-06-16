import printHeaderGeo from "../assets/images/print-header-geo.png";
import printHeaderEng from "../assets/images/print-header-eng.png";
import printFooterGeo from "../assets/images/print-footer-geo.png";
import printFooterEng from "../assets/images/print-footer-eng.png";

const monthsGe = {
  1: "იანვარი",
  2: "თებერვალი",
  3: "მარტი",
  4: "აპრილი",
  5: "მაისი",
  6: "ივნისი",
  7: "ივლისი",
  8: "აგვისტო",
  9: "სექტემბერი",
  10: "ოქტომბერი",
  11: "ნოემბერი",
  12: "დეკემბერი",
};

const monthsEn = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getTranslator = (language) => (ge, en) => (language === "GE" ? ge : en);

const FIRST_PAGE_ROW_LIMIT = 16;
const FOLLOWING_PAGE_ROW_LIMIT = 28;
const LAST_PAGE_ROW_TARGET = 20;

const formatDate = (language, dateValue) => {
  const date = dateValue ? new Date(dateValue) : new Date();
  const locale = language === "GE" ? "ka-GE" : "en-US";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export const buildQuestionnaireDocumentContent = ({
  language = "GE",
  questionnaireType,
  data,
}) => {
  const t = getTranslator(language);
  const monthNames = language === "GE" ? monthsGe : monthsEn;
  const questionnaire2DecreeNumber = "245";

  const getMonthLabel = (monthValue) => {
    const monthNumber = Number(monthValue);
    return monthNames[monthNumber] || monthValue || "-";
  };

  const configs = {
    questionnaire1: {
      title: t("ფასთა ინდექსაციის კალკულატორი", "Price Indexation Calculator"),
      description: t(
        `გაცნობებთ, რომ საქართველოს მთავრობის #753 განკარგულებით განსაზღვრული ფასთა ინდექსაციის გამოყენების საფუძვლების, პრინციპებისა და წესის თანახმად, თქვენს მიერ შევსებულ ინფორმაციაზე დაყრდნობით (საბაზო პერიოდი - ${data.basePeriodText}; ხელშეკრულების ფარგლებში 2022 წლის 1 მარტის მდგომარეობით შესრულებულია ${data.workCompletionText}) ფასთა ინდექსაციის კალკულატორის გამოყენებით მიღებული თანხები შეადგენს:`,
        `Please be informed that according to the basics, principles and rules of using the price indexation, defined by the #753 decree of the Government of Georgia, based on the filled information (base period - ${data.basePeriodText}; Completed work status as of March 1, 2022 - ${data.workCompletionText}), the reimbursement amount in certain periods amounted to:`,
      ),
    },
    questionnaire2: {
      title: t("ფასთა ინდექსაციის კალკულატორი", "Price Indexation Calculator"),
      description: t(
        `გაცნობებთ, რომ საქართველოს მთავრობის #${questionnaire2DecreeNumber} დადგენილებით განსაზღვრული ფასთა ინდექსაციის გამოყენების საფუძვლების, პრინციპებისა და წესის თანახმად, თქვენს მიერ შევსებულ ინფორმაციაზე დაყრდნობით (საბაზო პერიოდი - ${data.basePeriodText}) ფასთა ინდექსაციის კალკულატორის გამოყენებით მიღებული თანხები შეადგენს:`,
        `Please be informed that according to the basics, principles and rules of using the price indexation defined by the #${questionnaire2DecreeNumber} decree of the Government of Georgia, based on the filled information (base period - ${data.basePeriodText}), the reimbursement amount in certain periods amounted to:`,
      ),
    },
    questionnaire3: {
      title: t("ფასთა ინდექსაციის კალკულატორი", "Price Indexation Calculator"),
      description: t(
        `გაცნობებთ, რომ საქართველოს მთავრობის #245 დადგენილებით განსაზღვრული ფასთა ინდექსაციის გამოყენების საფუძვლების, პრინციპებისა და წესის თანახმად, თქვენს მიერ შევსებულ ინფორმაციაზე დაყრდნობით (საბაზო პერიოდი - ${data.basePeriodText}) ფასთა ინდექსაციის კალკულატორის გამოყენებით მიღებული თანხები შეადგენს:`,
        `Please be informed that according to the basics, principles and rules of using the price indexation defined by the #245 decree of the Government of Georgia, based on the filled information (base period - ${data.basePeriodText}), the reimbursement amount in certain periods amounted to:`,
      ),
    },
  };

  const cfg = configs[questionnaireType];
  if (!cfg) return null;

  const isQuestionnaire2Radio2 =
    questionnaireType === "questionnaire2" && data.workType === "2";

  return {
    title: cfg.title,
    description: cfg.description,
    showMoneyColumn:
      questionnaireType === "questionnaire2"
        ? isQuestionnaire2Radio2
        : true,
    headerImage: language === "GE" ? printHeaderGeo : printHeaderEng,
    footerImage: language === "GE" ? printFooterGeo : printFooterEng,
    meta: {
      createdAtLabel: t("დოკუმენტის შექმნის თარიღი", "Date of document creation:"),
      createdAtValue: formatDate(language, data.createdAt),
      sequenceLabel: t("#", "#"),
      sequenceValue: data.documentSequence || "-",
      companyNameLabel: t("დასახელება", "Name"),
      companyNameValue: data.companyName || "-",
      identCodeLabel: t("საიდენტიფიკაციო კოდი", "Identification code"),
      identCodeValue: data.identCode || "-",
      contractNumberLabel: t("ხელშეკრულების ნომერი", "Contract number"),
      contractNumberValue: data.contractNumber || "-",
      customerLabel: t("დამკვეთი", "Ordering party"),
      customerValue: data.customer || "-",
    },
    tableHeaders: {
      number: "N",
      workPeriod: t(
        "სამუშაოს დასრულების პერიოდი",
        "End period of the work performed",
      ),
      year: t("წელი", "Year"),
      month: t("თვე", "Month"),
      day: t("რიცხვი", "Date"),
      cost: t(
        "შესრულებული სამუშაოს ღირებულება, ლარი",
        "Cost of work performed, GEL",
      ),
      money: t("საინდექსაციო თანხა, ლარი", "Indexation amount, GEL"),
      index:
        questionnaireType === "questionnaire2"
          ? isQuestionnaire2Radio2
            ? t(
                "მშენებლობის ღირებულების ინდექსი საბაზო პერიოდთან შედარებით",
                "Construction Cost Index compared to the base period",
              )
            : t("PN", "PN")
          : t(
              "მშენებლობის ღირებულების ინდექსი საბაზო პერიოდთან შედარებით",
              "Construction Cost Index compared to the base period",
            ),
      result: t(
        "ფასთა ინდექსაციის შედეგად მიღებული თანხა, ლარი",
        "Reimbursement amount, GEL",
      ),
      total: t("სულ", "Total"),
    },
    notes: [
      t(
        "* მიმწოდებელი პასუხისმგებელია მის მიერ შეყვანილი ინფორმაციის სისწორეზე.",
        "** The supplier is responsible for the accuracy of the entered data.",
      ),
      t(
        "** შემსყიდველი ვალდებულია ანგარიშსწორებამდე გადაამოწმოს მიმწოდებლის მიერ შევსებული მონაცემების სისწორე",
        "** The purchaser is obligated to verify the accuracy of the data provided by the supplier before the reimbursement verify the accuracy of the data entered by the supplier before settlement.",
      ),
    ],
    tableRows: (data.tableRows || []).map((row) => ({
      id: row.id,
      year: row.year || "-",
      month: getMonthLabel(row.month),
      day: row.day || "-",
      cost: row.cost || "-",
      money: row.money || "-",
      index:
        questionnaireType === "questionnaire2"
          ? isQuestionnaire2Radio2
            ? row.index || "-"
            : row.pn || "-"
          : row.index || "-",
      result: row.result || "-",
    })),
    rowTotal: data.rowTotal || "0.00",
  };
};

export const printQuestionnaireDocument = ({
  language = "GE",
  questionnaireType,
  data,
}) => {
  const content = buildQuestionnaireDocumentContent({
    language,
    questionnaireType,
    data,
  });

  if (!content) return false;
  const showMoneyColumn = content.showMoneyColumn !== false;

  const printWindow = window.open("", "_blank", "width=860,height=1180");
  if (!printWindow) return false;

  const paginateRows = (rows) => {
    if (rows.length <= FIRST_PAGE_ROW_LIMIT) {
      return [rows];
    }

    const pages = [];
    const remainingRows = [...rows];

    pages.push(remainingRows.splice(0, FIRST_PAGE_ROW_LIMIT));

    while (
      remainingRows.length >
      FOLLOWING_PAGE_ROW_LIMIT + LAST_PAGE_ROW_TARGET
    ) {
      pages.push(remainingRows.splice(0, FOLLOWING_PAGE_ROW_LIMIT));
    }

    if (remainingRows.length > LAST_PAGE_ROW_TARGET) {
      const balancedCount = Math.min(
        FOLLOWING_PAGE_ROW_LIMIT,
        Math.ceil(remainingRows.length / 2),
      );
      pages.push(remainingRows.splice(0, balancedCount));
    }

    if (remainingRows.length > 0) {
      pages.push(remainingRows.splice(0, remainingRows.length));
    }

    return pages;
  };

  const pageRows = paginateRows(content.tableRows);

  const renderRows = (rows, includeTotal = false) => {
    const htmlRows = rows
      .map(
        (row) => `
          <tr>
            <td>${escapeHtml(row.id)}</td>
            <td>${escapeHtml(row.year)}</td>
            <td>${escapeHtml(row.month)}</td>
            <td>${escapeHtml(row.day)}</td>
            <td class="text-right">${escapeHtml(row.cost)}</td>
            ${showMoneyColumn ? `<td class="text-right">${escapeHtml(row.money)}</td>` : ""}
            <td class="text-right">${escapeHtml(row.index)}</td>
            <td class="text-right">${escapeHtml(row.result)}</td>
          </tr>`,
      )
      .join("");

    if (!includeTotal) {
      return htmlRows;
    }

    const totalLabelColspan = showMoneyColumn ? 7 : 6;
    return `${htmlRows}
      <tr>
        <td colspan="${totalLabelColspan}" class="total-label">${escapeHtml(content.tableHeaders.total)}</td>
        <td class="text-right total-value">${escapeHtml(content.rowTotal)}</td>
      </tr>`;
  };

  const renderPage = (rows, pageIndex) => {
    const isFirstPage = pageIndex === 0;
    const isLastPage = pageIndex === pageRows.length - 1;

    return `
      <div class="page ${isFirstPage ? "first-page" : "continuation-page"}">
        <div class="page-content">
          ${isFirstPage ? `<img class="header-image" src="${content.headerImage}" alt="header" />` : ""}

          ${
            isFirstPage
              ? `<table class="info">
                  <tbody>
                    <tr>
                      <td><span class="meta-label">${escapeHtml(content.meta.createdAtLabel)}:</span> <span>${escapeHtml(content.meta.createdAtValue)}</span></td>
                      <td><span class="meta-label">${escapeHtml(content.meta.companyNameLabel)}:</span> <span>${escapeHtml(content.meta.companyNameValue)}</span></td>
                    </tr>
                    <tr>
                      <td><span class="meta-label">${escapeHtml(content.meta.sequenceLabel)}:</span> <span>${escapeHtml(content.meta.sequenceValue)}</span></td>
                      <td><span class="meta-label">${escapeHtml(content.meta.identCodeLabel)}:</span> <span>${escapeHtml(content.meta.identCodeValue)}</span></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td><span class="meta-label">${escapeHtml(content.meta.contractNumberLabel)}:</span> <span>${escapeHtml(content.meta.contractNumberValue)}</span></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td><span class="meta-label">${escapeHtml(content.meta.customerLabel)}:</span> <span>${escapeHtml(content.meta.customerValue)}</span></td>
                    </tr>
                  </tbody>
                </table>

                <p class="description">${escapeHtml(content.description)}</p>`
              : `<div class="continuation-spacer"></div>`
          }

          <div class="printtable">
            <table class="report-table ${showMoneyColumn ? "" : "no-money-column"}">
              <thead>
                <tr>
                  <th rowspan="2">${escapeHtml(content.tableHeaders.number)}</th>
                  <th colspan="3">${escapeHtml(content.tableHeaders.workPeriod)}</th>
                  <th rowspan="2">${escapeHtml(content.tableHeaders.cost)}</th>
                  ${showMoneyColumn ? `<th rowspan="2">${escapeHtml(content.tableHeaders.money)}</th>` : ""}
                  <th rowspan="2">${escapeHtml(content.tableHeaders.index)}</th>
                  <th rowspan="2">${escapeHtml(content.tableHeaders.result)}</th>
                </tr>
                <tr>
                  <th>${escapeHtml(content.tableHeaders.year)}</th>
                  <th>${escapeHtml(content.tableHeaders.month)}</th>
                  <th>${escapeHtml(content.tableHeaders.day)}</th>
                </tr>
              </thead>
              <tbody>
                ${renderRows(rows, isLastPage)}
              </tbody>
            </table>

            ${
              isLastPage
                ? `<div class="doc-notes">
                    ${(content.notes || [])
                      .map(
                        (note) =>
                          `<p class="doc-note-line">${escapeHtml(note)}</p>`,
                      )
                      .join("")}
                  </div>`
                : ""
            }
          </div>
        </div>

        ${isLastPage ? `<img class="footer-image" src="${content.footerImage}" alt="footer" />` : ""}
      </div>`;
  };

  const pagesHtml = pageRows
    .map((rows, index) => renderPage(rows, index))
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="${language === "GE" ? "ka" : "en"}">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(content.title)}</title>
        <style>
          * {
            box-sizing: border-box;
          }

          html {
            width: 210mm;
            min-height: 297mm;
            background: #ffffff;
          }

          @page {
            size: A4;
            margin: 0;
          }

          body {
            margin: 0;
            color: #111827;
            font-family: Arial, sans-serif;
            font-size: 13px;
            line-height: 1.45;
            background: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .page {
            width: 210mm;
            min-height: 297mm;
            height: 297mm;
            margin: 0 auto;
            background: #ffffff;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            page-break-after: always;
            break-after: page;
          }

          .page-content {
            flex: 1 0 auto;
            display: flex;
            flex-direction: column;
          }

          .page:last-child {
            page-break-after: auto;
            break-after: auto;
          }

          .header-image,
          .footer-image {
            width: 100%;
            display: block;
            flex-shrink: 0;
            image-rendering: -webkit-optimize-contrast;
          }

          .info {
            width: 100%;
            font-size: 12px;
            border-collapse: collapse;
          }

          .info td {
            padding: 0 30px;
            vertical-align: top;
          }

          .info td:first-child {
            text-indent: 30px;
            width: 44%;
          }

          .info td:last-child {
            text-align: right;
            width: 56%;
          }

          .meta-label {
            font-weight: 700;
          }

          .description {
            padding: 0 30px;
            margin: 8px 0 0;
            text-align: justify;
            line-height: 2.5;
            text-indent: 30px;
            font-size: 11px;
            word-break: break-word;
          }

          .printtable {
            padding: 10px 30px;
            flex: 1 0 auto;
          }

          .continuation-spacer {
            height: 18mm;
          }

          .doc-notes {
            margin-top: 8px;
            font-size: 10px;
            font-weight: 700;
            line-height: 1.5;
          }

          .doc-note-line {
            margin: 0 0 4px;
          }

          .report-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
            table-layout: fixed;
          }

          .report-table th,
          .report-table td {
            border: 1px solid #9ca3af;
            padding: 6px 8px;
            vertical-align: middle;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .report-table thead th {
            background: #01389c;
            color: #ffffff;
            font-weight: 700;
            text-align: center;
            font-size: 8px;
            line-height: 1.15;
            padding: 4px 5px;
            word-break: break-word;
          }

          .report-table thead {
            display: table-header-group;
          }

          .report-table tr {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .report-table th:nth-child(1),
          .report-table td:nth-child(1) {
            width: 6%;
            text-align: center;
          }

          .report-table th:nth-child(2),
          .report-table td:nth-child(2) {
            width: 10%;
            text-align: center;
          }

          .report-table th:nth-child(3),
          .report-table td:nth-child(3) {
            width: 16%;
            text-align: center;
          }

          .report-table th:nth-child(4),
          .report-table td:nth-child(4) {
            width: 10%;
            text-align: center;
          }

          .report-table th:nth-child(5),
          .report-table td:nth-child(5),
          .report-table th:nth-child(6),
          .report-table td:nth-child(6),
          .report-table th:nth-child(7),
          .report-table td:nth-child(7),
          .report-table th:nth-child(8),
          .report-table td:nth-child(8) {
            width: 14.5%;
          }

          .report-table.no-money-column th:nth-child(5),
          .report-table.no-money-column td:nth-child(5),
          .report-table.no-money-column th:nth-child(6),
          .report-table.no-money-column td:nth-child(6),
          .report-table.no-money-column th:nth-child(7),
          .report-table.no-money-column td:nth-child(7) {
            width: 19.33%;
          }

          .text-right {
            text-align: right;
            white-space: nowrap;
          }

          .total-label {
            font-weight: 700;
            text-align: right;
          }

          .total-value {
            color: #01389c;
            font-weight: 700;
          }

          @media print {
            html,
            body {
              width: 210mm;
              min-height: 297mm;
              background: #ffffff;
            }

            .page {
              width: 100%;
              height: 297mm;
              min-height: 297mm;
              margin: 0;
            }

            .report-table,
            .report-table tr,
            .report-table td,
            .report-table th {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        ${pagesHtml}
        <script>
          const waitForImages = async () => {
            const images = Array.from(document.images || []);

            await Promise.all(
              images.map(
                (image) =>
                  image.complete
                    ? Promise.resolve()
                    : new Promise((resolve) => {
                        image.addEventListener("load", resolve, { once: true });
                        image.addEventListener("error", resolve, { once: true });
                      }),
              ),
            );

            await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

            window.focus();
            window.print();
          };

          window.addEventListener("load", waitForImages, { once: true });
        </script>
      </body>
    </html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  return true;
};
