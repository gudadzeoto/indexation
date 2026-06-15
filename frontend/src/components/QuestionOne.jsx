import React, { useEffect, useState } from "react";
import InfoModal from "./InfoModal";
import DocumentGenerationModal from "./DocumentGenerationModal";
import infoLogo from "../assets/images/info.png";
import removeIcon from "../assets/images/remove.png";
import plusIcon from "../assets/images/plus.png";
import docs from "../assets/images/google-docs.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://192.168.0.74:5002/api";

const QuestionOne = ({
  language = "GE",
  questionnaireType = "questionnaire1",
  questionnaireMode = "default",
  indexationMoneyShare = 0.7,
  baseSectionOnly = false,
  showBasePeriod = true,
  extraSection = null,
  hideExtraUntilBaseFieldsFilled = false,
  setCompanyData: parentSetCompanyData = null,
  setIdentCode: parentSetIdentCode = null,
  setContractNumber: parentSetContractNumber = null,
  setCustomer: parentSetCustomer = null,
  companyData: parentCompanyData = null,
  identCode: parentIdentCode = null,
  contractNumber: parentContractNumber = null,
  customer: parentCustomer = null,
}) => {
  const t = (ge, en) => (language === "GE" ? ge : en);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localIdentCode, setLocalIdentCode] = useState("");
  const [localCompanyData, setLocalCompanyData] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  const [localContractNumber, setLocalContractNumber] = useState("");
  const [localCustomer, setLocalCustomer] = useState("");
  const [isContractDurationOverTwelveMonths, setIsContractDurationOverTwelveMonths] =
    useState(false);
  const [basePeriod, setBasePeriod] = useState("");
  const isQuestionnaireThreeMode = questionnaireMode === "questionnaire3";
  const effectiveBasePeriod = isQuestionnaireThreeMode ? "2" : basePeriod;
  const [tenderOpenDate, setTenderOpenDate] = useState("");
  const [workCompletion, setWorkCompletion] = useState("");
  const [tableRows, setTableRows] = useState([
    {
      id: 1,
      year: "",
      month: "",
      day: "",
      cost: "",
      money: "",
      index: "",
      result: "",
    },
  ]);
  const [confirmed, setConfirmed] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [documentSequence, setDocumentSequence] = useState("-");
  const [rowTotal, setRowTotal] = useState("0.00");
  const [indexesData, setIndexesData] = useState({});

  const identCode = parentIdentCode ?? localIdentCode;
  const setIdentCode = parentSetIdentCode || setLocalIdentCode;
  const companyData = parentCompanyData ?? localCompanyData;
  const setCompanyData = parentSetCompanyData || setLocalCompanyData;
  const contractNumber = parentContractNumber ?? localContractNumber;
  const setContractNumber = parentSetContractNumber || setLocalContractNumber;
  const customer = parentCustomer ?? localCustomer;
  const setCustomer = parentSetCustomer || setLocalCustomer;
  const allowedTenderMonths = new Set(["2022-02", "2022-03", "2022-04"]);
  const tenderDateMin = isQuestionnaireThreeMode ? "2027-01-01" : "2022-02-01";
  const tenderDateMax = isQuestionnaireThreeMode ? undefined : "2022-04-30";

  const monthLabels = {
    "2022-01": t("იანვარი", "January"),
    "2022-02": t("თებერვალი", "February"),
    "2022-03": t("მარტი", "March"),
    "2022-04": t("აპრილი", "April"),
  };

  const monthNames = {
    "01": t("იანვარი", "January"),
    "02": t("თებერვალი", "February"),
    "03": t("მარტი", "March"),
    "04": t("აპრილი", "April"),
    "05": t("მაისი", "May"),
    "06": t("ივნისი", "June"),
    "07": t("ივლისი", "July"),
    "08": t("აგვისტო", "August"),
    "09": t("სექტემბერი", "September"),
    "10": t("ოქტომბერი", "October"),
    "11": t("ნოემბერი", "November"),
    "12": t("დეკემბერი", "December"),
  };

  const getMonthLabelFromKey = (monthKey) => {
    if (!monthKey) return "";

    if (monthLabels[monthKey]) {
      return monthLabels[monthKey];
    }

    const [, monthPart] = monthKey.split("-");
    return monthNames[monthPart] || monthKey;
  };

  const yearOptions = isQuestionnaireThreeMode
    ? Array.from({ length: 9 }, (_, i) => String(2027 + i))
    : ["2022", "2023", "2024", "2025", "2026"];

  const subtractDays = (dateValue, daysToSubtract) => {
    if (!dateValue) return null;

    const [year, month, day] = dateValue.split("-").map(Number);
    if (!year || !month || !day) return null;

    const utcDate = new Date(Date.UTC(year, month - 1, day));
    utcDate.setUTCDate(utcDate.getUTCDate() - daysToSubtract);

    return utcDate;
  };

  const clampResultByMoneyLimit = (resultValue, moneyValue) => {
    const maxAllowed = moneyValue * 0.1;

    // Cap only when result is above the positive 10% limit.
    return resultValue > maxAllowed ? maxAllowed : resultValue;
  };

  const handleSearch = async () => {
    if (!identCode) return;
    setSearching(true);
    setSearchError("");
    setCompanyData(null);
    try {
      const normalizedCode = identCode.replace(/\D/g, "").trim();
      const res = await fetch(
        `${API_BASE}/personaltitle?code=${encodeURIComponent(normalizedCode)}`,
      );
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
        setSearchError("NOT_FOUND");
      } else {
        setSearchError("SERVER_ERROR");
      }
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const isBasePeriodDisabled =
    !companyData || !contractNumber.trim() || !customer.trim();
  const canShowQuestionnaireThreeSections =
    !isQuestionnaireThreeMode ||
    (!isBasePeriodDisabled && isContractDurationOverTwelveMonths);

  const canShowExtraSection =
    !hideExtraUntilBaseFieldsFilled || !isBasePeriodDisabled;

  useEffect(() => {
    fetch(`${API_BASE}/indexes`)
      .then(async (r) => {
        const payload = await r.json().catch(() => null);
        if (!r.ok) {
          throw new Error(payload?.error || `HTTP_${r.status}`);
        }
        if (!Array.isArray(payload)) {
          throw new Error("INVALID_INDEXES_PAYLOAD");
        }
        return payload;
      })
      .then((rows) => {
        const map = {};
        rows.forEach((r) => {
          if (r.indexes) {
            map[`${r.year}-${String(r.month).padStart(2, "0")}`] = Number(
              r.indexes,
            );
          }
        });
        console.log(
          "IndexesData loaded. Sample keys:",
          Object.keys(map).slice(0, 10),
        );
        console.log("2022-02 index:", map["2022-02"]);
        setIndexesData(map);
      })
      .catch((e) => {
        console.error("Indexes load failed:", e);
      });
  }, []);

  useEffect(() => {
    if (isBasePeriodDisabled && basePeriod) {
      setBasePeriod("");
    }
  }, [isBasePeriodDisabled, basePeriod]);

  useEffect(() => {
    if (effectiveBasePeriod !== "2" && tenderOpenDate) {
      setTenderOpenDate("");
    }
  }, [effectiveBasePeriod, tenderOpenDate]);

  useEffect(() => {
    if (!confirmed && isDocModalOpen) {
      setIsDocModalOpen(false);
    }
  }, [confirmed, isDocModalOpen]);

  useEffect(() => {
    const total = tableRows.reduce((sum, row) => {
      const value = Number(row.result);
      return sum + (Number.isNaN(value) ? 0 : value);
    }, 0);

    setRowTotal(total.toFixed(2));
  }, [tableRows]);

  useEffect(() => {
    if (effectiveBasePeriod === "1") {
      console.log("BASE INDEX (radio 1)", {
        baseMonth: "2022-02",
        baseIndex: 100,
        note: "Base index is fixed to 100 for radio 1",
      });
      return;
    }

    if (effectiveBasePeriod === "2" && tenderOpenDate) {
      const minus28 = subtractDays(tenderOpenDate, 28);
      if (!minus28) return;

      const baseKey = `${minus28.getUTCFullYear()}-${String(minus28.getUTCMonth() + 1).padStart(2, "0")}`;
      const baseIndexFromDb = indexesData[baseKey];

      console.log("BASE INDEX (radio 2 from tender - 28 days)", {
        tenderOpenDate,
        minus28Date: minus28.toISOString().slice(0, 10),
        baseKey,
        baseIndexFromDb,
      });
    }
  }, [effectiveBasePeriod, tenderOpenDate, indexesData]);

  // Recalculate all rows when base period or indexes data changes
  useEffect(() => {
    setTableRows((prev) =>
      prev.map((row) => {
        if (!row.cost) return row;
        const costNum = Number(row.cost);
        if (Number.isNaN(costNum)) return row;

        const money = (costNum * indexationMoneyShare).toFixed(2);

        if (!row.year || !row.month || !row.day) {
          return { ...row, money, index: "", result: "" };
        }

        const dateStr = `${row.year}-${String(row.month).padStart(2, "0")}-${String(row.day).padStart(2, "0")}`;
        const dateMinus49 = subtractDays(dateStr, 49);

        if (!dateMinus49) {
          return { ...row, money, index: "", result: "" };
        }

        const month49 = dateMinus49.getUTCMonth() + 1;
        const year49 = dateMinus49.getUTCFullYear();

        const bKey =
          effectiveBasePeriod === "1"
            ? "2022-02"
            : effectiveBasePeriod === "2" && tenderMinus28MonthKey
              ? (() => {
                  const d = subtractDays(tenderOpenDate, 28);
                  return d
                    ? `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`
                    : "";
                })()
              : "";

        const rowKey = `${year49}-${String(month49).padStart(2, "0")}`;
        const rowIdx = indexesData[rowKey];
        const baseIdx = effectiveBasePeriod === "1" ? 100 : indexesData[bKey];
        console.log("Batch recalc:", { rowKey, rowIdx, bKey, baseIdx });
        const ratio =
          rowIdx != null && baseIdx != null ? rowIdx / baseIdx : null;
        const indexValue = ratio !== null ? ratio * 100 : null;
        if (ratio !== null) {
          const resultValue = Number(money) * ratio - Number(money);
          console.log("RESULT FORMULA (batch)", {
            formula: "result = money * (rowIdx / baseIdx) - money",
            money: Number(money),
            rowIdx,
            baseIdx,
            ratio,
            result: resultValue,
          });
        }

        return {
          ...row,
          money,
          index: indexValue !== null ? indexValue.toFixed(3) : "",
          result: (() => {
            if (indexValue === null) return "";

            const moneyNum = Number(money);
            const rawResult = moneyNum * (indexValue / 100) - moneyNum;
            const cappedResult = clampResultByMoneyLimit(rawResult, moneyNum);

            return cappedResult.toFixed(2);
          })(),
        };
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveBasePeriod, tenderOpenDate, indexesData, indexationMoneyShare]);

  const selectedTenderMonth = tenderOpenDate ? tenderOpenDate.slice(0, 7) : "";
  const tenderMinus28Date = subtractDays(tenderOpenDate, 28);
  const tenderMinus28MonthKey = tenderMinus28Date
    ? `${tenderMinus28Date.getUTCFullYear()}-${String(tenderMinus28Date.getUTCMonth() + 1).padStart(2, "0")}`
    : "";

  const baseMonthText =
    effectiveBasePeriod === "1"
      ? t("თებერვალი", "February")
      : effectiveBasePeriod === "2" && tenderMinus28MonthKey
        ? getMonthLabelFromKey(tenderMinus28MonthKey)
        : "";

  const basePeriodTextForDoc =
    effectiveBasePeriod === "1"
      ? t("2022 წლის თებერვალი", "February 2022")
      : effectiveBasePeriod === "2" && tenderMinus28Date
        ? t(
            `${tenderMinus28Date.getUTCFullYear()} წლის ${getMonthLabelFromKey(tenderMinus28MonthKey)}`,
            `${getMonthLabelFromKey(tenderMinus28MonthKey)} ${tenderMinus28Date.getUTCFullYear()}`,
          )
        : t("არ არის არჩეული", "Not selected");

  const workCompletionTextForDoc =
    workCompletion === "1"
      ? t("სამუშაოების 10% ან/და ნაკლები", "10% and/or less of works")
      : workCompletion === "2"
        ? t("სამუშაოების 10%-ზე მეტი", "More than 10% of works")
        : t("არ არის არჩეული", "Not selected");

  // base month key: "2022-2" for option 1, derived month for option 2
  const baseMonthKey =
    effectiveBasePeriod === "1"
      ? "2022-2"
      : effectiveBasePeriod === "2" && tenderMinus28MonthKey
        ? `${tenderMinus28Date.getUTCFullYear()}-${tenderMinus28Date.getUTCMonth() + 1}`
        : "";

  const getIndexValue = (year, month) => {
    if (!year || !month || !baseMonthKey) return null;
    const rowKey = `${year}-${parseInt(month)}`;
    const rowIdx = indexesData[rowKey];
    const baseIdx = indexesData[baseMonthKey];
    if (!rowIdx || !baseIdx) return null;
    return rowIdx / baseIdx;
  };

  const getDaysInMonth = (year, month) => {
    if (!year || !month) return [];
    const count = new Date(Number(year), Number(month), 0).getDate();
    return Array.from({ length: count }, (_, i) => i + 1);
  };

  const addTableRow = () => {
    setTableRows((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        year: "",
        month: "",
        day: "",
        cost: "",
        money: "",
        index: "",
        result: "",
      },
    ]);
  };

  const removeTableRow = (idToRemove) => {
    setTableRows((prev) => {
      const filtered = prev.filter((row) => row.id !== idToRemove);
      return filtered.map((row, index) => ({ ...row, id: index + 1 }));
    });
  };

  const recalculateRow = (row) => {
    const costNum = Number(row.cost);
    if (row.cost === "" || Number.isNaN(costNum)) {
      return { ...row, money: "", index: "", result: "" };
    }

    const money = (costNum * indexationMoneyShare).toFixed(2);

    // Date minus 49 days
    if (!row.year || !row.month || !row.day) {
      console.log("Missing year/month/day:", {
        year: row.year,
        month: row.month,
        day: row.day,
      });
      return { ...row, money, index: "", result: "" };
    }

    const dateStr = `${row.year}-${String(row.month).padStart(2, "0")}-${String(row.day).padStart(2, "0")}`;
    const dateMinus49 = subtractDays(dateStr, 49);

    if (!dateMinus49) {
      console.log("Failed to subtract 49 days from:", dateStr);
      return { ...row, money, index: "", result: "" };
    }

    // Get the month of date-49
    const month49 = dateMinus49.getUTCMonth() + 1;
    const year49 = dateMinus49.getUTCFullYear();

    // Get base month key
    const bKey =
      effectiveBasePeriod === "1"
        ? "2022-02"
        : effectiveBasePeriod === "2" && tenderMinus28MonthKey
          ? (() => {
              const d = subtractDays(tenderOpenDate, 28);
              return d
                ? `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`
                : "";
            })()
          : "";

    // Get indexes
    const rowKey = `${year49}-${String(month49).padStart(2, "0")}`;
    const rowIdx = indexesData[rowKey];
    const baseIdx = effectiveBasePeriod === "1" ? 100 : indexesData[bKey];

    console.log("Index calc:", {
      rowKey,
      rowIdx,
      bKey,
      baseIdx,
      indexesDataKeys: Object.keys(indexesData).slice(0, 5),
      basePeriod: effectiveBasePeriod,
      dateStr,
      dateMinus49: dateMinus49.toISOString(),
    });

    const ratio = rowIdx != null && baseIdx != null ? rowIdx / baseIdx : null;
    const indexValue = ratio !== null ? ratio * 100 : null;
    if (ratio !== null) {
      const resultValue = Number(money) * ratio - Number(money);
      console.log("RESULT FORMULA (single row)", {
        formula: "result = money * (rowIdx / baseIdx) - money",
        money: Number(money),
        rowIdx,
        baseIdx,
        ratio,
        result: resultValue,
      });
    }
    const indexDisplay = indexValue !== null ? indexValue.toFixed(3) : "";
    const result = (() => {
      if (indexValue === null) return "";

      const moneyNum = Number(money);
      const rawResult = moneyNum * (indexValue / 100) - moneyNum;
      const cappedResult = clampResultByMoneyLimit(rawResult, moneyNum);

      return cappedResult.toFixed(2);
    })();

    return {
      ...row,
      money,
      index: indexDisplay,
      result,
    };
  };

  const updateTableRow = (id, field, value) => {
    setTableRows((prev) =>
      prev.map((r) =>
        r.id === id ? recalculateRow({ ...r, [field]: value }) : r,
      ),
    );
  };

  return (
    <section className="w-full border" style={{ borderColor: "#01389c" }}>
      <div className="px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
        <div className="mb-6 py-4">
          <h1 className="bpg_mrgvlovani_caps mt-2 text-left text-[16px] font-bold text-[#0f172a]">
            {t(
              "გთხოვთ, მიუთითოთ შემდეგი ინფორმაცია:",
              "Please provide the following information:",
            )}
          </h1>
        </div>

        <p className="bpg_mrgvlovani_caps mt-4">
          {t(
            "შეიყვანეთ თქვენი საწარმოს საიდენტიფიკაციო კოდი",
            "Enter your identification code:",
          )}
        </p>

        <div className="mt-3 space-y-2">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
            <div
              className="flex w-full max-w-md items-center overflow-hidden rounded-md transition-colors duration-300 md:w-72 md:min-w-[18rem]"
              style={{
                border: searchError
                  ? "1px solid #ef4444"
                  : companyData
                    ? "1px solid #22c55e"
                    : "1px solid #d1d5db",
                backgroundColor: searchError
                  ? "#fef2f2"
                  : companyData
                    ? "#f0fdf4"
                    : "transparent",
              }}
            >
              <input
                type="text"
                inputMode="numeric"
                value={identCode}
                onChange={(e) =>
                  setIdentCode(e.target.value.replace(/\D/g, ""))
                }
                onKeyDown={handleKeyDown}
                placeholder={t("საიდენტიფიკაციო კოდი", "Identification Code")}
                className="bpg_mrgvlovani_caps flex-1 bg-transparent px-3 py-2 text-sm outline-none"
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={searching}
                className="flex cursor-pointer items-center justify-center px-3 py-2 text-[#01389c] transition-colors hover:text-[#012d7a] disabled:opacity-50"
                aria-label={t("ძებნა", "Search")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
              </button>
            </div>
            {companyData && (
              <div className="bpg_mrgvlovani_caps flex w-full items-center overflow-hidden rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm md:w-fit md:max-w-full">
                <p className="break-words md:whitespace-nowrap">
                  <span className="font-semibold">
                    {t("დასახელება:", "Name:")}
                  </span>{" "}
                  {companyData.Full_Name}
                </p>
              </div>
            )}
          </div>
          {searchError && (
            <p className="bpg_mrgvlovani_caps text-sm text-red-600">
              {searchError === "NOT_FOUND"
                ? t(
                    "მსგავსი საწარმო ვერ მოიძებნა!",
                    "No similar enterprise was found!",
                  )
                : t(
                    "სერვერმა ძებნა ვერ შეასრულა. გადაამოწმეთ კოდი ან სცადეთ თავიდან.",
                    "Search failed. Please verify the code or try again.",
                  )}
            </p>
          )}
        </div>

        <p className="bpg_mrgvlovani_caps mt-6">
          {t("ხელშეკრულების ნომერი", "Contract number")}
        </p>
        <div className="mt-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
            <div className="flex w-full max-w-md items-center overflow-hidden rounded-md border border-gray-300 md:w-72">
              <input
                type="text"
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                placeholder={t("ხელშეკრულების ნომერი", "Contract Number")}
                className="bpg_mrgvlovani_caps flex-1 px-3 py-2 text-sm outline-none"
              />
            </div>
            {contractNumber && (
              <div className="bpg_mrgvlovani_caps flex w-full items-center overflow-hidden rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm md:w-fit md:max-w-full">
                <p className="break-words md:whitespace-nowrap">
                  <span className="font-semibold">
                    {t("ნომერი:", "Number:")}
                  </span>{" "}
                  {contractNumber}
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="bpg_mrgvlovani_caps mt-6">
          {t("დამკვეთი", "Ordering party")}
        </p>
        <div className="mt-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
            <div className="flex w-full max-w-md items-center overflow-hidden rounded-md border border-gray-300 md:w-72">
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder={t("დამკვეთი", "Ordering party")}
                className="bpg_mrgvlovani_caps flex-1 px-3 py-2 text-sm outline-none"
              />
            </div>
            {customer && (
              <div className="bpg_mrgvlovani_caps flex w-full items-center overflow-hidden rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm md:w-fit md:max-w-full">
                <p className="break-words md:whitespace-nowrap">
                  <span className="font-semibold">
                    {t("დამკვეთი:", "Ordering party:")}
                  </span>{" "}
                  {customer}
                </p>
              </div>
            )}
          </div>
        </div>

        {isQuestionnaireThreeMode && (
          <div className="mt-4 max-w-2xl rounded-xl border border-[#bfd6ff] bg-[#f8fbff] px-4 py-3 shadow-sm">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={isContractDurationOverTwelveMonths}
                onChange={(e) =>
                  setIsContractDurationOverTwelveMonths(e.target.checked)
                }
                className="mt-0.5 h-4 w-4 cursor-pointer accent-[#01389c]"
              />
              <span className="bpg_mrgvlovani_caps text-sm font-semibold text-[#01389c]">
                {t(
                  "ხელშეკრულების ვადა შეადგენს 12 თვეზე მეტს",
                  "The contract term is more than 12 months.",
                )}
              </span>
            </label>
          </div>
        )}

        {showBasePeriod && (
          <>
            <p className="bpg_mrgvlovani_caps mt-6 font-bold">
              {t("1. საბაზო პერიოდი", "1. Base Period")}
            </p>
            <p className="bpg_mrgvlovani_caps mt-2 text-xs italic text-gray-600">
              {t(
                "პირველი პუნქტის მონიშვნის შემთხვევაში საბაზისოდ გამოიყენება 2022 წლის თებერვალი, ხოლო მე-2 პუნქტის შემთხვევაში - ტენდერის გახსნიდან 28 დღით ადრინდელი თარიღის შესაბამისი თვე (რაც არ შეიძლება, იყოს თებერვალზე ადრე).",
                "If the first option is selected - the base period will be February 2022, while when the second option is selected, the month corresponding to 28 days before the tender opening date is used as a base period (which can not be earlier than February).",
              )}
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <label
                className={`flex items-start gap-3 ${isBasePeriodDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
              >
                <input
                  type="radio"
                  name="basePeriod-question-one"
                  value="1"
                  checked={basePeriod === "1"}
                  onChange={(e) => setBasePeriod(e.target.value)}
                  disabled={isBasePeriodDisabled}
                  className={`mt-1 accent-[#01389c] ${isBasePeriodDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                />
                <span className="bpg_mrgvlovani_caps text-sm">
                  {t(
                    "მიმდინარე ხელშეკრულების ფარგლებში-2022 წლის 1 აპრილიდან შესრულებული და შემდგომში ანაზღაურებული სამუშაოები",
                    "Under the current contract - Works performed from April 1, 2022 and subsequently reimbursed",
                  )}
                </span>
              </label>
              <label
                className={`flex items-start gap-3 ${isBasePeriodDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
              >
                <input
                  type="radio"
                  name="basePeriod-question-one"
                  value="2"
                  checked={basePeriod === "2"}
                  onChange={(e) => setBasePeriod(e.target.value)}
                  disabled={isBasePeriodDisabled}
                  className={`mt-1 accent-[#01389c] ${isBasePeriodDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                />
                <div>
                  <span className="bpg_mrgvlovani_caps text-sm">
                    {t(
                      "მიმდინარე * და 2022 წლის 1 მაისამდე გამოცხადებული ტენდერების ფარგლებში შესრულებული და შემდგომში ანაზღაურებული სამუშაოები",
                      "Work performed and subsequently reimbursed within the framework of current * and tenders announced before May 1, 2022",
                    )}
                  </span>
                  <p className="bpg_mrgvlovani_caps mt-1 text-xs italic text-[#01389c]">
                    {t("2022 წლის 27 აპრილის მდგომარეობით*", "As of April 27, 2022*")}
                  </p>
                </div>
              </label>
            </div>
          </>
        )}

        {!baseSectionOnly &&
          canShowQuestionnaireThreeSections &&
          (isQuestionnaireThreeMode ||
            (showBasePeriod && effectiveBasePeriod === "2")) && (
          <div className="mt-6">
            <p className="bpg_mrgvlovani_caps font-bold">
              {isQuestionnaireThreeMode
                ? t("1. ტენდერის გახსნის თარიღი", "1. Date of tender opening")
                : t("2. ტენდერის გახსნის თარიღი", "2. Date of tender opening")}
            </p>
            <p className="bpg_mrgvlovani_caps mt-2 text-xs italic text-gray-600">
              {t(
                "ფასთა ინდექსაცია არ ვრცელდება 2022 წლის 1 მაისიდან გამოცხადებული ტენდერების ფარგლებში შესრულებულ და შემდგომში ანაზღაურებულ სამუშაოებზე.",
                "Price indexation does not cover the works performed and subsequently reimbursed within the framework of the tenders announced from May 1, 2022.",
              )}
            </p>
            <div className="mt-4 w-full max-w-[320px]">
              <div className="group flex items-center gap-2 rounded-xl border border-[#bfd6ff] bg-white px-3 py-2 transition-all duration-200 focus-within:border-[#01389c] focus-within:ring-2 focus-within:ring-[#d8e7ff]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-5 w-5 text-[#4a6fb2]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 2v3m8-3v3M3.5 9.5h17M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18v-11A1.5 1.5 0 0 1 5 5.5z"
                  />
                </svg>
                <input
                  type="date"
                  value={tenderOpenDate}
                  min={tenderDateMin}
                  max={tenderDateMax}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    const selectedMonth = selectedDate.slice(0, 7);

                    if (isQuestionnaireThreeMode) {
                      setTenderOpenDate(
                        selectedDate >= tenderDateMin ? selectedDate : "",
                      );
                      return;
                    }

                    setTenderOpenDate(allowedTenderMonths.has(selectedMonth) ? selectedDate : "");
                  }}
                  className="bpg_mrgvlovani_caps w-full bg-transparent text-sm text-[#01389c] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {((!isQuestionnaireThreeMode && showBasePeriod) ||
          (isQuestionnaireThreeMode && canShowQuestionnaireThreeSections)) &&
          baseMonthText && (
          <div className="bpg_mrgvlovani_caps mt-5 inline-flex max-w-full items-center rounded-md border border-[#bfd6ff] bg-[#eef5ff] px-3 py-2 text-sm leading-5 text-[#01389c]">
            {`${t("საბაზო თვე", "Base Month")} - ${baseMonthText}`}
          </div>
        )}

        {canShowExtraSection && extraSection}

        {!baseSectionOnly &&
          !isQuestionnaireThreeMode &&
          showBasePeriod &&
          (effectiveBasePeriod === "1" || effectiveBasePeriod === "2") && (
            <div className="mt-6">
              <p className="bpg_mrgvlovani_caps font-bold">
                {t(
                  "3. ხელშეკრულების ფარგლებში 2022 წლის 1 მარტის მდგომარეობით შესრულებულია",
                  "3. Specify the level of performed work within the contract as of March 1, 2022",
                )}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="workCompletion-question-one"
                    value="1"
                    checked={workCompletion === "1"}
                    onChange={(e) => setWorkCompletion(e.target.value)}
                    className="mt-1 cursor-pointer accent-[#01389c]"
                  />
                  <span className="bpg_mrgvlovani_caps text-sm">
                    {t(
                      "სამუშაოების 10% ან/და ნაკლები",
                      "10% and / or less of the works",
                    )}
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="workCompletion-question-one"
                    value="2"
                    checked={workCompletion === "2"}
                    onChange={(e) => setWorkCompletion(e.target.value)}
                    className="mt-1 cursor-pointer accent-[#01389c]"
                  />
                  <span className="bpg_mrgvlovani_caps text-sm">
                    {t("სამუშაოების 10%-ზე მეტი", "More than 10% of the works")}
                  </span>
                </label>
                <p className="bpg_mrgvlovani_caps mt-2 text-xs italic text-gray-600">
                  {t(
                    "1-ლი პუნქტის მონიშვნის შემთხვევაში ხელშეკრულებაზე ვრცელდება ფასთა ინდექსაციით გამოწვეული დადებითი ან უარყოფითი ბალანსი; მე-2 პუნქტის მონიშვნის შემთხვევაში ხელშეკრულებაზე ვრცელდება ფასთა ინდექსაციით გამოწვეული დადებითი ბალანსი.",
                    "In case of selecting option 1, the positive or negative balance caused by the price indexation applies to the contract. In case of selecting option 2, the positive balance caused by the price indexation applies to the contract",
                  )}
                </p>
              </div>
            </div>
          )}

        {!baseSectionOnly &&
          canShowQuestionnaireThreeSections &&
          ((isQuestionnaireThreeMode && effectiveBasePeriod === "2") ||
            (showBasePeriod &&
              (effectiveBasePeriod === "1" || effectiveBasePeriod === "2"))) && (
            <div className="mt-8">
              <p className="bpg_mrgvlovani_caps mb-4 font-bold">
                {isQuestionnaireThreeMode
                  ? t(
                      "2. ინფორმაცია შესრულებული სამუშაოს შესახებ",
                      "2. Information about the performed work",
                    )
                  : t(
                      "4. ინფორმაცია შესრულებული სამუშაოს შესახებ",
                      "4. Information about the performed work",
                    )}
              </p>
              <div className="space-y-4 md:hidden">
                {tableRows.map((row, index) => (
                  <div
                    key={row.id}
                    className="rounded-xl border border-[#d7e3ff] bg-[#f8fbff] p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="bpg_mrgvlovani_caps text-sm font-bold text-[#01389c]">
                        {`${t("რიგი", "Row")} ${row.id}`}
                      </p>
                      <div className="flex items-center gap-2">
                        {tableRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTableRow(row.id)}
                            title={t("წაშლა", "Remove row")}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                          >
                            <img
                              src={removeIcon}
                              alt={t("წაშლა", "Remove")}
                              className="h-4 w-4"
                            />
                          </button>
                        )}
                        {index === tableRows.length - 1 && (
                          <button
                            type="button"
                            onClick={addTableRow}
                            title={t("დამატება", "Add row")}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#01389c] text-[#01389c] hover:bg-[#01389c] hover:text-white"
                          >
                            <img
                              src={plusIcon}
                              alt={t("დამატება", "Add")}
                              className="h-4 w-4"
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="bpg_mrgvlovani_caps mb-1 block text-xs font-semibold text-[#01389c]">
                          {t("წელი", "Year")}
                        </label>
                        <select
                          value={row.year}
                          onChange={(e) =>
                            updateTableRow(row.id, "year", e.target.value)
                          }
                          className="bpg_mrgvlovani_caps h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#01389c]"
                        >
                          <option value="" disabled>
                            {t("წელი", "Year")}
                          </option>
                          {yearOptions.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="bpg_mrgvlovani_caps mb-1 block text-xs font-semibold text-[#01389c]">
                          {t("თვე", "Month")}
                        </label>
                        <select
                          value={row.month}
                          onChange={(e) =>
                            updateTableRow(row.id, "month", e.target.value)
                          }
                          className="bpg_mrgvlovani_caps h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#01389c]"
                        >
                          <option value="" disabled>
                            {t("თვე", "Month")}
                          </option>
                          <option value="1">{t("იანვარი", "January")}</option>
                          <option value="2">
                            {t("თებერვალი", "February")}
                          </option>
                          <option value="3">{t("მარტი", "March")}</option>
                          <option value="4">{t("აპრილი", "April")}</option>
                          <option value="5">{t("მაისი", "May")}</option>
                          <option value="6">{t("ივნისი", "June")}</option>
                          <option value="7">{t("ივლისი", "July")}</option>
                          <option value="8">{t("აგვისტო", "August")}</option>
                          <option value="9">
                            {t("სექტემბერი", "September")}
                          </option>
                          <option value="10">
                            {t("ოქტომბერი", "October")}
                          </option>
                          <option value="11">
                            {t("ნოემბერი", "November")}
                          </option>
                          <option value="12">
                            {t("დეკემბერი", "December")}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="bpg_mrgvlovani_caps mb-1 block text-xs font-semibold text-[#01389c]">
                          {t("რიცხვი", "Date")}
                        </label>
                        <select
                          value={row.day}
                          onChange={(e) =>
                            updateTableRow(row.id, "day", e.target.value)
                          }
                          className="bpg_mrgvlovani_caps h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#01389c]"
                        >
                          <option value="" disabled>
                            {t("რიცხვი", "Date")}
                          </option>
                          {getDaysInMonth(row.year, row.month).map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="bpg_mrgvlovani_caps mb-1 block text-xs font-semibold text-[#01389c]">
                          {t(
                            "შესრულებული სამუშაოს ღირებულება, ლარი",
                            "Cost of work performed, GEL",
                          )}
                        </label>
                        <input
                          type="number"
                          value={row.cost}
                          onChange={(e) =>
                            updateTableRow(row.id, "cost", e.target.value)
                          }
                          className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#01389c]"
                        />
                      </div>

                      <div>
                        <label className="bpg_mrgvlovani_caps mb-1 block text-xs font-semibold text-[#01389c]">
                          {t(
                            "საინდექსაციო თანხა, ლარი",
                            "Indexation amount, GEL",
                          )}
                        </label>
                        <input
                          type="text"
                          value={row.money}
                          readOnly
                          className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm outline-none"
                        />
                      </div>

                      <div>
                        <label className="bpg_mrgvlovani_caps mb-1 block text-xs font-semibold text-[#01389c]">
                          {t(
                            "მშენებლობის ღირებულების ინდექსი საბაზო პერიოდთან შედარებით",
                            "Construction Cost Index compared to the base period",
                          )}
                        </label>
                        <input
                          type="text"
                          value={row.index}
                          readOnly
                          className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="bpg_mrgvlovani_caps mb-1 block text-xs font-semibold text-[#01389c]">
                          {t(
                            "ფასთა ინდექსაციის შედეგად მიღებული თანხა, ლარი",
                            "Reimbursement amount, GEL",
                          )}
                        </label>
                        <input
                          type="text"
                          value={row.result}
                          readOnly
                          className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="rounded-xl border border-[#d7e3ff] bg-white p-4">
                  <p className="bpg_mrgvlovani_caps text-xs font-bold text-[#334155]">
                    {t(
                      "* მიმწოდებელი პასუხისმგებელია მის მიერ შეყვანილი ინფორმაციის სისწორეზე.",
                      "* The supplier is responsible for the accuracy of the entered data.",
                    )}
                  </p>
                  <p className="bpg_mrgvlovani_caps mt-2 text-xs font-bold text-[#334155]">
                    {t(
                      "* შემსყიდველი ვალდებულია ანგარიშსწორებამდე გადაამოწმოს მიმწოდებლის მიერ შევსებული მონაცემების სისწორე",
                      "* The purchaser is obligated to verify the accuracy of the data provided by the supplier before the reimbursement verify the accuracy of the data entered by the supplier before settlement",
                    )}
                  </p>
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-[#d7e3ff] bg-[#f8fbff] px-4 py-3">
                    <span className="bpg_mrgvlovani_caps text-sm font-bold text-[#01389c]">
                      {t("სულ:", "Total:")}
                    </span>
                    <span className="bpg_mrgvlovani_caps text-base font-bold text-[#01389c]">
                      {rowTotal}
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden w-full overflow-x-auto md:block">
                <table
                  className="min-w-[860px] w-full table-fixed border-collapse text-xs md:text-sm"
                  style={{ borderColor: "#01389c" }}
                >
                  <thead>
                    <tr className="bg-[#01389c] text-white">
                      <th
                        rowSpan={2}
                        className="bpg_mrgvlovani_caps w-8 border border-[#4a6fb2] px-0.5 py-1.5 text-center align-middle text-[9px] leading-tight md:text-[10px]"
                      >
                        N
                      </th>
                      <th
                        colSpan={3}
                        className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-2 text-center text-[9px] leading-tight md:text-[10px]"
                      >
                        {t(
                          "სამუშაოს დასრულების პერიოდი",
                          "End period of the work performed",
                        )}
                      </th>
                      <th
                        rowSpan={2}
                        className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-2 text-center align-middle whitespace-normal text-[9px] leading-tight md:text-[10px]"
                      >
                        {t(
                          "შესრულებული სამუშაოს ღირებულება, ლარი",
                          "Cost of work performed, GEL",
                        )}
                      </th>
                      <th
                        rowSpan={2}
                        className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-2 text-center align-middle whitespace-normal text-[9px] leading-tight md:text-[10px]"
                      >
                        {t(
                          "საინდექსაციო თანხა, ლარი",
                          "Indexation amount, GEL",
                        )}
                      </th>
                      <th
                        rowSpan={2}
                        className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-2 text-center align-middle whitespace-normal text-[9px] leading-tight md:text-[10px]"
                      >
                        {t(
                          "მშენებლობის ღირებულების ინდექსი საბაზო პერიოდთან შედარებით",
                          "Construction Cost Index compared to the base period",
                        )}
                      </th>
                      <th
                        rowSpan={2}
                        className="bpg_mrgvlovani_caps w-[170px] border border-[#4a6fb2] px-2 py-2 text-center align-middle whitespace-normal text-[9px] leading-tight md:text-[10px]"
                      >
                        <span className="block">
                          {t(
                            "ფასთა ინდექსაციის შედეგად მიღებული თანხა, ლარი",
                            "Reimbursement amount, GEL",
                          )}
                        </span>
                      </th>
                      <th
                        rowSpan={2}
                        className="border border-[#4a6fb2] px-1 py-1 text-center align-middle"
                        style={{ width: "56px" }}
                      />
                    </tr>
                    <tr className="bg-[#01389c] text-white">
                      <th className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-1.5 text-center text-[9px] leading-tight md:text-[10px]">
                        {t("წელი", "Year")}
                      </th>
                      <th className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-1.5 text-center text-[9px] leading-tight md:text-[10px]">
                        {t("თვე", "Month")}
                      </th>
                      <th className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-1.5 text-center text-[9px] leading-tight md:text-[10px]">
                        {t("რიცხვი", "Date")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, index) => (
                      <tr key={row.id} className="bg-white hover:bg-[#f7faff]">
                        <td className="w-8 border border-gray-300 px-0.5 py-1.5 text-center align-middle text-xs">
                          {row.id}
                        </td>
                        <td className="border border-gray-300 px-1 py-1">
                          <select
                            value={row.year}
                            onChange={(e) =>
                              updateTableRow(row.id, "year", e.target.value)
                            }
                            className="bpg_mrgvlovani_caps h-8 w-full min-w-0 rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:border-[#01389c]"
                          >
                            <option value="" disabled>
                              {t("წელი", "Year")}
                            </option>
                            {yearOptions.map(
                              (y) => (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              ),
                            )}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-1 py-1">
                          <select
                            value={row.month}
                            onChange={(e) =>
                              updateTableRow(row.id, "month", e.target.value)
                            }
                            className="bpg_mrgvlovani_caps h-8 w-full min-w-0 rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:border-[#01389c]"
                          >
                            <option value="" disabled>
                              {t("თვე", "Month")}
                            </option>
                            <option value="1">{t("იანვარი", "January")}</option>
                            <option value="2">
                              {t("თებერვალი", "February")}
                            </option>
                            <option value="3">{t("მარტი", "March")}</option>
                            <option value="4">{t("აპრილი", "April")}</option>
                            <option value="5">{t("მაისი", "May")}</option>
                            <option value="6">{t("ივნისი", "June")}</option>
                            <option value="7">{t("ივლისი", "July")}</option>
                            <option value="8">{t("აგვისტო", "August")}</option>
                            <option value="9">
                              {t("სექტემბერი", "September")}
                            </option>
                            <option value="10">
                              {t("ოქტომბერი", "October")}
                            </option>
                            <option value="11">
                              {t("ნოემბერი", "November")}
                            </option>
                            <option value="12">
                              {t("დეკემბერი", "December")}
                            </option>
                          </select>
                        </td>
                        <td className="border border-gray-300 px-1 py-1">
                          <select
                            value={row.day}
                            onChange={(e) =>
                              updateTableRow(row.id, "day", e.target.value)
                            }
                            className="bpg_mrgvlovani_caps h-8 w-full min-w-0 rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:border-[#01389c]"
                          >
                            <option value="" disabled />
                            {getDaysInMonth(row.year, row.month).map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-1 py-1">
                          <input
                            type="number"
                            value={row.cost}
                            onChange={(e) =>
                              updateTableRow(row.id, "cost", e.target.value)
                            }
                            className="h-8 w-full min-w-0 rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:border-[#01389c]"
                          />
                        </td>
                        <td className="border border-gray-300 px-1 py-1">
                          <input
                            type="text"
                            value={row.money}
                            readOnly
                            className="h-8 w-full min-w-0 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 px-1 py-1">
                          <input
                            type="text"
                            value={row.index}
                            readOnly
                            className="h-8 w-full min-w-0 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs outline-none"
                          />
                        </td>
                        <td className="w-[170px] border border-gray-300 px-1 py-1">
                          <input
                            type="text"
                            value={row.result}
                            readOnly
                            className="h-8 w-full min-w-0 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 px-1 py-1 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {tableRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTableRow(row.id)}
                                title={t("წაშლა", "Remove row")}
                                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-red-500 text-[10px] font-bold text-red-600 hover:bg-red-500 hover:text-white md:h-6 md:w-6"
                              >
                                <img
                                  src={removeIcon}
                                  alt={t("წაშლა", "Remove")}
                                  className="h-3.5 w-3.5 md:h-4 md:w-4"
                                />
                              </button>
                            )}
                            {index === tableRows.length - 1 && (
                              <button
                                type="button"
                                onClick={addTableRow}
                                title={t("დამატება", "Add row")}
                                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-[#01389c] text-[10px] font-bold text-[#01389c] hover:bg-[#01389c] hover:text-white md:h-6 md:w-6"
                              >
                                <img
                                  src={plusIcon}
                                  alt={t("დამატება", "Add")}
                                  className="h-3.5 w-3.5 md:h-4 md:w-4"
                                />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        colSpan={9}
                        className="bpg_mrgvlovani_caps border-0 pt-2 text-left text-xs font-bold"
                      >
                        {t(
                          "* მიმწოდებელი პასუხისმგებელია მის მიერ შეყვანილი ინფორმაციის სისწორეზე.",
                          "* The supplier is responsible for the accuracy of the entered data.",
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={9}
                        className="bpg_mrgvlovani_caps border-0 pb-2 text-left text-xs font-bold"
                      >
                        {t(
                          "* შემსყიდველი ვალდებულია ანგარიშსწორებამდე გადაამოწმოს მიმწოდებლის მიერ შევსებული მონაცემების სისწორე",
                          "* The purchaser is obligated to verify the accuracy of the data provided by the supplier before the reimbursement verify the accuracy of the data entered by the supplier before settlement",
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={7} className="border border-gray-300" />
                      <td
                        colSpan={2}
                        className="bpg_mrgvlovani_caps border border-gray-300 px-2 py-1 text-sm font-bold"
                      >
                        {t("სულ:", "Total:")}{" "}
                        <span className="text-[#01389c]">{rowTotal}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <label className="flex cursor-pointer items-start gap-2 sm:items-center">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
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
                  onClick={async () => {
                    try {
                      const reportEndpoint =
                        questionnaireType === "questionnaire3" ? "report2" : "report";

                      const res = await fetch(`${API_BASE}/${reportEndpoint}`, {
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
                            money: row.money,
                            index: row.index,
                            result: row.result,
                          })),
                        }),
                      });
                      const payload = await res.json().catch(() => null);

                      if (!res.ok) {
                        console.error("Report insert error:", payload || {});
                      } else if (payload?.printnum != null) {
                        setDocumentSequence(String(payload.printnum));
                      }
                    } catch (err) {
                      console.error("Report insert fetch error:", err);
                    }
                    setIsDocModalOpen(true);
                  }}
                  disabled={!confirmed}
                  className="bpg_mrgvlovani_caps mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#01389c] px-4 py-2 text-sm font-semibold text-[#01389c] transition-colors hover:bg-[#01389c] hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent cursor-pointer sm:w-auto"
                >
                  <img src={docs} alt="google docs" className="h-5 w-5" />
                  {t("დოკუმენტის დაგენერირება", "Generate document")}
                </button>
              </div>
            </div>
          )}
      </div>

      <DocumentGenerationModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        language={language}
        questionnaireType={questionnaireType}
        data={{
          companyName: companyData?.Full_Name || "",
          identCode,
          contractNumber,
          customer,
          createdAt: new Date().toISOString(),
          documentSequence,
          basePeriodText: basePeriodTextForDoc,
          workCompletionText: workCompletionTextForDoc,
          tableRows,
          rowTotal,
        }}
      />

      <div className="flex w-full flex-col items-start gap-3 bg-[#01389c] px-4 py-4 text-left text-sm font-medium text-white sm:flex-row sm:items-center sm:justify-end sm:text-right">
        <span className="bpg_mrgvlovani_caps">
          {t("გაანგარიშების ინსტრუქცია", "Calculation Instruction")}
        </span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex cursor-pointer items-center justify-center"
          aria-label={t("გაანგარიშების ინსტრუქცია", "Calculation instruction")}
        >
          <img src={infoLogo} alt="info" className="h-5 w-5" />
        </button>
      </div>

      <InfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={language}
        questionnaireType={questionnaireType}
      />
    </section>
  );
};

export default QuestionOne;
