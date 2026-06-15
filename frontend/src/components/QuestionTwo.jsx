import React, { useState, useEffect } from "react";
import QuestionOne from "./QuestionOne";
import QuestionTwoDocumentGeneration from "./QuestionTwoDocumentGeneration";
import removeIcon from "../assets/images/remove.png";
import plusIcon from "../assets/images/plus.png";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://192.168.0.74:5002/api";
const TENDER_MIN_DATE = "2022-02-01";
const SECOND_PERIOD_MIN_MONTH_KEY = "2026-06";

const compareMonthKeys = (a, b) => {
  const [yearA, monthA] = a.split("-").map(Number);
  const [yearB, monthB] = b.split("-").map(Number);

  if (yearA !== yearB) {
    return yearA - yearB;
  }

  return monthA - monthB;
};

const getLastDayOfMonth = (year, month) =>
  new Date(Number(year), Number(month), 0).getDate();

const formatMonthKeyLabel = (monthKey, language) => {
  if (!monthKey) return "";

  const [year, month] = monthKey.split("-").map(Number);
  if (!year || !month) return monthKey;

  const geMonths = [
    "იანვარი",
    "თებერვალი",
    "მარტი",
    "აპრილი",
    "მაისი",
    "ივნისი",
    "ივლისი",
    "აგვისტო",
    "სექტემბერი",
    "ოქტომბერი",
    "ნოემბერი",
    "დეკემბერი",
  ];

  const enMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return language === "GE"
    ? geMonths[month - 1] || monthKey
    : enMonths[month - 1] || monthKey;
};

const QuestionTwo = ({ language = "GE" }) => {
  const t = (ge, en) => (language === "GE" ? ge : en);
  const [workType, setWorkType] = useState("");
  const [indexationPeriod, setIndexationPeriod] = useState("");
  const [tenderOpenDate, setTenderOpenDate] = useState("");
  const [fixedCoefficient, setFixedCoefficient] = useState("");
  const [bitumenProportion, setBitumenProportion] = useState("");
  const [dieselProportion, setDieselProportion] = useState("");
  const [tableRows, setTableRows] = useState([
    {
      id: 1,
      year: "",
      month: "",
      day: "",
      cost: "",
      money: "",
      index: "",
      pn: "",
      result: "",
    },
  ]);
  const [rowTotal, setRowTotal] = useState("0.00");
  const [indexesData, setIndexesData] = useState({});
  const [bitumIndexesData, setBitumIndexesData] = useState({});
  const [dieselIndexesData, setDieselIndexesData] = useState({});
  const [maxTenderMonthKey, setMaxTenderMonthKey] = useState("2026-12");
  const [companyData, setCompanyData] = useState(null);
  const [identCode, setIdentCode] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [customer, setCustomer] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isWorkPeriodWarningOpen, setIsWorkPeriodWarningOpen] = useState(false);

  const subtractDays = (dateValue, daysToSubtract) => {
    if (!dateValue) return null;

    const [year, month, day] = dateValue.split("-").map(Number);
    if (!year || !month || !day) return null;

    const utcDate = new Date(Date.UTC(year, month - 1, day));
    utcDate.setUTCDate(utcDate.getUTCDate() - daysToSubtract);

    return utcDate;
  };

  const tenderMinus28Date = subtractDays(tenderOpenDate, 28);
  const tenderMinus28MonthKey = tenderMinus28Date
    ? `${tenderMinus28Date.getUTCFullYear()}-${String(tenderMinus28Date.getUTCMonth() + 1).padStart(2, "0")}`
    : "";

  const maxTenderDate = (() => {
    const [maxYear, maxMonth] = maxTenderMonthKey.split("-").map(Number);
    if (!maxYear || !maxMonth) return "2026-12-31";
    const lastDay = getLastDayOfMonth(maxYear, maxMonth);
    return `${maxYear}-${String(maxMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  })();

  const availableTenderMonthKeysForPeriodTwo = Object.keys(indexesData)
    .filter(
      (monthKey) =>
        compareMonthKeys(monthKey, SECOND_PERIOD_MIN_MONTH_KEY) >= 0,
    )
    .sort(compareMonthKeys);

  const tenderMonthsByYearForPeriodTwo =
    availableTenderMonthKeysForPeriodTwo.reduce((acc, monthKey) => {
      const [year, month] = monthKey.split("-");
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(month);
      return acc;
    }, {});

  const tenderYearOptionsForPeriodTwo = Object.keys(
    tenderMonthsByYearForPeriodTwo,
  ).sort((a, b) => Number(a) - Number(b));

  const [selectedTenderYear, selectedTenderMonth, selectedTenderDay] =
    tenderOpenDate ? tenderOpenDate.split("-") : ["", "", ""];

  const tenderMonthOptionsForSelectedYear = selectedTenderYear
    ? tenderMonthsByYearForPeriodTwo[selectedTenderYear] || []
    : [];

  const tenderDayOptionsForSelectedMonth =
    selectedTenderYear && selectedTenderMonth
      ? Array.from(
          {
            length: getLastDayOfMonth(selectedTenderYear, selectedTenderMonth),
          },
          (_, dayIndex) => String(dayIndex + 1).padStart(2, "0"),
        )
      : [];

  let baseMonthText = "";
  if (indexationPeriod === "3") {
    baseMonthText = t("დეკემბერი", "December");
  } else if (
    (indexationPeriod === "1" || indexationPeriod === "2") &&
    tenderMinus28MonthKey
  ) {
    baseMonthText = formatMonthKeyLabel(tenderMinus28MonthKey, language);
  }

  // Clear tender date if switching to option 3
  useEffect(() => {
    if (indexationPeriod === "3" && tenderOpenDate) {
      setTenderOpenDate("");
    }
  }, [indexationPeriod]);

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
        const bitumMap = {};
        const dieselMap = {};
        let latestMonthKey = "";

        rows.forEach((r) => {
          const hasIndexValue =
            r.indexes !== null && r.indexes !== undefined && r.indexes !== "";

          if (hasIndexValue) {
            const monthKey = `${r.year}-${String(r.month).padStart(2, "0")}`;
            map[monthKey] = Number(r.indexes);
            if (
              !latestMonthKey ||
              compareMonthKeys(monthKey, latestMonthKey) > 0
            ) {
              latestMonthKey = monthKey;
            }
          }

          if (
            r.bitum_indexes !== null &&
            r.bitum_indexes !== undefined &&
            r.bitum_indexes !== ""
          ) {
            bitumMap[`${r.year}-${String(r.month).padStart(2, "0")}`] = Number(
              r.bitum_indexes,
            );
          }

          if (
            r.diesel_indexes !== null &&
            r.diesel_indexes !== undefined &&
            r.diesel_indexes !== ""
          ) {
            dieselMap[`${r.year}-${String(r.month).padStart(2, "0")}`] = Number(
              r.diesel_indexes,
            );
          }
        });

        setIndexesData(map);
        setBitumIndexesData(bitumMap);
        setDieselIndexesData(dieselMap);
        if (latestMonthKey) {
          setMaxTenderMonthKey(latestMonthKey);
        }
      })
      .catch(() => {
        setIndexesData({});
        setBitumIndexesData({});
        setDieselIndexesData({});
      });
  }, []);

  useEffect(() => {
    if (indexationPeriod !== "2" || !tenderOpenDate) {
      return;
    }

    const [year, month, day] = tenderOpenDate.split("-");
    if (!year || !month || !day) {
      setTenderOpenDate("");
      return;
    }

    const selectedMonthKey = `${year}-${month}`;
    if (!availableTenderMonthKeysForPeriodTwo.includes(selectedMonthKey)) {
      setTenderOpenDate("");
      return;
    }

    const maxDay = getLastDayOfMonth(year, month);
    if (Number(day) > maxDay) {
      setTenderOpenDate(`${year}-${month}-${String(maxDay).padStart(2, "0")}`);
    }
  }, [indexationPeriod, tenderOpenDate, availableTenderMonthKeysForPeriodTwo]);

  const handleTenderDateChangeForPeriodOne = (selectedDate) => {
    setTenderOpenDate(
      selectedDate >= TENDER_MIN_DATE && selectedDate <= maxTenderDate
        ? selectedDate
        : "",
    );
  };

  const handleTenderYearChangeForPeriodTwo = (nextYear) => {
    const monthsForYear = tenderMonthsByYearForPeriodTwo[nextYear] || [];
    if (!nextYear || monthsForYear.length === 0) {
      setTenderOpenDate("");
      return;
    }

    const nextMonth = monthsForYear.includes(selectedTenderMonth)
      ? selectedTenderMonth
      : monthsForYear[0];
    const maxDay = getLastDayOfMonth(nextYear, nextMonth);
    const nextDay = Math.min(
      Math.max(Number(selectedTenderDay || 1), 1),
      maxDay,
    );

    setTenderOpenDate(
      `${nextYear}-${nextMonth}-${String(nextDay).padStart(2, "0")}`,
    );
  };

  const handleTenderMonthChangeForPeriodTwo = (nextMonth) => {
    if (!selectedTenderYear || !nextMonth) {
      setTenderOpenDate("");
      return;
    }

    const maxDay = getLastDayOfMonth(selectedTenderYear, nextMonth);
    const nextDay = Math.min(
      Math.max(Number(selectedTenderDay || 1), 1),
      maxDay,
    );

    setTenderOpenDate(
      `${selectedTenderYear}-${nextMonth}-${String(nextDay).padStart(2, "0")}`,
    );
  };

  const handleTenderDayChangeForPeriodTwo = (nextDay) => {
    if (!selectedTenderYear || !selectedTenderMonth || !nextDay) {
      setTenderOpenDate("");
      return;
    }

    setTenderOpenDate(
      `${selectedTenderYear}-${selectedTenderMonth}-${nextDay}`,
    );
  };

  const calculateSum = () => {
    const fixed = Number(fixedCoefficient.replace(",", ".")) || 0;
    const bitumen = Number(bitumenProportion.replace(",", ".")) || 0;
    const diesel = Number(dieselProportion.replace(",", ".")) || 0;
    return fixed + bitumen + diesel;
  };

  const checkFieldValidity = (value) => {
    if (value.trim() === "") return true;
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100;
  };

  const checkSumValidity = (sum) => {
    // Sum must be exactly 100%.
    return Math.abs(sum - 100) < 0.01;
  };

  const fixedValid = checkFieldValidity(fixedCoefficient);
  const bitumenValid = checkFieldValidity(bitumenProportion);
  const dieselValid = checkFieldValidity(dieselProportion);
  const hasInvalidField = !fixedValid || !bitumenValid || !dieselValid;

  const totalSum = calculateSum();
  const isSumValid = checkSumValidity(totalSum);
  const allFieldsFilled =
    fixedCoefficient.trim() !== "" &&
    bitumenProportion.trim() !== "" &&
    dieselProportion.trim() !== "";

  const clampResultByMoneyLimit = (resultValue, moneyValue) => {
    const maxAllowed = moneyValue * 0.1;
    return resultValue > maxAllowed ? maxAllowed : resultValue;
  };

  const baseMonthKeyForCalc =
    indexationPeriod === "3"
      ? "2025-12"
      : (indexationPeriod === "1" || indexationPeriod === "2") &&
          tenderMinus28MonthKey
        ? tenderMinus28MonthKey
        : "";

  const baseMonthForDoc =
    indexationPeriod === "3"
      ? t("2025 წლის დეკემბერი", "December 2025")
      : (indexationPeriod === "1" || indexationPeriod === "2") &&
          tenderMinus28Date
        ? t(
            `${tenderMinus28Date.getUTCFullYear()} წლის ${formatMonthKeyLabel(tenderMinus28MonthKey, language)}`,
            `${formatMonthKeyLabel(tenderMinus28MonthKey, language)} ${tenderMinus28Date.getUTCFullYear()}`,
          )
        : t("არ არის არჩეული", "Not selected");

  const calculateConstructionFormula = (bitumRatio, dieselRatio, money) => {
    const fixedInput = Number(fixedCoefficient.replace(",", ".")) || 0;
    const bitumenInput = Number(bitumenProportion.replace(",", ".")) || 0;
    const dieselInput = Number(dieselProportion.replace(",", ".")) || 0;

    const fixed = fixedInput / 100;
    const bitumen = bitumenInput / 100;
    const diesel = dieselInput / 100;
    const bitumenPart = bitumen * bitumRatio;
    const dieselPart = diesel * dieselRatio;

    // PN = fixed/100 + (bitumen/100 * bitum_ratio) + (diesel/100 * diesel_ratio)
    const pn = fixed + bitumenPart + dieselPart;
    const rawResult = money * pn - money;
    const cappedResult = clampResultByMoneyLimit(rawResult, money);

    console.log("[QuestionTwo][Radio1] PN calculation", {
      formula:
        "pn = fixed/100 + (bitumen/100 * (bitum_row/bitum_base)) + (diesel/100 * (diesel_row/diesel_base))",
      expandedPnFormula: `${fixedInput}/100 + (${bitumenInput}/100 * ${bitumRatio}) + (${dieselInput}/100 * ${dieselRatio}) = ${pn}`,
      resultFormula: "result = money * pn - money",
      fixedInput,
      bitumenInput,
      dieselInput,
      fixed,
      bitumen,
      diesel,
      bitumRatio,
      dieselRatio,
      bitumenPart,
      dieselPart,
      pn,
      pnRounded3: Number(pn.toFixed(3)),
      money,
      rawResult,
      cappedResult,
      expandedResult: `${pn} * ${money} - ${money} = ${rawResult}`,
    });

    return {
      money: "",
      index: "",
      pn: pn.toFixed(3),
      result: cappedResult.toFixed(2),
    };
  };

  const calculateRepairFormula = (ratio, money) => {
    // QuestionOne formula for repair works (workType === "2")
    const indexValue = ratio * 100;
    const rawResult = money * ratio - money;
    const cappedResult = clampResultByMoneyLimit(rawResult, money);

    console.log("[QuestionTwo][Radio2] Q1-style calculation", {
      formula: "result = money * (rowIdx/baseIdx) - money",
      resultFormula: "result = money * pn - money, სადაც pn = rowIdx/baseIdx",
      ratio,
      indexValue,
      money,
      rawResult,
      cappedResult,
      expandedResult: `${ratio} * ${money} - ${money} = ${rawResult}`,
    });

    return {
      money: money.toFixed(2),
      index: indexValue.toFixed(2),
      pn: "",
      result: cappedResult.toFixed(2),
    };
  };

  const getAvailableMonthsForYear = (year) => {
    if (!year) return [];

    const months = new Set();
    Object.keys(indexesData).forEach((key) => {
      const [keyYear, keyMonth] = key.split("-");
      if (keyYear === String(year)) {
        months.add(Number(keyMonth));
      }
    });

    return Array.from(months).sort((a, b) => a - b);
  };

  const isWorkPeriodBeforeBaseMonth = (year, month) => {
    if (!baseMonthKeyForCalc || !year || !month) return false;
    const selectedMonthKey = `${year}-${String(month).padStart(2, "0")}`;
    return compareMonthKeys(selectedMonthKey, baseMonthKeyForCalc) < 0;
  };

  const getMonthOptionLabel = (month) => {
    const monthNum = Number(month);
    const geMonths = [
      "იანვარი",
      "თებერვალი",
      "მარტი",
      "აპრილი",
      "მაისი",
      "ივნისი",
      "ივლისი",
      "აგვისტო",
      "სექტემბერი",
      "ოქტომბერი",
      "ნოემბერი",
      "დეკემბერი",
    ];
    const enMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return language === "GE"
      ? geMonths[monthNum - 1] || String(month)
      : enMonths[monthNum - 1] || String(month);
  };

  const recalculateRow = (row) => {
    const costNum = Number(row.cost);
    if (row.cost === "" || Number.isNaN(costNum)) {
      return { ...row, money: "", index: "", pn: "", result: "" };
    }

    if (isWorkPeriodBeforeBaseMonth(row.year, row.month)) {
      return { ...row, money: "", index: "", pn: "", result: "" };
    }

    const money = workType === "2" ? costNum * 0.15 : costNum;

    if (!row.year || !row.month || !row.day || !baseMonthKeyForCalc) {
      return {
        ...row,
        money: workType === "2" ? money.toFixed(2) : "",
        index: "",
        pn: "",
        result: "",
      };
    }

    const dateStr = `${row.year}-${String(row.month).padStart(2, "0")}-${String(row.day).padStart(2, "0")}`;
    const dateMinus49 = subtractDays(dateStr, 49);
    if (!dateMinus49) {
      return {
        ...row,
        money: workType === "2" ? money.toFixed(2) : "",
        index: "",
        pn: "",
        result: "",
      };
    }

    const rowKeyMinus49 = `${dateMinus49.getUTCFullYear()}-${String(dateMinus49.getUTCMonth() + 1).padStart(2, "0")}`;
    const rowBitumIdx = bitumIndexesData[rowKeyMinus49];
    const baseBitumIdx = bitumIndexesData[baseMonthKeyForCalc];
    const bitumRatio =
      rowBitumIdx != null && baseBitumIdx != null
        ? rowBitumIdx / baseBitumIdx
        : null;

    const rowDieselIdx = dieselIndexesData[rowKeyMinus49];
    const baseDieselIdx = dieselIndexesData[baseMonthKeyForCalc];
    const dieselRatio =
      rowDieselIdx != null && baseDieselIdx != null
        ? rowDieselIdx / baseDieselIdx
        : null;

    console.log("[QuestionTwo] Row source data", {
      workType,
      rowId: row.id,
      rowDate: dateStr,
      rowKeyMinus49,
      baseMonthKeyForCalc,
      rowBitumIdx,
      baseBitumIdx,
      rowDieselIdx,
      baseDieselIdx,
      bitumRatio,
      dieselRatio,
      costNum,
      money,
    });

    let calcResult;
    if (workType === "2") {
      const rowIdx = indexesData[rowKeyMinus49];
      const baseIdx = indexesData[baseMonthKeyForCalc];
      const ratio = rowIdx != null && baseIdx != null ? rowIdx / baseIdx : null;

      if (ratio === null) {
        return {
          ...row,
          money: money.toFixed(2),
          index: "",
          pn: "",
          result: "",
        };
      }

      // Repair works formula (QuestionOne formula)
      calcResult = calculateRepairFormula(ratio, money);
    } else if (workType === "1") {
      if (bitumRatio === null || dieselRatio === null) {
        return {
          ...row,
          money: "",
          index: "",
          pn: "",
          result: "",
        };
      }

      // Radio 1 formula using bitum_indexes and diesel_indexes.
      calcResult = calculateConstructionFormula(bitumRatio, dieselRatio, money);
    } else {
      return {
        ...row,
        money: "",
        index: "",
        pn: "",
        result: "",
      };
    }

    return {
      ...row,
      money: calcResult.money,
      index: calcResult.index,
      pn: calcResult.pn || "",
      result: calcResult.result,
    };
  };

  const updateTableRow = (id, field, value) => {
    updateTableRowValues(id, { [field]: value });
  };

  const updateTableRowValues = (id, updates) => {
    const hasPeriodUpdate =
      Object.prototype.hasOwnProperty.call(updates, "year") ||
      Object.prototype.hasOwnProperty.call(updates, "month");

    if (hasPeriodUpdate) {
      const currentRow = tableRows.find((row) => row.id === id);
      if (currentRow) {
        const nextRow = { ...currentRow, ...updates };
        if (isWorkPeriodBeforeBaseMonth(nextRow.year, nextRow.month)) {
          setIsWorkPeriodWarningOpen(true);
        }
      }
    }

    setTableRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        return recalculateRow({ ...row, ...updates });
      }),
    );
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
        pn: "",
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

  const getDaysInMonth = (year, month) => {
    if (!year || !month) return [];
    const count = new Date(Number(year), Number(month), 0).getDate();
    return Array.from({ length: count }, (_, i) => i + 1);
  };

  useEffect(() => {
    setTableRows((prev) => prev.map((row) => recalculateRow(row)));
  }, [
    baseMonthKeyForCalc,
    indexesData,
    bitumIndexesData,
    dieselIndexesData,
    workType,
    fixedCoefficient,
    bitumenProportion,
    dieselProportion,
  ]);

  useEffect(() => {
    setTableRows((prev) =>
      prev.map((row) => {
        const availableMonths = getAvailableMonthsForYear(row.year).map(String);
        if (!row.month || availableMonths.includes(String(row.month))) {
          return row;
        }

        return recalculateRow({ ...row, month: "", day: "" });
      }),
    );
  }, [indexesData]);

  useEffect(() => {
    const total = tableRows.reduce((sum, row) => {
      const value = Number(row.result);
      return sum + (Number.isNaN(value) ? 0 : value);
    }, 0);
    setRowTotal(total.toFixed(2));
  }, [tableRows]);

  const workTypeSection = (
    <div className="mt-6">
      <p className="bpg_mrgvlovani_caps font-bold">
        {t(
          "1. გთხოვთ, აირჩიოთ სამუშაოს ტიპი",
          "1. Please Select the type of work",
        )}
      </p>
      <div className="mt-4 flex flex-col gap-3">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="radio"
            name="workType-question-two"
            value="1"
            checked={workType === "1"}
            onChange={(e) => setWorkType(e.target.value)}
            className="mt-1 cursor-pointer accent-[#01389c]"
          />
          <span className="bpg_mrgvlovani_caps text-sm">
            {t("სამშენებლო სამუშაოები", "Construction works")}
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="radio"
            name="workType-question-two"
            value="2"
            checked={workType === "2"}
            onChange={(e) => setWorkType(e.target.value)}
            className="mt-1 cursor-pointer accent-[#01389c]"
          />
          <span className="bpg_mrgvlovani_caps text-sm">
            {t(
              "მიმდინარე შეკეთების სამუშაოები (რომელიც არ გულისხმობს მშენებლობას, რეაბილიტაციას, მოდერნიზაციას, რეკონსტრუქციას)",
              "Current repair works (which do not include construction, rehabilitation, modernization, reconstruction)",
            )}
          </span>
        </label>
      </div>

      <div className="mt-6">
        <p className="bpg_mrgvlovani_caps font-bold">
          {t(
            "2. გთხოვთ, აირჩიოთ საინდექსაციო პერიოდი",
            "2. Please select the indexation period",
          )}
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="indexationPeriod-question-two"
              value="1"
              checked={indexationPeriod === "1"}
              onChange={(e) => setIndexationPeriod(e.target.value)}
              className="mt-1 cursor-pointer accent-[#01389c]"
            />
            <span className="bpg_mrgvlovani_caps text-sm">
              {t(
                "მიმდინარე ხელშეკრულებების ფარგლებში 2026 წლის პირველი აპრილიდან შესრულებული სამუშაოები",
                "Works performed under current contracts from 1 April 2026 ",
              )}
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="indexationPeriod-question-two"
              value="2"
              checked={indexationPeriod === "2"}
              onChange={(e) => setIndexationPeriod(e.target.value)}
              className="mt-1 cursor-pointer accent-[#01389c]"
            />
            <span className="bpg_mrgvlovani_caps text-sm">
              {t(
                "2026 პირველი ივნისიდან 2027 წლის პირველ იანვრამდე გამოცხადებული ტენდერების ფარგლებში შესრულებული სამუშაოები.",
                "Works performed under tenders announced from 1 June 2026 until 1 January 2027",
              )}
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="indexationPeriod-question-two"
              value="3"
              checked={indexationPeriod === "3"}
              onChange={(e) => setIndexationPeriod(e.target.value)}
              className="mt-1 cursor-pointer accent-[#01389c]"
            />
            <div>
              <span className="bpg_mrgvlovani_caps text-sm">
                {t(
                  "მიმდინარე და 2026 წლის პირველ ივნისამდე გამოცახდებული ტენდერების ფარგლებში შესრულებული სამუშაოები.",
                  "Works performed under current tenders and tenders announced before 1 June 2026",
                )}
              </span>
              <p className="bpg_mrgvlovani_caps mt-1 text-xs italic text-[#01389c]">
                {t("2026 წლის 3 ივნისის მდგომარეობით*", "As of June 3, 2026*")}
              </p>
            </div>
          </label>
        </div>

        {indexationPeriod === "3" && baseMonthText && (
          <div className="bpg_mrgvlovani_caps mt-5 inline-flex max-w-full items-center rounded-md border border-[#bfd6ff] bg-[#eef5ff] px-3 py-2 text-sm leading-5 text-[#01389c]">
            {`${t("საბაზო თვე", "Base Month")} - ${baseMonthText} 2025`}
          </div>
        )}

        {(indexationPeriod === "1" || indexationPeriod === "2") && (
          <div className="mt-6">
            <p className="bpg_mrgvlovani_caps font-bold">
              {t(
                "3.გთხოვთ, მიუთითოთ ტენდერის გახსნის თარიღი",
                "3. Date of tender opening ",
              )}
            </p>
            <p className="bpg_mrgvlovani_caps mt-2 text-xs italic text-gray-600">
              {t(
                "საბაზო პერიოდი განისაზღვრება ტენდერის გახსნის თარიღიდან 28 დღით ადრინდელი თარიღის შესაბამისი თვით.",
                "the base period shall be determined as the month corresponding to the date 28 days prior to the tender opening date.",
              )}
            </p>
            <div className="mt-4 w-full max-w-[420px]">
              {indexationPeriod === "1" && (
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
                    min={TENDER_MIN_DATE}
                    max={maxTenderDate}
                    onChange={(e) =>
                      handleTenderDateChangeForPeriodOne(e.target.value)
                    }
                    className="bpg_mrgvlovani_caps w-full bg-transparent text-sm text-[#01389c] outline-none"
                  />
                </div>
              )}

              {indexationPeriod === "2" && (
                <div className="space-y-2">
                  {availableTenderMonthKeysForPeriodTwo.length === 0 ? (
                    <p className="bpg_mrgvlovani_caps rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                      {t(
                        "2026 წლის ივნისიდან ტენდერის თარიღისთვის ინდექსის მონაცემები ვერ მოიძებნა.",
                        "No index data is available for tender dates starting from June 2026.",
                      )}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <select
                        value={selectedTenderYear}
                        onChange={(e) =>
                          handleTenderYearChangeForPeriodTwo(e.target.value)
                        }
                        className="bpg_mrgvlovani_caps h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#01389c]"
                      >
                        <option value="" disabled>
                          {t("წელი", "Year")}
                        </option>
                        {tenderYearOptionsForPeriodTwo.map((yearOption) => (
                          <option key={yearOption} value={yearOption}>
                            {yearOption}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedTenderMonth}
                        onChange={(e) =>
                          handleTenderMonthChangeForPeriodTwo(e.target.value)
                        }
                        disabled={!selectedTenderYear}
                        className="bpg_mrgvlovani_caps h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#01389c] disabled:cursor-not-allowed disabled:bg-gray-100"
                      >
                        <option value="" disabled>
                          {t("თვე", "Month")}
                        </option>
                        {tenderMonthOptionsForSelectedYear.map(
                          (monthOption) => (
                            <option key={monthOption} value={monthOption}>
                              {getMonthOptionLabel(Number(monthOption))}
                            </option>
                          ),
                        )}
                      </select>

                      <select
                        value={selectedTenderDay}
                        onChange={(e) =>
                          handleTenderDayChangeForPeriodTwo(e.target.value)
                        }
                        disabled={!selectedTenderYear || !selectedTenderMonth}
                        className="bpg_mrgvlovani_caps h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#01389c] disabled:cursor-not-allowed disabled:bg-gray-100"
                      >
                        <option value="" disabled>
                          {t("რიცხვი", "Date")}
                        </option>
                        {tenderDayOptionsForSelectedMonth.map((dayOption) => (
                          <option key={dayOption} value={dayOption}>
                            {Number(dayOption)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {(indexationPeriod === "1" || indexationPeriod === "2") &&
          tenderOpenDate &&
          baseMonthText && (
            <div className="bpg_mrgvlovani_caps mt-5 inline-flex max-w-full items-center rounded-md border border-[#bfd6ff] bg-[#eef5ff] px-3 py-2 text-sm leading-5 text-[#01389c]">
              {`${t("საბაზო თვე", "Base Month")} - ${baseMonthText} ${tenderMinus28Date?.getUTCFullYear()}`}
            </div>
          )}

        {workType !== "2" && (
          <div className="mt-6">
            <p className="bpg_mrgvlovani_caps font-bold">
              {t("4. ფასთა ინდექსაციის ფორმულა", "4. Price Indexation Formula")}
            </p>
            <p className="bpg_mrgvlovani_caps mt-2 text-sm">
              {t(
                "გთხოვთ, შეავსოთ შემდეგი ველები (მიუთითეთ პროცენტული ოდენობა):",
                "Please fill in the following fields (specify percentage):",
              )}
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="bpg_mrgvlovani_caps block text-sm font-medium text-[#01389c] mb-2">
                  {t(
                    "ფიქსირებული კოეფიციენტი, რომელიც წარმოადგენს სახელშეკრულებო ღირებულების არაკორექტირებად ნაწილს (%)",
                    "Fixed coefficient representing the non-adjustable part of the contract value (%)",
                  )}
                </label>
                <input
                  type="number"
                  value={fixedCoefficient}
                  onChange={(e) => setFixedCoefficient(e.target.value)}
                  min="0"
                  step="0.01"
                  className={`w-full md:w-72 rounded-md border px-3 py-2 text-sm outline-none focus:border-[#01389c] focus:ring-1 focus:ring-[#01389c] ${
                    fixedValid ? "border-gray-300" : "border-red-500"
                  }`}
                />
                {!fixedValid && (
                  <p className="bpg_mrgvlovani_caps mt-1 text-xs text-red-600">
                    {t(
                      "მნიშვნელობა უნდა იყოს 0-100%",
                      "Value must be between 0-100%",
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="bpg_mrgvlovani_caps block text-sm font-medium text-[#01389c] mb-2">
                  {t(
                    "ინდექსაციას დაქვემდებარებული კომპონენტის - ბიტუმის - პროპორცია (ხვედრითი წილი) (%)",
                    "Indexable component - Bitumen - proportion (%)",
                  )}
                </label>
                <input
                  type="number"
                  value={bitumenProportion}
                  onChange={(e) => setBitumenProportion(e.target.value)}
                  min="0"
                  step="0.01"
                  className={`w-full md:w-72 rounded-md border px-3 py-2 text-sm outline-none focus:border-[#01389c] focus:ring-1 focus:ring-[#01389c] ${
                    bitumenValid ? "border-gray-300" : "border-red-500"
                  }`}
                />
                {!bitumenValid && (
                  <p className="bpg_mrgvlovani_caps mt-1 text-xs text-red-600">
                    {t(
                      "მნიშვნელობა უნდა იყოს 0-100%",
                      "Value must be between 0-100%",
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="bpg_mrgvlovani_caps block text-sm font-medium text-[#01389c] mb-2">
                  {t(
                    "ინდექსაციას დაქვემდებარებული კომპონენტის - დიზელის - პროპორცია (ხვედრითი წილი) (%)",
                    "Indexable component - Diesel - proportion (%)",
                  )}
                </label>
                <input
                  type="number"
                  value={dieselProportion}
                  onChange={(e) => setDieselProportion(e.target.value)}
                  min="0"
                  step="0.01"
                  className={`w-full md:w-72 rounded-md border px-3 py-2 text-sm outline-none focus:border-[#01389c] focus:ring-1 focus:ring-[#01389c] ${
                    dieselValid ? "border-gray-300" : "border-red-500"
                  }`}
                />
                {!dieselValid && (
                  <p className="bpg_mrgvlovani_caps mt-1 text-xs text-red-600">
                    {t(
                      "მნიშვნელობა უნდა იყოს 0-100%",
                      "Value must be between 0-100%",
                    )}
                  </p>
                )}
              </div>
              {allFieldsFilled && !hasInvalidField && !isSumValid && (
                <p className="bpg_mrgvlovani_caps text-sm text-red-600">
                  {t(
                    "ჯამი უნდა იყოს ზუსტად 100%",
                    "Total must be exactly 100%",
                  )}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8">
          <p className="bpg_mrgvlovani_caps mb-4 font-bold">
            {t(
              "5. ინფორმაცია შესრულებული სამუშაოს შესახებ",
              "5. Information about the performed work",
            )}
          </p>
          <div className="space-y-4 md:hidden">
            {tableRows.map((row, index) => {
              const availableMonthsForYear = getAvailableMonthsForYear(
                row.year,
              );

              return (
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
                        onChange={(e) => {
                          const nextYear = e.target.value;
                          const availableMonths =
                            getAvailableMonthsForYear(nextYear).map(String);
                          const keepSelectedMonth = availableMonths.includes(
                            String(row.month),
                          );

                          updateTableRowValues(row.id, {
                            year: nextYear,
                            month: keepSelectedMonth ? row.month : "",
                            day: keepSelectedMonth ? row.day : "",
                          });
                        }}
                        className="bpg_mrgvlovani_caps h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#01389c]"
                      >
                        <option value="" disabled>
                          {t("წელი", "Year")}
                        </option>
                        {["2026"].map((y) => (
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
                          updateTableRowValues(row.id, {
                            month: e.target.value,
                            day: "",
                          })
                        }
                        className="bpg_mrgvlovani_caps h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#01389c]"
                      >
                        <option value="" disabled>
                          {t("თვე", "Month")}
                        </option>
                        {Array.from(
                          { length: 12 },
                          (_, monthIndex) => monthIndex + 1,
                        ).map((monthValue) => {
                          const hasIndexForMonth =
                            availableMonthsForYear.includes(monthValue);

                          return (
                            <option
                              key={monthValue}
                              value={monthValue}
                              disabled={!hasIndexForMonth}
                            >
                              {getMonthOptionLabel(monthValue)}
                            </option>
                          );
                        })}
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

                    {workType === "2" && (
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
                    )}

                    <div>
                      <label className="bpg_mrgvlovani_caps mb-1 block text-xs font-semibold text-[#01389c]">
                        {workType === "1"
                          ? t("PN", "PN")
                          : t(
                              "მშენებლობის ღირებულების ინდექსი საბაზო პერიოდთან შედარებით",
                              "Construction Cost Index compared to the base period",
                            )}
                      </label>
                      <input
                        type="text"
                        value={workType === "1" ? row.pn : row.index}
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
              );
            })}

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
                  {workType === "2" ? (
                    <>
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
                    </>
                  ) : (
                    <th
                      rowSpan={2}
                      className="bpg_mrgvlovani_caps border border-[#4a6fb2] px-2 py-2 text-center align-middle whitespace-normal text-[9px] leading-tight md:text-[10px]"
                    >
                      {t("PN", "PN")}
                    </th>
                  )}
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
                {tableRows.map((row, index) =>
                  (() => {
                    const availableMonthsForYear = getAvailableMonthsForYear(
                      row.year,
                    );
                    return (
                      <tr key={row.id} className="bg-white hover:bg-[#f7faff]">
                        <td className="w-8 border border-gray-300 px-0.5 py-1.5 text-center align-middle text-xs">
                          {row.id}
                        </td>
                        <td className="border border-gray-300 px-1 py-1">
                          <select
                            value={row.year}
                            onChange={(e) => {
                              const nextYear = e.target.value;
                              const availableMonths =
                                getAvailableMonthsForYear(nextYear).map(String);
                              const keepSelectedMonth =
                                availableMonths.includes(String(row.month));

                              updateTableRowValues(row.id, {
                                year: nextYear,
                                month: keepSelectedMonth ? row.month : "",
                                day: keepSelectedMonth ? row.day : "",
                              });
                            }}
                            className="bpg_mrgvlovani_caps h-8 w-full min-w-0 rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:border-[#01389c]"
                          >
                            <option value="" disabled>
                              {t("წელი", "Year")}
                            </option>
                            {["2026"].map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-1 py-1">
                          <select
                            value={row.month}
                            onChange={(e) =>
                              updateTableRowValues(row.id, {
                                month: e.target.value,
                                day: "",
                              })
                            }
                            className="bpg_mrgvlovani_caps h-8 w-full min-w-0 rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:border-[#01389c]"
                          >
                            <option value="" disabled>
                              {t("თვე", "Month")}
                            </option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                              (m) => {
                                const hasIndexForMonth =
                                  availableMonthsForYear.includes(m);
                                return (
                                  <option
                                    key={m}
                                    value={m}
                                    disabled={!hasIndexForMonth}
                                  >
                                    {getMonthOptionLabel(m)}
                                  </option>
                                );
                              },
                            )}
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
                        {workType === "2" && (
                          <td className="border border-gray-300 px-1 py-1">
                            <input
                              type="text"
                              value={row.money}
                              readOnly
                              className="h-8 w-full min-w-0 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs outline-none"
                            />
                          </td>
                        )}
                        <td className="border border-gray-300 px-1 py-1">
                          <input
                            type="text"
                            value={workType === "1" ? row.pn : row.index}
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
                    );
                  })(),
                )}
                <tr>
                  <td
                    colSpan={workType === "2" ? 9 : 8}
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
                    colSpan={workType === "2" ? 9 : 8}
                    className="bpg_mrgvlovani_caps border-0 pb-2 text-left text-xs font-bold"
                  >
                    {t(
                      "* შემსყიდველი ვალდებულია ანგარიშსწორებამდე გადაამოწმოს მიმწოდებლის მიერ შევსებული მონაცემების სისწორე",
                      "* The purchaser is obligated to verify the accuracy of the data provided by the supplier before the reimbursement verify the accuracy of the data entered by the supplier before settlement",
                    )}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={workType === "2" ? 7 : 6}
                    className="border border-gray-300"
                  />
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
          <QuestionTwoDocumentGeneration
            language={language}
            confirmed={confirmed}
            onConfirmedChange={setConfirmed}
            workType={workType}
            companyData={companyData}
            identCode={identCode}
            contractNumber={contractNumber}
            customer={customer}
            tableRows={tableRows}
            rowTotal={rowTotal}
            baseMonthForDoc={baseMonthForDoc}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <QuestionOne
        language={language}
        questionnaireType="questionnaire2"
        baseSectionOnly
        showBasePeriod={false}
        hideExtraUntilBaseFieldsFilled
        extraSection={workTypeSection}
        setCompanyData={setCompanyData}
        setIdentCode={setIdentCode}
        setContractNumber={setContractNumber}
        setCustomer={setCustomer}
        companyData={companyData}
        identCode={identCode}
        contractNumber={contractNumber}
        customer={customer}
      />

      {isWorkPeriodWarningOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
            <h3 className="bpg_mrgvlovani_caps text-base font-bold text-[#01389c]">
              {t("შენიშვნა", "Notice")}
            </h3>
            <p className="bpg_mrgvlovani_caps mt-3 text-sm text-[#334155]">
              {t(
                "სამუშაოს შესრულების პერიოდი არ შეიძლება იყოს საბაზო პერიოდზე ნაკლები.",
                "The work period cannot be earlier than the base period.",
              )}
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsWorkPeriodWarningOpen(false)}
                className="bpg_mrgvlovani_caps rounded-md border border-[#01389c] px-4 py-2 text-sm font-semibold text-[#01389c] transition-colors hover:bg-[#01389c] hover:text-white"
              >
                {t("გასაგებია", "OK")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionTwo;
