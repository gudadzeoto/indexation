import React from "react";

const InfoModalInstructionContent = ({ language, questionnaireType }) => (
  <>
{language === "GE" ? (
  questionnaireType === "questionnaire1" ? (
    <>
      <p className="mt-4">
        ფასთა ინდექსაციის კალკულატორი შექმნილია "ინფრასტრუქტურული პროექტების
        განხორციელების ხელშეწყობის მიზნით ფასთა ინდექსაციის გამოყენების საფუძვლების,
        პრინციპებისა და წესის დამტკიცების თაობაზე" საქართველოს მთავრობის №753
        განკარგულების მიხედვით. კალკულატორის მიზანია, ფასთა ინდექსაციით მოსარგებლე
        სამშენებლო კომპანიებისთვის მარტივი პროცედურის შეთავაზება, რომელიც საშუალებას
        მისცემთ ფასთა ინდექსაციის შესახებ დასკვნა მიიღონ ონლაინ რეჟიმში.
      </p>
      <p className="mt-4">
        თანხის ინდექსაციის მიზნით კალკულატორი იყენებს ჯაჭვურად გადაბმული მშენებლობის
        ღირებულების ინდექსის (Construction Cost Index - CCI) მნიშვნელობებს. CCI
        შემუშავებულია საქსტატის მიერ საერთაშორისო მეთოდოლოგიისა და სტანდარტების
        მიხედვით.
      </p>

      <p className="font-bold mt-4">შევსების ეტაპები</p>

      <p className="font-bold mt-4">1. აირჩიეთ საბაზო პერიოდი</p>
      <p>
        №753 განკარგულების თანახმად, მიმდინარე ხელშეკრულების ფარგლებში 2022 წლის 1
        აპრილიდან შესრულებული და შემდგომში ანაზღაურებული სამუშაოებისთვის საბაზო თვის
        სახით გამოიყენება 2022 წლის თებერვალი. პირველი პუნქტის არჩევისას მე-2 ეტაპის
        (ტენდერის გახსნის თარიღის) შევსება საჭირო აღარ არის.
      </p>
      <p className="mt-2">
        რაც შეეხება მიმდინარე და
        2022 წლის 1 მაისამდე გამოცხადებული ტენდერების ფარგლებში შესრულებულ და
        შემდგომში ანაზღაურებულ სამუშაოებს, საბაზო თვის სახით გამოიყენება ტენდერის
        გახსნიდან 28 დღით ადრინდელი თარიღის შესაბამისი თვე (რაც არ შეიძლება, იყოს
        თებერვალზე ადრე).
      </p>
      <p className="mt-2">
        საბაზო თვის მიხედვით განისაზღვრება ინდექსის საბაზო პერიოდი და, შესაბამისად,
        აღნიშნულ პერიოდში არსებული საბაზისო ინდექსი არის 100 (შემდგომში - საბაზისო
        ინდექსი).
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
          <strong>სამუშაოს შესრულების დასრულების პერიოდი</strong> (რიცხვი და თვე).
          აღნიშნული აუცილებელია ინდექსის საანგარიშო პერიოდის განსაზღვრისთვის. №753
          განკარგულების თანახმად, საანგარიშო თვედ აიღება სამუშაოების პერიოდის ბოლო
          დღიდან 49 დღით ადრინდელი თარიღის შესაბამისი თვე (რაც არ შეიძლება იყოს
          თებერვალზე ადრე). <strong>საანგარიშო და საბაზო პერიოდებს შორის მშენებლობის
          ღირებულების ინდექსის ცვლილება არის საფუძველი შემდგომში თანხის
          ინდექსაციისთვის;</strong>
        </li>
        <li>
          <strong>შესრულებული სამუშაოს ღირებულება.</strong> წინა გრაფაში მითითებულ
          დროით პერიოდში შესრულებული სამუშაოს ღირებულების მითითებისას, მარჯვნივ
          არსებულ ველში (საინდექსაციო თანხა, ლარი) ავტომატურად გამოჩნდება
          საინდექსაციო თანხის ოდენობა, რომელიც შეადგენს შესრულებული და შემდგომში
          ანაზღაურებული სამუშაოების ღირებულების 70%-ს;
        </li>
        <li>
          ზემოთ მითითებული ინფორმაციის შევსების შედეგად მიიღება ფასთა ინდექსაციის
          საბოლოო შედეგი.
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
          №245 დადგენილების თანახმად, <strong>სამშენებლო სამუშაოების</strong>
          შესრულებისას ინდექსაცია განხორციელდება შემდეგი ფორმულის გამოყენებით: Pn = a +
          b Ln/Lo + c En/Eo (ფორმულის დეტალური განმარტებისთვის იხ. ინსტრუქციის მე-4
          პუნქტი).
        </p>
        <p className="mt-2">
          <strong>მიმდინარე შეკეთების სამუშაოების</strong> (რომელიც არ გულისხმობს
          მშენებლობას, რეაბილიტაციას, მოდერნიზაციას, რეკონსტრუქციას) არჩევის
          შემთხვევაში ფასთა ინდექსაცია განხორციელდება მშენებლობის ღირებულების ინდექსის
          (CCI) გამოყენებით.
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
            "Pn" არის მაკორექტირებელი მამრავლი, რომელიც უნდა მიუყენდეს "n" პერიოდში
            შესრულებულ სამუშაოებს.
          </li>
          <li>
            "a" არის ფიქსირებული კოეფიციენტი, რომელიც წარმოადგენს სახელშეკრულებო
            ღირებულების არაკორექტირებად ნაწილს. <strong>ივსება შემსრულებლის მიერ</strong>.
          </li>
          <li>
            "b", "c" არის ინდექსაციას დაქვემდებარებული კომპონენტების (ბიტუმი,
            დიზელი) პროპორცია (ხვედრითი წილი). <strong>ივსება შემსრულებლის მიერ</strong>.
          </li>
          <li>
            "Ln", "En" წარმოადგენს მიმდინარე (საანგარიშო) პერიოდის 49 დღით ადრე
            თარიღისთვის არსებულ ფასებს "n" პერიოდისთვის, შესაბამისად, ბიტუმისა და
            დიზელისთვის <strong>(განისაზღვრება საქსტატის მიერ)</strong>.
          </li>
          <li>
            "Lo", "Eo" წარმოადგენს საბაზისო პერიოდის ფასებს, შესაბამისად, ბიტუმისა
            და დიზელისთვის <strong>(განისაზღვრება საქსტატის მიერ)</strong>.
          </li>
        </ul>

        <p className="font-bold mt-4">5. ინფორმაცია შესრულებული სამუშაოს შესახებ</p>
        <p>ცხრილში მიუთითეთ შემდეგი ინფორმაცია:</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>
            <strong>სამუშაოს შესრულების დასრულების პერიოდი</strong> (რიცხვი და თვე).
            აღნიშნული აუცილებელია ინდექსის საანგარიშო პერიოდის განსაზღვრისთვის. №245
            დადგენილების თანახმად, საანგარიშო თვედ აიღება სამუშაოების პერიოდის ბოლო
            დღიდან 49 დღით ადრინდელი თარიღის შესაბამისი თვე.
            <strong>საანგარიშო და საბაზო პერიოდებს შორის მშენებლობის ღირებულების
            ინდექსის, ასევე ბიტუმისა და დიზელის საწვავის ინდექსების ცვლილება არის
            საფუძველი შემდგომში თანხის ინდექსაციისთვის;</strong>
          </li>
          <li>
            <strong>შესრულებული სამუშაოს ღირებულება.</strong> შეავსეთ წინა გრაფაში
            მითითებულ დროით პერიოდში შესრულებული სამუშაოს ღირებულება. 1-ელ ნაწილში
            სამშენებლო სამუშაოების არჩევისას (1-ლი პუნქტი), ცხრილში გამოჩნდება
            ინსტრუქციის მე-4 პუნქტში შევსებული ფორმულის შედეგი Pn, ანუ
            მაკორექტირებელი მამრავლი, რომელიც უნდა მიუყენდეს "n" პერიოდში შესრულებულ
            სამუშაოებს.
          </li>
          <li>
            1-ელ ნაწილში სარემონტო სამუშაოების არჩევისას (მე-2 პუნქტი), მარჯვნივ
            არსებულ ველში (საინდექსაციო თანხა, ლარი) ავტომატურად გამოჩნდება
            ინდექსაციას დაქვემდებარებული თანხის ოდენობა, რომელიც შეადგენს შესრულებული
            და შემდგომში ანაზღაურებული სამუშაოების ღირებულების 15%-ს;
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
          მშენებლობის ღირებულების ინდექსის (Construction Cost Index - CCI)
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
            <strong>სამუშაოს შესრულების დასრულების პერიოდი</strong> (რიცხვი და თვე).
            აღნიშნული აუცილებელია ინდექსის საანგარიშო პერიოდის განსაზღვრისთვის. №245
            დადგენილების თანახმად, საანგარიშო თვედ აიღება სამუშაოების პერიოდის ბოლო
            დღიდან 49 დღით ადრინდელი თარიღის შესაბამისი თვე.
            <strong>საანგარიშო და საბაზო პერიოდებს შორის მშენებლობის ღირებულების
            ინდექსის ცვლილება არის საფუძველი შემდგომში თანხის ინდექსაციისთვის;</strong>
          </li>
          <li>
            <strong>შესრულებული სამუშაოს ღირებულება.</strong> წინა გრაფაში
            მითითებულ დროით პერიოდში შესრულებული სამუშაოს ღირებულების მითითებისას,
            მარჯვნივ არსებულ ველში (საინდექსაციო თანხა, ლარი) ავტომატურად გამოჩნდება
            ინდექსაციას დაქვემდებარებული თანხის ოდენობა, რომელიც შეადგენს
            შესრულებული და შემდგომში ანაზღაურებული სამუშაოების ღირებულების 60%-ს;
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
    <p className="mt-4">
      The price indexation calculator was created according to the Decree No. 753
      by the Government of Georgia "on approving the basis, principles, and rules
      of the use of price indexation in order to promote the implementation of
      infrastructure projects". The purpose of the calculator is to offer a simple
      procedure to construction companies, which will allow them to get a reference
      about price indexation online.
    </p>
    <p className="mt-4">
      For indexation purposes the calculator uses values of the chained
      Construction Cost Index (CCI). The CCI is developed by Geostat according to
      international methodology and standards.
    </p>

    <p className="font-bold mt-4">Filling stages</p>

    <p className="font-bold mt-4">1. Select the base period</p>
    <p>
      According to Decree No. 753, February 2022 is used as the base month for the
      works performed from April 1, 2022 and subsequently reimbursed within the
      framework of the current contract. If the first option is selected, it is no
      longer necessary to fill in the 2nd stage (the tender opening date).
    </p>
    <p className="mt-2">
      As for the works performed and subsequently paid within the framework of the
      current tenders and tenders announced before May 1, 2022, the month
      corresponding to the date 28 days before the opening of the tender (which
      cannot be earlier than February) is used as the base month.
    </p>
    <p className="mt-2">
      The reference period of the index is defined according to the base month.
      Accordingly, the base index in the mentioned period is 100 (hereinafter - the
      base index).
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
        End period (date and month) of the work. This is necessary for determining
        the reporting period of the index. According to Decree No. 753, the month
        corresponding to the date 49 days before the last day of the work period
        (which cannot be earlier than February) is taken as the reporting month.
        <strong>The change of the Construction Cost Index between the reporting and
        reference periods is the basis for indexation of the amount in the
        future.</strong>
      </li>
      <li>
        <strong>The cost of work performed.</strong> When specifying the value of
        the work performed in the time period specified in the previous cell, the
        indexed amount will automatically appear in the next field ("Indexation
        amount, GEL"), which amounts to 70% of the value of the performed and
        subsequently reimbursed work.;
      </li>
      <li>
        After filling in the information specified above, the final result of price
        indexation will be obtained.
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
    <p className="mt-4">
      The Price Indexation Calculator was created in accordance with Resolution No.
      245 of the Government of Georgia "On Approving the Basis, Principles and Rules
      of the Use of Price Indexation in Order to Promote the Implementation of
      Infrastructure Projects". The purpose of the calculator is to offer a simple
      procedure to construction companies, which will allow them to get a reference
      about price indexation online.
    </p>
    <p className="mt-4">
      For indexation purposes, the calculator uses the values of the chained
      Construction Cost Index (CCI), as well as diesel fuel and bitumen price
      indices. These indices are developed by Geostat in accordance with
      international methodologies and standards.
    </p>

    <p className="font-bold mt-4">Steps to Complete the Calculation</p>

    <p className="font-bold mt-4">1. Select the Type of Work</p>
    <p>
      According to Resolution No. 245, indexation for <strong>construction works</strong>
      shall be carried out using the following formula:
    </p>
    <p className="mt-2">Pn = a + b(Ln/Lo) + c(En/Eo)</p>
    <p className="mt-2">
      (For a detailed explanation of the formula, see Section 4 of this instruction.)
    </p>
    <p className="mt-2">
      If <strong>current repair works</strong> are selected (which do not include
      construction, rehabilitation, modernization, or reconstruction), price
      indexation will be carried out using the Construction Cost Index (CCI).
    </p>

    <p className="font-bold mt-4">2. Select the Indexation Period</p>
    <p>
      For works performed under current contracts from 1 April 2026 (Option 1), as
      well as for works performed under tenders announced from 1 June 2026 until 1
      January 2027 (Option 2), the base period shall be determined as the month
      corresponding to the date 28 days prior to the tender opening date. If either
      of these two options is selected, specify the tender opening date in Section 3
      of the calculator.
    </p>
    <p className="mt-2">
      For works performed under current tenders and tenders announced before 1 June
      2026 (Option 3), December 2025 shall be used as the base period.
    </p>
    <p className="mt-2">
      The reference period of the index is determined according to the base month.
      Accordingly, the base index in that period equals 100 (hereinafter - the base
      index).
    </p>

    <p className="font-bold mt-4">
      3. Choose the tender opening date (To be completed only if Option 1 or Option
      2 is selected in Stage 2)
    </p>
    <p>
      Specify the tender opening date that will be used to determine the base month.
    </p>

    <p className="font-bold mt-4">
      4. Fill in the Formula Fields (To be completed only if Construction Works are
      selected in Section 1, Option1)
    </p>
    <p>
      According to Resolution No. 245, price indexation shall be calculated using
      the following formula:
    </p>
    <p className="mt-2">Pn = a + b(Ln/Lo) + c(En/Eo)</p>
    <p className="mt-2">where:</p>
    <ul className="list-disc pl-6 mt-2 space-y-2">
      <li>
        "Pn" - the adjustment coefficient to be applied to works performed during
        period "n";
      </li>
      <li>
        "a" - a fixed coefficient representing the non-adjustable part of the
        contract value. <strong>To be completed by the contractor;</strong>
      </li>
      <li>
        "b", "c" - the proportions (shares) of the components subject to indexation
        (bitumen and diesel fuel, respectively). <strong>To be completed by the
        contractor;</strong>
      </li>
      <li>
        "Ln" and "En" - the bitumen and diesel fuel prices, respectively, for period
        "n", corresponding to the date 49 days prior to the current (reporting)
        period <strong>(determined by Geostat);</strong>
      </li>
      <li>
        "Lo", "Eo" - the prices of bitumen and diesel fuel, respectively, in the
        base period <strong>(determined by Geostat).</strong>
      </li>
    </ul>

    <p className="font-bold mt-4">5. Information on Performed Work</p>
    <p>Provide the following information in the table:</p>
    <ul className="list-disc pl-6 mt-2 space-y-2">
      <li>
        <strong>End period (date and month) of the work.</strong> This information is
        required to determine the reporting period of the index. According to
        Resolution No. 245, the reporting month shall be the month corresponding to
        the date 49 days prior to the last day of the work period.
        <strong>Changes in the Construction Cost Index, as well as in the bitumen and
        diesel fuel indices, between the reporting and base periods constitute the
        basis for subsequent indexation of the amount.</strong>
      </li>
      <li>
        <strong>Value of the work performed.</strong> Enter the value of the work
        completed during the period specified in the previous field. If Construction
        Works are selected in Section 1 (Option 1), the result of the formula
        completed in Section 4 (Pn) will appear in the table, i.e. the adjustment
        coefficient to be applied to works performed during period "n".
      </li>
      <li>
        If Repair Works are selected in Section 1 (Option 2), the amount subject to
        indexation will automatically appear in the field on the right (Indexation
        Amount, GEL). This amount equals 15% of the value of the work performed and
        subsequently reimbursed.
      </li>
      <li>
        After completing the information specified above, the final price indexation
        result will be generated.
      </li>
    </ul>

    <p className="mt-4">
      In case when information on several works performed within the same contract
      should be filled, another row of the table can be added by clicking on the "+"
      button. At the bottom of the table a total amount of reimbursement is
      automatically calculated.
    </p>
    <p className="mt-4">
      In addition to the above, the calculator allows the price indexation result to
      be generated as a reference for further use. To do this, you need to click on
      the "Generate document" button and save or print the created document.
    </p>
  </>
) : questionnaireType === "questionnaire3" ? (
  <>
    <p className="mt-4">
      The Price Indexation Calculator was created in accordance with Resolution No.
      245 of the Government of Georgia "On Approving the Basis, Principles and Rules
      of the Use of Price Indexation in Order to Promote the Implementation of
      Infrastructure Projects". The purpose of the calculator is to offer a simple
      procedure to construction companies, which will allow them to get a reference
      about price indexation online.
    </p>
    <p className="mt-4">
      For indexation purposes, the calculator uses the values of the chained
      Construction Cost Index (CCI). This index is developed by Geostat in
      accordance with international methodologies and standards.
    </p>

    <p className="font-bold mt-4">Steps to Complete the Calculation</p>

    <p className="font-bold mt-4">1. Select the Base Period</p>
    <p>
      To determine the base period (month), specify the tender opening date. The
      reference period of the index is determined according to the base month.
      Accordingly, the base index in that period equals 100 (hereinafter - the base
      index).
    </p>
    <p className="mt-2">
      According to Resolution No. 245, for works performed under tenders announced
      from 1 January 2027, the month corresponding to the date 28 days prior to the
      tender opening date shall be used as the base month.
    </p>

    <p className="font-bold mt-4">2. Information on Performed Work</p>
    <p>Provide the following information in the table:</p>
    <ul className="list-disc pl-6 mt-2 space-y-2">
      <li>
        <strong>End period (date and month) of the work.</strong> This information is
        required to determine the reporting period of the index. According to
        Resolution No. 245, the reporting month shall be the month corresponding to
        the date 49 days prior to the last day of the work period.
        <strong>Changes in the Construction Cost Index between the reporting and base
        periods constitute the basis for subsequent indexation of the amount.</strong>
      </li>
      <li>
        <strong>Value of the work performed.</strong> When specifying the value of
        the work performed during the period indicated in the previous field, the
        amount subject to indexation will automatically appear in the field on the
        right (Indexation Amount, GEL). This amount equals 60% of the value of the
        work performed and subsequently reimbursed.
      </li>
      <li>
        After completing the information specified above, the final price indexation
        result will be generated.
      </li>
    </ul>

    <p className="font-bold mt-4">
      According to Resolution No. 245, price indexation shall not apply to contracts
      concluded under tenders announced from 1 January 2027 where the contract
      implementation period is 12 months or less.
    </p>
    <p className="font-bold mt-4">
      In cases where the implementation period stipulated by the contract exceeds 12
      months and the supplier completes the works within 12 months or less, the
      supplier shall not be required to reimburse any negative difference resulting
      from price indexation, if such a difference exists.
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
  </>
);

export default InfoModalInstructionContent;
