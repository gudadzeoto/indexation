import React from "react";
import QuestionOne from "./QuestionOne";

const QuestionThree = ({ language = "GE" }) => {
  return (
    <QuestionOne
      language={language}
      questionnaireType="questionnaire3"
      questionnaireMode="questionnaire3"
      showBasePeriod={false}
      indexationMoneyShare={0.6}
    />
  );
};

export default QuestionThree;