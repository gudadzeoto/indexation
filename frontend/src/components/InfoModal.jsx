import React, { useEffect } from "react";

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
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
            {language === "GE" ? (
              questionnaireType === "questionnaire1" ? (
                <>
                  <p className="font-bold">როგორ მუშაობს ფასთა ინდექსაციის კალკულატორი.</p>
                  <p className="mt-4">
                    ფასთა ინდექსაციის კალკულატორი შექმნილია "ინფრასტრუქტურული პროექტების
                    განხორციელების ხელშეწყობის მიზნით ფასთა ინდექსაციის გამოყენების საფუძვლების,
                    პრინციპებისა და წესის დამტკიცების თაობაზე" საქართველოს მთავრობის №753
                    განკარგულების მიხედვით. კალკულატორის მიზანია, ფასთა ინდექსაციით მოსარგებლე
                    სამშენებლო კომპანიებისთვის მარტივი პროცედურის შეთავაზება, რომელიც საშუალებას
                    მისცემთ ფასთა ინდექსაციის შესახებ დასკვნა მიიღონ ონლაინ რეჟიმში. თანხის
                    ინდექსაციის მიზნით კალკულატორი იყენებს ჯაჭვურად გადაბმული მშენებლობის
                    ღირებულების ინდექსის (Construction Cost Index - CCI) მნიშვნელობებს. CCI
                    შემუშავებულია საქსტატის მიერ საერთაშორისო მეთოდოლოგიისა და სტანდარტების
                    მიხედვით.
                  </p>

                  <p className="font-bold mt-4">1. აირჩიეთ საბაზო პერიოდი</p>
                  <p>
                    №753 განკარგულების თანახმად, მიმდინარე ხელშეკრულების ფარგლებში 2022 წლის 1
                    აპრილიდან შესრულებული და შემდგომში ანაზღაურებული სამუშაოებისთვის საბაზო თვის
                    სახით გამოიყენება 2022 წლის თებერვალი. პირველი პუნქტის არჩევისას მე-2 ეტაპის
                    (ტენდერის გახსნის თარიღის) შევსება საჭირო აღარ არის. რაც შეეხება მიმდინარე და
                    2022 წლის 1 მაისამდე გამოცხადებული ტენდერების ფარგლებში შესრულებულ და
                    შემდგომში ანაზღაურებულ სამუშაოებს, საბაზო თვის სახით გამოიყენება ტენდერის
                    გახსნიდან 28 დღით ადრინდელი თარიღის შესაბამისი თვე (რაც არ შეიძლება, იყოს
                    თებერვალზე ადრე). საბაზო თვის მიხედვით განისაზღვრება ინდექსის საბაზო პერიოდი
                    და, შესაბამისად, აღნიშნულ პერიოდში არსებული საბაზისო ინდექსი არის 100
                    (შემდგომში – საბაზისო ინდექსი).
                  </p>

                  <p className="font-bold mt-4">
                    2. მიუთითეთ ტენდერის გახსნის თარიღი (ივსება მხოლოდ 1-ელ ეტაპზე მეორე
                    პუნქტის არჩევის შემთხვევაში)
                  </p>
                  <p>
                    მიუთითეთ ტენდერის გახსნის თარიღი, რომელიც გამოყენებული იქნება საბაზო თვის
                    განსაზღვრისთვის.
                  </p>

                  <p className="font-bold mt-4">3. მიუთითეთ სამუშაოების შესრულების დონე</p>
                  <p>
                    №753 განკარგულების თანახმად, თუ 2022 წლის 1 მარტის მდგომარეობით შესრულებულია
                    სამუშაოების 10% ან/და ნაკლები, ხელშეკრულებაზე ვრცელდება ფასთა ინდექსაციით
                    გამოწვეული დადებითი ან უარყოფითი ბალანი. წინააღმდეგ შემთხვევაში ხელშეკრულებაზე
                    ვრცელდება ფასთა ინდექსაციით გამოწვეული მხოლოდ დადებითი ბალანსი.
                  </p>

                  <p className="font-bold mt-4">4. ინფორმაცია შესრულებული სამუშაოს შესახებ</p>
                  <p>ცხრილში მიუთითეთ შემდეგი ინფორმაცია:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>
                      სამუშაოს შესრულების დასრულების პერიოდი (რიცხვი და თვე). აღნიშნული
                      აუცილებელია ინდექსის საანგარიშო პერიოდის განსაზღვრისთვის. №753 განკარგულების
                      თანახმად, საანგარიშო თვედ აიღება სამუშაოების პერიოდის ბოლო დღიდან 49 დღით
                      ადრინდელი თარიღის შესაბამისი თვე (რაც არ შეიძლება იყოს თებერვალზე ადრე).
                      საანგარიშო და საბაზო პერიოდებს შორის მშენებლობის ღირებულების ინდექსის
                      ცვლილება არის საფუძველი შემდგომში თანხის ინდექსაციისთვის.
                    </li>
                    <li>
                      შესრულებული სამუშაოს ღირებულება. წინა გრაფაში მითითებულ დროით პერიოდში
                      შესრულებული სამუშაოს ღირებულების მითითებისას, მარჯვნივ არსებულ ველში
                      (საინდექსაციო თანხა, ლარი) ავტომატურად გამოჩნდება საინდექსაციო თანხის
                      ოდენობა, რომელიც შეადგენს შესრულებული და შემდგომში ანაზღაურებული სამუშაოების
                      ღირებულების 70%-ს.
                    </li>
                    <li>
                      ზემოთ მითითებული ინფორმაციის შევსების შემდეგ "გამოთვლის" ღილაკზე დაკლიკების
                      შედეგად მიიღება ფასთა ინდექსაციის საბოლოო შედეგი. №753 განკარგულების მე-3
                      მუხლის, მე-3 პუნქტის თანახმად, ასანაზღაურებელი თანხა არ უნდა აღემატებოდეს
                      საინდექსაციო თანხის ოდენობის 10%-ს.
                    </li>
                  </ul>

                  <p className="mt-4">
                    ერთსა და იმავე ხელშეკრულების ფარგლებში 1-ზე მეტი შესრულებული სამუშაოს შესახებ
                    ინფორმაციის მითითებისას, შემდეგი სტრიქონის დამატება ხდება "+" ღილაკზე
                    დაკლიკებით. ცხრილის ბოლოს ავტომატურად მიეთითება ყველა შესრულებული სამუშაოს
                    მიხედვით ასანაზღაურებელი თანხების ჯამი.
                  </p>
                  <p className="mt-4">
                    აღნიშნულის გარდა, კალკულატორი იძლევა საშუალებას ფასთა ინდექსაციით მიღებული
                    შედეგი ცნობის სახით იქნეს დაგენერირებული, შემდგომი გამოყენებისთვის. ამისათვის,
                    საჭიროა "დოკუმენტის გენერირების" ღილაკზე დაკლიკება და შექმნილი დოკუმენტის
                    შენახვა/ამობეჭდვა.
                  </p>
                </>
              ) : (
                questionnaireType === "questionnaire2" ? (
                  <>
                    <p className="font-bold">როგორ მუშაობს ფასთა ინდექსაციის კალკულატორი</p>
                    <p className="mt-4">
                      ფასთა ინდექსაციის კალკულატორი შექმნილია "ინფრასტრუქტურული პროექტების
                      განხორციელების ხელშეწყობის მიზნით ფასთა ინდექსაციის გამოყენების საფუძვლების,
                      პრინციპებისა და წესის დამტკიცების შესახებ" საქართველოს მთავრობის №245
                      დადგენილების მიხედვით. კალკულატორის მიზანია, ფასთა ინდექსაციით მოსარგებლე
                      სამშენებლო კომპანიებისთვის მარტივი პროცედურის შეთავაზება, რომელიც საშუალებას
                      მისცემთ ფასთა ინდექსაციის შესახებ დასკვნა მიიღონ ონლაინ რეჟიმში.
                    </p>
                    <p className="mt-4">
                      თანხის ინდექსაციის მიზნით კალკულატორი იყენებს ჯაჭვურად გადაბმული
                      მშენებლობის ღირებულების ინდექსის (Construction Cost Index - CCI), დიზელის
                      საწვავისა და ბიტუმის ფასების ინდექსების მნიშვნელობებს. აღნიშნული ინდექსები
                      შემუშავებულია საქსტატის მიერ საერთაშორისო მეთოდოლოგიისა და სტანდარტების
                      მიხედვით.
                    </p>

                    <p className="font-bold mt-4">შევსების ეტაპები</p>

                    <p className="font-bold mt-4">1. აირჩიეთ სამუშაოს ტიპი</p>
                    <p>
                      №245 დადგენილების თანახმად, სამშენებლო სამუშაოების შესრულებისას ინდექსაცია
                      განხორციელდება შემდეგი ფორმულის გამოყენებით: Pn = a + b Ln/Lo + c En/Eo
                      (ფორმულის დეტალური განმარტებისთვის იხ. ინსტრუქციის მე-4 პუნქტი).
                    </p>
                    <p className="mt-2">
                      მიმდინარე შეკეთების სამუშაოების (რომელიც არ გულისხმობს მშენებლობას,
                      რეაბილიტაციას, მოდერნიზაციას, რეკონსტრუქციას) არჩევის შემთხვევაში ფასთა
                      ინდექსაცია განხორციელდება მშენებლობის ღირებულების ინდექსის (CCI)
                      გამოყენებით.
                    </p>

                    <p className="font-bold mt-4">2. აირჩიეთ საინდექსაციო პერიოდი</p>
                    <p>
                      მიმდინარე ხელშეკრულებების ფარგლებში 2026 წლის პირველი აპრილიდან
                      შესრულებული სამუშაოებისთვის (1-ლი პუნქტი), ასევე 2026 პირველი ივნისიდან
                      2027 წლის პირველ იანვრამდე გამოცხადებული ტენდერების ფარგლებში შესრულებული
                      სამუშაოებისთვის (მე-2 პუნქტი), საბაზო პერიოდი განისაზღვრება ტენდერის
                      გახსნის თარიღიდან 28 დღით ადრინდელი თარიღის შესაბამისი თვით. ამ ორი
                      პუნქტიდან ერთ-ერთის მონიშვნის შემთხვევაში, კალკულატორის მე-3 ნაწილში
                      მიუთითეთ ტენდერის გახსნის თარიღი.
                    </p>
                    <p className="mt-2">
                      მიმდინარე და 2026 წლის პირველ ივნისამდე გამოცხადებული ტენდერების ფარგლებში
                      შესრულებული სამუშაოებისთვის (მე-3 პუნქტი) საბაზო პერიოდად გამოიყენება 2025
                      წლის დეკემბერი.
                    </p>
                    <p className="mt-2">
                      საბაზო თვის მიხედვით განისაზღვრება ინდექსის საბაზო პერიოდი და,
                      შესაბამისად, აღნიშნულ პერიოდში არსებული საბაზისო ინდექსი არის 100
                      (შემდგომში - საბაზისო ინდექსი).
                    </p>

                    <p className="font-bold mt-4">
                      3. მიუთითეთ ტენდერის გახსნის თარიღი (ივსება მხოლოდ მე-2 ეტაპზე პირველი და
                      მეორე პუნქტის არჩევის შემთხვევაში)
                    </p>
                    <p>
                      მიუთითეთ ტენდერის გახსნის თარიღი, რომელიც გამოყენებული იქნება საბაზო თვის
                      განსაზღვრისთვის.
                    </p>

                    <p className="font-bold mt-4">
                      4. შეავსეთ გაანგარიშების ფორმულის ველები (ივსება მხოლოდ პირველ ნაწილში
                      1-ლი პუნქტის (სამშენებლო სამუშაოების) მონიშვნის შემთხვევაში)
                    </p>
                    <p>
                      №245 დადგენილების თანახმად, ფასთა ინდექსაციის გაანგარიშება განხორციელდება
                      შემდეგი ფორმულის გამოყენებით: Pn = a + b Ln/Lo + c En/Eo, სადაც:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>
                        Pn არის მაკორექტირებელი მამრავლი, რომელიც უნდა მიუყენდეს "n" პერიოდში
                        შესრულებულ სამუშაოებს.
                      </li>
                      <li>
                        a არის ფიქსირებული კოეფიციენტი, რომელიც წარმოადგენს სახელშეკრულებო
                        ღირებულების არაკორექტირებად ნაწილს. ივსება შემსრულებლის მიერ.
                      </li>
                      <li>
                        b და c არის ინდექსაციას დაქვემდებარებული კომპონენტების (ბიტუმი,
                        დიზელი) პროპორცია (ხვედრითი წილი). ივსება შემსრულებლის მიერ.
                      </li>
                      <li>
                        Ln და En წარმოადგენს მიმდინარე (საანგარიშო) პერიოდის 49 დღით ადრე
                        თარიღისთვის არსებულ ფასებს "n" პერიოდისთვის, შესაბამისად ბიტუმისა და
                        დიზელისთვის (განისაზღვრება საქსტატის მიერ).
                      </li>
                      <li>
                        Lo და Eo წარმოადგენს საბაზისო პერიოდის ფასებს, შესაბამისად ბიტუმისა და
                        დიზელისთვის (განისაზღვრება საქსტატის მიერ).
                      </li>
                    </ul>

                    <p className="font-bold mt-4">5. ინფორმაცია შესრულებული სამუშაოს შესახებ</p>
                    <p>ცხრილში მიუთითეთ შემდეგი ინფორმაცია:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>
                        სამუშაოს შესრულების დასრულების პერიოდი (რიცხვი და თვე). აღნიშნული
                        აუცილებელია ინდექსის საანგარიშო პერიოდის განსაზღვრისთვის. №245
                        დადგენილების თანახმად, საანგარიშო თვედ აიღება სამუშაოების პერიოდის ბოლო
                        დღიდან 49 დღით ადრინდელი თარიღის შესაბამისი თვე.
                      </li>
                      <li>
                        საანგარიშო და საბაზო პერიოდებს შორის მშენებლობის ღირებულების ინდექსის,
                        ასევე ბიტუმისა და დიზელის საწვავის ინდექსების ცვლილება არის საფუძველი
                        შემდგომში თანხის ინდექსაციისთვის.
                      </li>
                      <li>
                        შესრულებული სამუშაოს ღირებულება. შეავსეთ წინა გრაფაში მითითებულ დროით
                        პერიოდში შესრულებული სამუშაოს ღირებულება. პირველ ნაწილში სამშენებლო
                        სამუშაოების არჩევისას (1-ლი პუნქტი), ცხრილში გამოჩნდება ინსტრუქციის მე-4
                        პუნქტში შევსებული ფორმულის შედეგი Pn.
                      </li>
                      <li>
                        პირველ ნაწილში სარემონტო სამუშაოების არჩევისას (მე-2 პუნქტი), მარჯვნივ
                        არსებულ ველში (საინდექსაციო თანხა, ლარი) ავტომატურად გამოჩნდება
                        ინდექსაციას დაქვემდებარებული თანხის ოდენობა, რომელიც შეადგენს
                        შესრულებული და შემდგომში ანაზღაურებული სამუშაოების ღირებულების 15%-ს.
                      </li>
                      <li>
                        ზემოთ მითითებული ინფორმაციის შევსების შემდეგ მიიღება ფასთა ინდექსაციის
                        საბოლოო შედეგი.
                      </li>
                    </ul>

                    <p className="mt-4">
                      ერთსა და იმავე ხელშეკრულების ფარგლებში 1-ზე მეტი შესრულებული სამუშაოს
                      შესახებ ინფორმაციის მითითებისას, შემდეგი სტრიქონის დამატება ხდება "+"
                      ღილაკზე დაკლიკებით. ცხრილის ბოლოს ავტომატურად მიეთითება ყველა შესრულებული
                      სამუშაოს მიხედვით ასანაზღაურებელი თანხების ჯამი.
                    </p>
                    <p className="mt-4">
                      აღნიშნულის გარდა, კალკულატორი იძლევა საშუალებას ფასთა ინდექსაციით მიღებული
                      შედეგი ცნობის სახით იქნეს დაგენერირებული, შემდგომი გამოყენებისთვის.
                      ამისათვის, საჭიროა "დოკუმენტის გენერირების" ღილაკზე დაკლიკება და შექმნილი
                      დოკუმენტის შენახვა/ამობეჭდვა.
                    </p>
                  </>
                ) : questionnaireType === "questionnaire3" ? (
                  <>
                    <p className="font-bold">როგორ მუშაობს ფასთა ინდექსაციის კალკულატორი</p>
                    <p className="mt-4">
                      ფასთა ინდექსაციის კალკულატორი შექმნილია "ინფრასტრუქტურული პროექტების
                      განხორციელების ხელშეწყობის მიზნით ფასთა ინდექსაციის გამოყენების საფუძვლების,
                      პრინციპებისა და წესის დამტკიცების შესახებ" საქართველოს მთავრობის №245
                      დადგენილების მიხედვით. კალკულატორის მიზანია, ფასთა ინდექსაციით მოსარგებლე
                      სამშენებლო კომპანიებისთვის მარტივი პროცედურის შეთავაზება, რომელიც საშუალებას
                      მისცემთ ფასთა ინდექსაციის შესახებ დასკვნა მიიღონ ონლაინ რეჟიმში.
                    </p>
                    <p className="mt-4">
                      თანხის ინდექსაციის მიზნით კალკულატორი იყენებს ჯაჭვურად გადაბმული
                      მშენებლობის ღირებულების ინდექსის (Construction Cost Index - CCI) ინდექსის
                      მნიშვნელობებს. აღნიშნული ინდექსები შემუშავებულია საქსტატის მიერ
                      საერთაშორისო მეთოდოლოგიისა და სტანდარტების მიხედვით.
                    </p>

                    <p className="font-bold mt-4">შევსების ეტაპები</p>

                    <p className="font-bold mt-4">1. აირჩიეთ საბაზო პერიოდი</p>
                    <p>
                      საბაზო პერიოდის (თვის) განსაზღვრის მიზნით მიუთითეთ ტენდერის გახსნის
                      თარიღი. საბაზო თვის მიხედვით განისაზღვრება ინდექსის საბაზო პერიოდი და,
                      შესაბამისად, აღნიშნულ პერიოდში არსებული საბაზისო ინდექსი არის 100
                      (შემდგომში - საბაზისო ინდექსი).
                    </p>
                    <p className="mt-2">
                      №245 დადგენილების თანახმად, 2027 წლის 1 იანვრიდან გამოცხადებული
                      ტენდერების ფარგლებში შესრულებულ სამუშაოებზე საბაზო თვის სახით გამოიყენება
                      ტენდერის გახსნიდან 28 დღით ადრინდელი თარიღის შესაბამისი თვე.
                    </p>

                    <p className="font-bold mt-4">2. ინფორმაცია შესრულებული სამუშაოს შესახებ</p>
                    <p>ცხრილში მიუთითეთ შემდეგი ინფორმაცია:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>
                        სამუშაოს შესრულების დასრულების პერიოდი (რიცხვი და თვე). აღნიშნული
                        აუცილებელია ინდექსის საანგარიშო პერიოდის განსაზღვრისთვის. №245
                        დადგენილების თანახმად, საანგარიშო თვედ აიღება სამუშაოების პერიოდის ბოლო
                        დღიდან 49 დღით ადრინდელი თარიღის შესაბამისი თვე.
                      </li>
                      <li>
                        საანგარიშო და საბაზო პერიოდებს შორის მშენებლობის ღირებულების ინდექსის
                        ცვლილება არის საფუძველი შემდგომში თანხის ინდექსაციისთვის.
                      </li>
                      <li>
                        შესრულებული სამუშაოს ღირებულება. წინა გრაფაში მითითებულ დროით პერიოდში
                        შესრულებული სამუშაოს ღირებულების მითითებისას, მარჯვნივ არსებულ ველში
                        (საინდექსაციო თანხა, ლარი) ავტომატურად გამოჩნდება ინდექსაციას
                        დაქვემდებარებული თანხის ოდენობა, რომელიც შეადგენს შესრულებული და
                        შემდგომში ანაზღაურებული სამუშაოების ღირებულების 60%-ს.
                      </li>
                      <li>
                        ზემოთ მითითებული ინფორმაციის შევსების შემდეგ მიიღება ფასთა ინდექსაციის
                        საბოლოო შედეგი.
                      </li>
                    </ul>

                    <p className="font-bold mt-4">
                      №245 დადგენილების თანახმად, ფასთა ინდექსაცია არ ვრცელდება 2027 წლის 1
                      იანვრიდან გამოცხადებული ტენდერების ფარგლებში გაფორმებულ იმ
                      ხელშეკრულებებზე, რომელთა შესრულების ვადა 12 თვე ან ნაკლებია.
                    </p>
                    <p className="font-bold mt-4">
                      იმ შემთხვევაში, თუ ხელშეკრულებით გათვალისწინებული სამუშაოების შესრულების
                      ვადა აღემატება 12 თვეს და მიმწოდებელი უზრუნველყოფს სამუშაოების დასრულებას
                      12 თვეში ან ნაკლებ ვადაში, მას არ დაეკისრება ფასთა ინდექსაციით გამოწვეული
                      უარყოფითი სხვაობის ანაზღაურების ვალდებულება, ასეთის არსებობის შემთხვევაში.
                    </p>

                    <p className="mt-4">
                      ერთსა და იმავე ხელშეკრულების ფარგლებში 1-ზე მეტი შესრულებული სამუშაოს
                      შესახებ ინფორმაციის მითითებისას, შემდეგი სტრიქონის დამატება ხდება "+"
                      ღილაკზე დაკლიკებით. ცხრილის ბოლოს ავტომატურად მიეთითება ყველა შესრულებული
                      სამუშაოს მიხედვით ასანაზღაურებელი თანხების ჯამი.
                    </p>
                    <p className="mt-4">
                      აღნიშნულის გარდა, კალკულატორი იძლევა საშუალებას ფასთა ინდექსაციით მიღებული
                      შედეგი ცნობის სახით იქნეს დაგენერირებული, შემდგომი გამოყენებისთვის.
                      ამისათვის, საჭიროა "დოკუმენტის გენერირების" ღილაკზე დაკლიკება და შექმნილი
                      დოკუმენტის შენახვა/ამობეჭდვა.
                    </p>
                  </>
                ) : (
                  <p>ინსტრუქცია დაემატება შემდეგ ეტაპზე.</p>
                )
              )
            ) : questionnaireType === "questionnaire1" ? (
              <>
                <p className="font-bold">How does the Price Indexation Calculator work.</p>
                <p className="mt-4">
                  The Price Indexation Calculator was created according to the Government of
                  Georgia Resolution No. 753 on "Approving the grounds, principles and rules
                  for using price indexation to support the implementation of infrastructure
                  projects". The purpose of the calculator is to provide a simple procedure for
                  construction companies that are eligible for price indexation, allowing them
                  to receive a conclusion online. For amount indexation, the calculator uses
                  chained values of the Construction Cost Index (CCI). The CCI is developed by
                  GeoStat in accordance with international methodology and standards.
                </p>

                <p className="font-bold mt-4">1. Select the base period</p>
                <p>
                  According to Resolution No. 753, for works performed from April 1, 2022 and
                  reimbursed afterwards under current contracts, February 2022 is used as the
                  base month. If you select the first option, filling in Step 2 (tender opening
                  date) is not required. For works performed and subsequently reimbursed under
                  current tenders and tenders announced before May 1, 2022, the base month is
                  the month corresponding to the date 28 days before the tender opening date
                  (which cannot be earlier than February). The base month defines the base
                  index period, and therefore the base index value for this period is 100
                  (hereinafter - base index).
                </p>

                <p className="font-bold mt-4">
                  2. Specify the tender opening date (filled only if option 2 is selected in
                  Step 1)
                </p>
                <p>
                  Enter the tender opening date that will be used to determine the base month.
                </p>

                <p className="font-bold mt-4">3. Specify the level of completed work</p>
                <p>
                  According to Resolution No. 753, if as of March 1, 2022, 10% and/or less of
                  works has been completed, both positive and negative balances caused by price
                  indexation apply to the contract. Otherwise, only the positive balance caused
                  by price indexation applies.
                </p>

                <p className="font-bold mt-4">4. Information about completed work</p>
                <p>Provide the following information in the table:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>
                    End period of completed work (day and month). This is required to determine
                    the reporting index period. According to Resolution No. 753, the reporting
                    month is the month corresponding to the date 49 days before the last day of
                    the work period (which cannot be earlier than February). The change in the
                    Construction Cost Index between the reporting and base periods is the basis
                    for subsequent indexation.
                  </li>
                  <li>
                    Cost of completed work. After entering the cost of work completed in the
                    specified period, the field on the right (Indexation amount, GEL)
                    automatically displays the indexation amount, which equals 70% of the cost
                    of completed and subsequently reimbursed works.
                  </li>
                  <li>
                    After entering the above information and clicking the "Calculate" button,
                    you will get the final price indexation result. According to Article 3,
                    Paragraph 3 of Resolution No. 753, the reimbursable amount must not exceed
                    10% of the indexation amount.
                  </li>
                </ul>

                <p className="mt-4">
                  If you need to enter information about more than one completed work period
                  under the same contract, add the next row by clicking the "+" button. At the
                  end of the table, the total reimbursable amount is calculated automatically.
                </p>
                <p className="mt-4">
                  In addition, the calculator allows you to generate the indexation result as a
                  document for further use. To do this, click the "Generate document" button and
                  save/print the generated file.
                </p>
              </>
            ) : questionnaireType === "questionnaire2" ? (
              <>
                <p className="font-bold">How does the Price Indexation Calculator work</p>
                <p className="mt-4">
                  The Price Indexation Calculator is created under the Government of Georgia
                  Resolution No. 245 on "Approving the grounds, principles and rules for using
                  price indexation to support infrastructure projects". Its purpose is to offer a
                  simple online procedure for construction companies eligible for price
                  indexation.
                </p>
                <p className="mt-4">
                  For indexation calculations, the calculator uses chained values of the
                  Construction Cost Index (CCI), as well as diesel and bitumen price indices.
                  These indices are developed by GeoStat according to international methodology
                  and standards.
                </p>

                <p className="font-bold mt-4">Filling steps</p>

                <p className="font-bold mt-4">1. Select work type</p>
                <p>
                  According to Resolution No. 245, for construction works indexation is
                  calculated using the formula: Pn = a + b Ln/Lo + c En/Eo (see Step 4 for
                  detailed explanation).
                </p>
                <p className="mt-2">
                  If current repair works are selected (which do not include construction,
                  rehabilitation, modernization, or reconstruction), indexation is calculated
                  using the Construction Cost Index (CCI).
                </p>

                <p className="font-bold mt-4">2. Select indexation period</p>
                <p>
                  For works performed under current contracts from April 1, 2026 (Option 1),
                  and for works performed under tenders announced from June 1, 2026 to January
                  1, 2027 (Option 2), the base period is defined by the month corresponding to
                  the date 28 days before the tender opening date. When either of these options
                  is selected, specify the tender opening date in Step 3.
                </p>
                <p className="mt-2">
                  For works performed under current tenders and tenders announced before June 1,
                  2026 (Option 3), the base period is December 2025.
                </p>
                <p className="mt-2">
                  The base month determines the base index period; therefore, the base index for
                  that period equals 100 (hereinafter - base index).
                </p>

                <p className="font-bold mt-4">
                  3. Specify tender opening date (filled only when options 1 or 2 are selected
                  in Step 2)
                </p>
                <p>
                  Enter the tender opening date used to determine the base month.
                </p>

                <p className="font-bold mt-4">
                  4. Fill in formula fields (filled only when "Construction works" is selected
                  in Step 1)
                </p>
                <p>
                  According to Resolution No. 245, price indexation is calculated by: Pn = a + b
                  Ln/Lo + c En/Eo, where:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Pn is the adjustment multiplier applied to work performed in period "n".</li>
                  <li>
                    a is a fixed coefficient representing the non-adjustable part of contract
                    value (filled by the contractor).
                  </li>
                  <li>
                    b and c are the proportions of indexable components (bitumen, diesel)
                    (filled by the contractor).
                  </li>
                  <li>
                    Ln and En are prices for bitumen and diesel, respectively, observed 49 days
                    before the current reporting period date (determined by GeoStat).
                  </li>
                  <li>
                    Lo and Eo are base period prices for bitumen and diesel, respectively
                    (determined by GeoStat).
                  </li>
                </ul>

                <p className="font-bold mt-4">5. Information about completed work</p>
                <p>Provide the following information in the table:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>
                    End period of completed work (day and month). This is required to determine
                    the reporting index period. According to Resolution No. 245, the reporting
                    month is the month corresponding to the date 49 days before the last day of
                    the work period.
                  </li>
                  <li>
                    Changes between reporting and base periods in the CCI, as well as bitumen
                    and diesel indices, are the basis for subsequent indexation.
                  </li>
                  <li>
                    Cost of completed work. Enter the cost for the specified period. If
                    construction works are selected in Step 1, the table shows the formula result
                    Pn from Step 4.
                  </li>
                  <li>
                    If repair works are selected in Step 1, the right field (Indexation amount,
                    GEL) automatically shows the indexable amount, equal to 15% of completed and
                    subsequently reimbursed work value.
                  </li>
                  <li>
                    After filling in the above information, the final price indexation result is
                    calculated.
                  </li>
                </ul>

                <p className="mt-4">
                  If more than one completed work period exists under the same contract, add a
                  new row by clicking the "+" button. The table automatically shows the total
                  reimbursable amount at the bottom.
                </p>
                <p className="mt-4">
                  The calculator also allows generating the result as a document for further use.
                  Click "Generate document" and then save/print the created file.
                </p>
              </>
            ) : questionnaireType === "questionnaire3" ? (
              <>
                <p className="font-bold">How does the Price Indexation Calculator work</p>
                <p className="mt-4">
                  The Price Indexation Calculator is created under the Government of Georgia
                  Resolution No. 245 on "Approving the grounds, principles and rules for using
                  price indexation to support infrastructure projects". Its purpose is to offer a
                  simple online procedure for construction companies eligible for price
                  indexation.
                </p>
                <p className="mt-4">
                  For indexation calculations, the calculator uses chained values of the
                  Construction Cost Index (CCI). These indices are developed by GeoStat in
                  accordance with international methodology and standards.
                </p>

                <p className="font-bold mt-4">Filling steps</p>

                <p className="font-bold mt-4">1. Select the base period</p>
                <p>
                  To determine the base period (month), specify the tender opening date. The
                  base month defines the base index period; therefore, the base index in that
                  period equals 100 (hereinafter - base index).
                </p>
                <p className="mt-2">
                  According to Resolution No. 245, for works performed under tenders announced
                  from January 1, 2027, the base month is the month corresponding to the date 28
                  days before the tender opening date.
                </p>

                <p className="font-bold mt-4">2. Information about completed work</p>
                <p>Provide the following information in the table:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>
                    End period of completed work (day and month). This is required to determine
                    the reporting index period. According to Resolution No. 245, the reporting
                    month is the month corresponding to the date 49 days before the last day of
                    the work period.
                  </li>
                  <li>
                    The change in the Construction Cost Index between the reporting and base
                    periods is the basis for subsequent amount indexation.
                  </li>
                  <li>
                    Cost of completed work. After entering the cost for the specified period,
                    the right-side field (Indexation amount, GEL) automatically displays the
                    indexable amount, equal to 60% of completed and subsequently reimbursed work
                    value.
                  </li>
                  <li>
                    After filling in the above information, the final price indexation result is
                    calculated.
                  </li>
                </ul>

                <p className="font-bold mt-4">
                  According to Resolution No. 245, price indexation does not apply to contracts
                  concluded under tenders announced from January 1, 2027, if the contract
                  execution period is 12 months or less.
                </p>
                <p className="font-bold mt-4">
                  If the contractually defined execution period exceeds 12 months but the
                  supplier completes the works within 12 months or less, the supplier shall not
                  be obligated to reimburse a negative difference caused by price indexation, if
                  such difference exists.
                </p>

                <p className="mt-4">
                  If more than one completed work period exists under the same contract, add a
                  new row by clicking the "+" button. The table automatically shows the total
                  reimbursable amount at the bottom.
                </p>
                <p className="mt-4">
                  The calculator also allows generating the result as a document for further use.
                  Click "Generate document" and then save/print the created file.
                </p>
              </>
            ) : (
              <p>Instruction content will be added in the next step.</p>
            )}
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
