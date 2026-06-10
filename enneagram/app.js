/* ==========================================================================
   ENNEAกรรม - Core Application Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const introScreen = document.getElementById("intro-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultsScreen = document.getElementById("results-screen");

  const btnStart = document.getElementById("btn-start");
  const btnRetry = document.getElementById("btn-retry");
  const btnShare = document.getElementById("btn-share");
  const btnScanEnemy = document.getElementById("btn-scan-enemy");
  const btnDownloadImage = document.getElementById("btn-download-image");
  const btnBack = document.getElementById("btn-back");

  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const categoryTag = document.getElementById("category-tag");
  const questionNumText = document.getElementById("question-num");
  const questionText = document.getElementById("question-text");
  const choicesContainer = document.getElementById("choices-container");

  // Result Elements
  const resultTypeName = document.getElementById("result-type-name");
  const resultTypeTitle = document.getElementById("result-type-title");
  const resultDescription = document.getElementById("result-description");
  const resultPassiveSkill = document.getElementById("result-passive-skill");
  const resultEnemy = document.getElementById("result-enemy");
  const resultMitigation = document.getElementById("result-mitigation");
  const metricAwareness = document.getElementById("metric-awareness");
  const metricEgo = document.getElementById("metric-ego");
  const chemicalsList = document.getElementById("chemicals-list");
  const radarChartWrapper = document.getElementById("radar-chart-wrapper");
  const invoiceId = document.getElementById("invoice-id");

  // Modal elements
  const enemyScanModal = document.getElementById("enemy-scan-modal");
  const closeModalBtn = document.querySelector(".close-modal");
  const scanStatusText = document.getElementById("scan-status-text");
  const scanResultDetails = document.getElementById("scan-result-details");
  const enemyName = document.getElementById("enemy-name");
  const enemyDesc = document.getElementById("enemy-desc");
  const enemyAvatar = document.getElementById("enemy-avatar");
  const radarScanAnim = document.querySelector(".radar-scan-anim");

  // --- Quiz State ---
  let currentQuestionIndex = 0;
  let userScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  let answersHistory = []; // Tracks selected choices indices to support going back
  let userName = "";
  let userEmail = "";
  let primaryType = 1;

  // --- Enneagram Profiles Data ---
  const enneagramProfiles = {
    1: {
      name: "ลักษณ์ 1 · กรรมเพ่งโทษ — \"นรกคนดีย์\"",
      title: "บาป: ความโกรธ (Anger)",
      description: "ทรมานตัวเองและคนอื่นด้วยมาตรฐานที่สมบูรณ์แบบ เห็นอะไรก็ขัดหูขัดตา ในหัวมีไม้บรรทัดที่ไม่เคยวางลง มุ่งมั่นที่จะทำทุกอย่างให้ถูกต้องและดีที่สุดเพื่อช่วยให้สังคมดีขึ้น แต่บ่อยครั้งที่ความมุ่งมั่นนี้ย้อนมาสร้างความเครียดและบีบรัดหัวใจคุณเองจนเหนื่อยล้า พยายามผ่อนคลายและใจดีกับตัวเองบ้างนะ",
      passiveSkill: "เรดาร์ตรวจจับจุดแก้ไข (มีสายตาที่เฉียบคม เห็นจุดบกพร่องหรือสิ่งที่ต้องพัฒนาได้อย่างรวดเร็วเพื่อปรับปรุงให้งานออกมาดีที่สุด)",
      enemyType: 7,
      enemyName: "ลักษณ์ 7 · กรรมแสวงหา — \"มารร้อยโปรเจกต์\"",
      enemyDesc: "คุณอาจรู้สึกปวดขมับกับเพื่อนๆ 'มารร้อยโปรเจกต์' (ลักษณ์ 7) ที่ชอบโยนไอเดียใหม่สนุกๆ ออกมาเป็นร้อย แต่ไม่ค่อยลงดีเทลหรือระเบียบปฏิบัติ ความยืดหยุ่นและการทำงานแบบตามใจฉันของพวกเขาอาจกระตุ้นต่อมอยากจัดระเบียบของคุณให้ทำงานหนักขึ้น",
      mitigation: "ฝึกยอมรับว่า \"ดีพอ\" ก็คือดีแล้ว ความถูกต้องไม่ใช่ความสุข (ลองผ่อนคลายกล้ามเนื้อหัวไหล่ ฝึกปล่อยวางมาตรฐานที่ตึงเกินไปจะช่วยให้คุณและคนรอบข้างมีความสุขขึ้นเยอะเลย)",
      chemicals: [
        { name: "ความเป๊ะของมาตรฐาน", value: 60 },
        { name: "ความรับผิดชอบและความมุ่งมั่น", value: 30 },
        { name: "ความผ่อนคลายเบาสบาย", value: 10 }
      ]
    },
    2: {
      name: "ลักษณ์ 2 · บ่วงทวงบุญคุณ — \"นักบุญทุนชาวบ้าน\"",
      title: "บาป: ความทะนงตน (Pride)",
      description: "ให้ความช่วยเหลือจนลืมตัวเอง แล้วแอบผูกมัดคนอื่นไว้ด้วยความคาดหวังว่าจะได้รับกลับคืน คุณมีหัวใจที่ยิ่งใหญ่และพร้อมช่วยเหลือดูแลทุกคนอย่างไม่รู้จักเหน็ดเหนื่อย แต่บางครั้งความปรารถนาดีนี้ก็อาจแฝงความคาดหวังลึกๆ อยากได้รับการยอมรับและตอบแทนความรู้สึกดีๆ กลับคืนมา",
      passiveSkill: "สัมผัสห่วงใยไวแสง (สามารถตรวจจับความสุข ความเศร้า หรือความต้องการของคนอื่นรอบตัวได้ทันที พร้อมเข้าช่วยเหลือในทุกสถานการณ์)",
      enemyType: 5,
      enemyName: "ลักษณ์ 5 · กรรมกำแพงใจ — \"ถ้ำฤๅษีไฮเทค\"",
      enemyDesc: "คุณอาจรู้สึกเหงาใจหรืออึดอัดกับเพื่อน 'ถ้ำฤๅษีไฮเทค' (ลักษณ์ 5) ที่รักความเงียบสงบ หวงพื้นที่ส่วนตัว และพยายามพึ่งพาตัวเองเท่านั้น ความเย็นชาและการสร้างกำแพงกั้นโลกภายนอกของพวกเขาอาจทำให้คุณแอบน้อยใจในความหวังดีของคุณ",
      mitigation: "ฝึกถามว่า \"เราต้องการอะไร\" ก่อนจะวิ่งไปดูแลคนอื่น (ฝึกช่วยเหลือคนอื่นในปริมาณที่เหมาะสมแบบให้แล้วจบ และที่สำคัญคือหันมาเติมเต็มหัวใจตัวเองด้วยนะ)",
      chemicals: [
        { name: "ความปรารถนาดีและห่วงใย", value: 55 },
        { name: "ความคาดหวังอยากให้เขารัก", value: 35 },
        { name: "ความรักและเห็นค่าตัวเองจริงๆ", value: 10 }
      ]
    },
    3: {
      name: "ลักษณ์ 3 · กรรมภาพลวงตา — \"คุกแห่งความสำเร็จ\"",
      title: "บาป: ความหลอกลวง (Deceit)",
      description: "ติดกับดักเปลือกนอก ต้องเด่น ต้องปัง จนลืมว่าจริงๆ แล้วตัวเองรู้สึกอะไร ชีวิตขับเคลื่อนด้วยเป้าหมาย ถ้วยรางวัล และยอดไลก์สะสม ยอมทำทุกอย่างเพื่อความสำเร็จจนละเลยความรู้สึกและสุขภาพจิตใจที่แท้จริงข้างใน พักผ่อนบ้างและเรียนรู้ว่าคุณมีค่าแม้ไม่มีสปอตไลท์ส่อง",
      passiveSkill: "พลังดึงดูดความสำเร็จ (มีทักษะการนำเสนอตัวเองและงานได้อย่างดีเลิศ ปรับตัวเข้ากับทุกสถานการณ์เพื่อสร้างความประทับใจได้ทันที)",
      enemyType: 4,
      enemyName: "ลักษณ์ 4 · กรรมโศกนาฏกรรม — \"วังวนคนถูกลืม\"",
      enemyDesc: "คู่ปรับตลอดกาลคือ 'วังวนคนถูกลืม' (ลักษณ์ 4) สายดราม่าที่แสวงหา 'ความแท้จริง' พวกเขาจะเบะปากใส่ความสำเร็จแบบเป็นแบบแผนของคุณ และคอยจับโป๊ะเปลือกนอกของคุณจนคุณเสียเซลฟ์",
      mitigation: "ฝึกอยู่กับความรู้สึกจริง แม้ตอนที่ไม่มีใครปรบมือ (ลองทำงานอดิเรกที่ไม่มีใครเห็น และห้ามโพสต์โซเชียล สัมผัสความจริงว่าตัวตนของคุณมีคุณค่าในตัวเองเสมอโดยไม่ต้องรอคำชม)",
      chemicals: [
        { name: "พลังขับเคลื่อนความสำเร็จ", value: 60 },
        { name: "ความมุ่งมั่นปรับปรุงภาพลักษณ์", value: 30 },
        { name: "ความเข้าใจและยอมรับตัวตนจริง", value: 10 }
      ]
    },
    4: {
      name: "ลักษณ์ 4 · กรรมโศกนาฏกรรม — \"วังวนคนถูกลืม\"",
      title: "บาป: ความอิจฉา (Envy)",
      description: "รู้สึกขาดหายและไม่คู่ควร ดำดิ่งในความเศร้าที่คิดว่าไม่มีใครเข้าใจ มองคนอื่นมีในสิ่งที่เราไม่มีเสมอ รักความเงียบ ความเศร้า และความสร้างสรรค์ประณีต แต่บางครั้งก็เผลอจมอยู่กับดราม่าในใจและคิดว่าโลกนี้ทอดทิ้งคุณ ลองเปิดใจรับไมตรีจิตรอบตัวบ้างนะ",
      passiveSkill: "สัมผัสอารมณ์สุนทรีย์ (มีความละเอียดอ่อนทางอารมณ์สูงมาก สามารถเปลี่ยนความเศร้าหรือความอ้างว้างให้กลายเป็นงานศิลปะหรืองานสร้างสรรค์ที่น่าทึ่ง)",
      enemyType: 3,
      enemyName: "ลักษณ์ 3 · กรรมภาพลวงตา — \"คุกแห่งความสำเร็จ\"",
      enemyDesc: "คุณมักจะรู้สึกขัดตาปนเหนื่อยหน่ายใจกับเพื่อน 'คุกแห่งความสำเร็จ' (ลักษณ์ 3) ที่ชอบพูดถึงผลงาน ความสำเร็จ และความก้าวหน้าอย่างรวดเร็ว พลังงานการสู้ชีวิตที่เน้นผลลัพธ์ของพวกเขาจะขยี้ปมด้อยและความรู้สึกขาดหายของคุณ",
      mitigation: "ฝึกเห็นสิ่งที่มีอยู่ตรงหน้า แทนสิ่งที่ขาดไป (หันมามองความงามและความสุขในความธรรมดาของชีวิต และจำไว้ว่าคนอื่นเขาก็รักคุณนะ แค่เขาแสดงออกในมุมที่ต่างออกไป)",
      chemicals: [
        { name: "อารมณ์ความรูสึกลึกซึ้ง", value: 60 },
        { name: "ความคิดสร้างสรรค์และรสนิยม", value: 30 },
        { name: "ความสงบผ่อนคลายของจิตใจ", value: 10 }
      ]
    },
    5: {
      name: "ลักษณ์ 5 · กรรมกำแพงใจ — \"ถ้ำฤๅษีไฮเทค\"",
      title: "บาป: ความตระหนี่ (Avarice)",
      description: "หวงแหนพลังงาน เวลา และข้อมูล หวาดระแวงโลกภายนอกจนขังตัวเองไว้ในหัว รักความสงบและชอบวิเคราะห์สิ่งต่าง ๆ อย่างเป็นระบบ แต่การสร้างกำแพงกั้นตัวเองไว้มากเกินไปอาจทำให้คุณพลาดโอกาสแชร์สิ่งดี ๆ และเชื่อมสัมพันธ์กับผู้คนรอบข้าง",
      passiveSkill: "ห้องสมุดเคลื่อนที่ (มีระบบจัดระเบียบข้อมูลในสมองที่เป็นเลิศ สามารถเชื่อมโยงวิเคราะห์สิ่งยากๆ ให้เข้าใจง่ายได้อย่างมีหลักการ)",
      enemyType: 2,
      enemyName: "ลักษณ์ 2 · บ่วงทวงบุญคุณ — \"นักบุญทุนชาวบ้าน\"",
      enemyDesc: "ศัตรูทางพลังงานอันดับหนึ่งคือ 'นักบุญทุนชาวบ้าน' (ลักษณ์ 2) ผู้ขยันซักไซ้ไล่เลียง ส่งความปรารถนาดี คอยถามสารทุกข์สุกดิบ ความเป็นมิตรที่พยายามดูแลของพวกเขาจะทำให้คุณรู้สึกโดนเบียดบังความเป็นส่วนตัว",
      mitigation: "ฝึกแชร์ความรู้สึก ไม่ใช่แค่ความรู้ และก้าวออกมาลงมือทำ (ลองแง้มประตูห้องออกมาพูดคุยเรื่องไร้สาระแบบไม่ต้องอิง Fact บ้าง สัมผัสถึงคุณค่าของการเชื่อมโยงทางใจ)",
      chemicals: [
        { name: "ความหวงแหนพื้นที่และพลังงาน", value: 70 },
        { name: "ความหวาดระแวงโลกภายนอก", value: 25 },
        { name: "ความพร้อมแชร์และเข้าสังคม", value: 10 }
      ]
    },
    6: {
      name: "ลักษณ์ 6 · กรรมระแวงภัย — \"มโนวิตกจริต\"",
      title: "บาป: ความกลัว (Fear)",
      description: "สร้างฉากหายนะในหัวตลอดเวลา กังวลจนไม่ได้เริ่มทำอะไร มองหาภัยแม้ในที่ที่ไม่มี เป็นคนรอบคอบ ซื่อสัตย์ และรักเพื่อนฝูง แต่ความกังวลสะสมที่มากเกินไปอาจสร้างความเครียดและจำกัดโอกาสใหม่ๆ ในชีวิต ลองปล่อยให้ทุกอย่างเป็นธรรมชาติและวางความระแวงลงบ้างนะ",
      passiveSkill: "โล่ป้องกันภัยล่วงหน้า (มีความสามารถในการคาดการณ์ความเสี่ยงและจุดบกพร่องของแผนงานเพื่อเตรียมรับมือล่วงหน้าได้อย่างปลอดภัยที่สุด)",
      enemyType: 8,
      enemyName: "ลักษณ์ 8 · กรรมครอบงำ — \"บารมีนักเลง\"",
      enemyDesc: "คุณมักจะกังวลใจกับเพื่อน 'บารมีนักเลง' (ลักษณ์ 8) ที่บุกตะลุย ทุบโต๊ะตัดสินใจฉับไวโดยไม่กลัวความเสี่ยง พลังงานความกล้าหาญแบบพุ่งชนของพวกเขาจะกระตุ้นต่อมวิตกกังวลของคุณให้ทำงานหนักขึ้น",
      mitigation: "ฝึกเชื่อใจตัวเอง ความกลัวส่วนใหญ่ไม่เคยเกิดขึ้นจริง (หัดอยู่กับลมหายใจและปัจจุบันให้มากขึ้น เชื่อมั่นเถอะว่าต่อให้เกิดเรื่องติดขัดอะไรขึ้นมาจริง ๆ คุณก็ฉลาดพอที่จะแก้ปัญหาได้แน่นอน)",
      chemicals: [
        { name: "ความละเอียดรอบคอบระวังภัย", value: 60 },
        { name: "ความซื่อสัตย์และต้องการเพื่อนแท้", value: 35 },
        { name: "ความรู้สึกผ่อนคลายและปลอดภัย", value: 5 }
      ]
    },
    7: {
      name: "ลักษณ์ 7 · กรรมแสวงหา — \"มารร้อยโปรเจกต์\"",
      title: "บาป: ความตะกละ (Gluttony)",
      description: "กลัวความทุกข์และความน่าเบื่อ เลยเสพสิ่งใหม่ ประสบการณ์ใหม่ ไม่หยุด จนไม่เคยอยู่กับสิ่งตรงหน้าได้นาน คุณเป็นคนร่าเริงแจ่มใส โลกสดใสในสายตาคุณเสมอ แต่การมองหาทริปใหม่ กิจกรรมใหม่ ช้อปปิ้ง แสวงหาความตื่นเต้นอยู่ตลอดเวลาอาจเป็นกลไกการหนีปัญหาชั่วคราว ลองเรียนรู้อยู่นิ่งและสงบสุขกับเรื่องปัจจุบันดูนะ",
      passiveSkill: "เครื่องฟอกอากาศพลังบวก (มีทักษะการปรับอารมณ์ของตนเองและบรรยากาศรอบข้างให้เต็มไปด้วยความหวังและความสนุกสนานได้ในพริบตา)",
      enemyType: 1,
      enemyName: "ลักษณ์ 1 · กรรมเพ่งโทษ — \"นรกคนดีย์\"",
      enemyDesc: "คู่ปรับตลอดกาลคือ 'นรกคนดีย์' (ลักษณ์ 1) ผู้เป๊ะวินัยและคอยจี้จุด ถามหารายละเอียด ความรับผิดชอบ และความต่อเนื่องในการทำงาน การโดนสั่งสอนกฎเกณฑ์ของพวกเขาคือสิ่งที่จะสะกดอารมณ์ชิลของคุณให้หายไป",
      mitigation: "ฝึกอยู่นิ่งกับปัจจุบัน ความสุขไม่ได้อยู่ที่อันถัดไป (ลองนิ่งนิ่ง เผชิญหน้ากับความเหงา ความเศร้า หรือความเบื่อบ้าง การทำสิ่งตรงหน้าให้เสร็จและอยู่กับความจำเจได้บ้างจะช่วยสะสางกรรมในใจได้อย่างงดงาม)",
      chemicals: [
        { name: "ความต้องการแสวงหาความสนุก", value: 70 },
        { name: "ไอเดียและการมองโลกในแง่ดี", value: 25 },
        { name: "ความเพียรพยายามทำสิ่งเดิม", value: 5 }
      ]
    },
    8: {
      name: "ลักษณ์ 8 · กรรมครอบงำ — \"บารมีนักเลง\"",
      title: "บาป: ความบ้าพลัง (Lust)",
      description: "ต้องการควบคุมทุกอย่างรอบตัว แสดงความแข็งกร้าวเพื่อปกปิดความอ่อนแอที่ไม่ยอมให้ใครเห็น รักความยุติธรรม ใจถึงพึ่งได้ และพร้อมปกป้องทุกคน แต่ความพยายามคุมเกมและชนแหลกอาจทำให้คนรอบตัวเกร็ง ลองยอมผ่อนคลาย ลดความแข็งกร้าวลงบ้าง และเปิดมุมอ่อนโยนออกมานะ",
      passiveSkill: "พลังอำนาจคุมทัพ (มีออร่าความเป็นผู้นำที่ทำให้คนเกรงใจ เชื่อฟัง และสร้างแรงผลักดันให้ทุกคนลงมือทำเพื่อเป้าหมายร่วมกันได้ดีเยี่ยม)",
      enemyType: 9,
      enemyName: "ลักษณ์ 9 · กรรมละเลย — \"เจ้าชายนิทรา\"",
      enemyDesc: "เจ้ากรรมนายเวรที่ขยี้ต่อมโมโหของคุณได้แสบที่สุดคือ 'เจ้าชายนิทรา' (ลักษณ์ 9) ผู้สโลว์ไลฟ์ ปล่อยเบลอ ยิ่งคุณเร่ง ยิ่งคุณสั่ง พวกเขาจะยิ่งดึงเช็งเงียบเฉียบ ไม่เถียงแต่ไม่ทำ ซึ่งทำลายบารมีในการคุมเกมของคุณ",
      mitigation: "ฝึกยอมให้ตัวเองอ่อนโยน ความเปราะบางไม่ใช่ความพ่ายแพ้ (การเอ่ยปากขอความช่วยเหลือหรือนำเสนอความเหนื่อยล้าของตัวเองบ้าง จะช่วยสร้างมิตรภาพที่ผ่อนคลายและอบอุ่นรอบตัวคุณ)",
      chemicals: [
        { name: "พลังความเด็ดเดี่ยวพร้อมปกป้อง", value: 65 },
        { name: "ความปรารถนาในการควบคุมควบคุม", value: 25 },
        { name: "ความนุ่มนวลและอ่อนน้อมถ่อมตน", value: 10 }
      ]
    },
    9: {
      name: "ลักษณ์ 9 · กรรมละเลย — \"เจ้าชายนิทรา\"",
      title: "บาป: ความเฉื่อยชา (Sloth)",
      description: "เมินเฉยต่อปัญหา ปล่อยเบลอเพื่อรักษาความสงบจอมปลอม หลอมรวมไปกับคนอื่นจนลืมว่าตัวเองต้องการอะไร เป็นคนน่ารัก อ่อนโยน เข้ากับทุกคนได้ดี แต่การยอมทำตัวกลมกลืนและหนีความขัดแย้งด้วยการเมินเฉย แอบต่อต้านเงียบๆ อาจทำให้เสียงและความฝันที่แท้จริงของคุณหลับไหลไปตลอดกาล",
      passiveSkill: "หูดับสะท้อนเสียงบ่น (ความสามารถในการรับฟังกฎเกณฑ์ ข้อเรียกร้อง หรือเสียงบ่นของหัวหน้า/แฟน แต่สมองจะทำการปิดการประมวลผลทันทีและสติจะไหลไปสวรรค์)",
      enemyType: 3,
      enemyName: "ลักษณ์ 3 · กรรมภาพลวงตา — \"คุกแห่งความสำเร็จ\"",
      enemyDesc: "คู่ปรับที่ขัดขวางความสงบของคุณคือ 'คุกแห่งความสำเร็จ' (ลักษณ์ 3) และพวกบ้างานบ้าพลังที่จะคอยลากคุณออกจากเตียง บังคับให้คุณลุกขึ้นมาตื่นตัว ตัดสินใจเลือกข้าง และขับเคลื่อนผลงาน",
      mitigation: "ฝึกตื่นขึ้นมาออกความเห็น การมีตัวตนไม่ได้ทำลายความสงบ (หัดพูดปฏิเสธ แสดงจุดยืน และบอกความต้องการของตนเองออกมาตรงๆ สันติภาพที่แท้จริงเกิดจากการยอมรับตัวตนที่ชัดเจนของกันและกัน)",
      chemicals: [
        { name: "ความต้องการความเฉื่อยเพื่อความสงบ", value: 65 },
        { name: "การยอมปรับตามใจคนอื่น", value: 30 },
        { name: "ไฟขับเคลื่อนตัวตนกระตือรือร้น", value: 5 }
      ]
    }
  };

  // --- Quiz Engine Logic ---

  function startQuiz() {
    const nameInput = document.getElementById("user-name");
    const emailInput = document.getElementById("user-email");
    const errorMsg = document.getElementById("info-error-msg");

    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();

    if (!nameVal || !emailVal) {
      errorMsg.innerText = "⚠️ กรุณากรอกชื่อและอีเมลก่อนเริ่ม";
      errorMsg.classList.remove("hidden");
      if (!nameVal) nameInput.style.borderColor = "var(--neon-pink)";
      if (!emailVal) emailInput.style.borderColor = "var(--neon-pink)";
      return;
    }

    if (!emailVal.includes("@")) {
      errorMsg.innerText = "⚠️ กรุณากรอกอีเมลให้ถูกต้อง";
      errorMsg.classList.remove("hidden");
      emailInput.style.borderColor = "var(--neon-pink)";
      return;
    }

    // Reset styles
    nameInput.style.borderColor = "";
    emailInput.style.borderColor = "";
    errorMsg.classList.add("hidden");

    // Store globally
    userName = nameVal;
    userEmail = emailVal;

    introScreen.classList.remove("active");
    resultsScreen.classList.remove("active");
    setTimeout(() => {
      introScreen.classList.add("hidden");
      resultsScreen.classList.add("hidden");
      quizScreen.classList.remove("hidden");
      quizScreen.classList.add("active");
      currentQuestionIndex = 0;
      userScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
      answersHistory = [];
      showQuestion();
    }, 400);
  }

  function showQuestion() {
    const q = enneagramQuestions[currentQuestionIndex];
    
    // Set Question numbers & progress
    questionNumText.innerText = `ข้อ ${currentQuestionIndex + 1} จาก ${enneagramQuestions.length}`;
    questionText.innerText = q.text;
    
    // Manage Back Button visibility
    if (currentQuestionIndex > 0) {
      btnBack.classList.remove("hidden");
    } else {
      btnBack.classList.add("hidden");
    }

    // Set category tag
    if (q.category === "work") {
      categoryTag.innerText = "บทที่ 1: กรรมในวิถีชีวิตและการงาน";
      categoryTag.style.borderColor = "rgba(0, 240, 255, 0.4)";
      categoryTag.style.backgroundColor = "rgba(0, 240, 255, 0.1)";
      categoryTag.style.color = "var(--neon-cyan)";
    } else if (q.category === "social") {
      categoryTag.innerText = "บทที่ 2: กรรมในความสัมพันธ์";
      categoryTag.style.borderColor = "rgba(255, 0, 85, 0.4)";
      categoryTag.style.backgroundColor = "rgba(255, 0, 85, 0.1)";
      categoryTag.style.color = "var(--neon-pink)";
    } else {
      categoryTag.innerText = "บทที่ 3: เวลากรรมเข้าครอบ / สติแตก";
      categoryTag.style.borderColor = "rgba(176, 0, 255, 0.4)";
      categoryTag.style.backgroundColor = "rgba(176, 0, 255, 0.1)";
      categoryTag.style.color = "var(--neon-purple)";
    }

    // Update Progress Bar
    const progressPercent = Math.round((currentQuestionIndex / enneagramQuestions.length) * 100);
    progressBar.style.width = `${progressPercent}%`;
    progressText.innerText = `${progressPercent}%`;

    // Render Choices
    choicesContainer.innerHTML = "";
    const previouslySelectedIdx = answersHistory[currentQuestionIndex];
    q.choices.forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.innerText = choice.text;
      if (previouslySelectedIdx !== undefined && previouslySelectedIdx === index) {
        btn.classList.add("active");
      }
      btn.addEventListener("click", () => {
        btn.classList.add("active");
        handleAnswer(choice.type, index);
      });
      choicesContainer.appendChild(btn);
    });
  }

  function handleAnswer(selectedType, choiceIndex) {
    // Save choice index in history
    answersHistory[currentQuestionIndex] = choiceIndex;
    userScores[selectedType]++;
    currentQuestionIndex++;

    if (currentQuestionIndex < enneagramQuestions.length) {
      // Transition out and in for smooth feel
      choicesContainer.style.pointerEvents = "none";
      setTimeout(() => {
        showQuestion();
        choicesContainer.style.pointerEvents = "auto";
      }, 150);
    } else {
      // Update progress bar to 100%
      progressBar.style.width = `100%`;
      progressText.innerText = `100%`;
      setTimeout(showResults, 500);
    }
  }

  function calculateResults() {
    // 1. Find dominant type
    let maxScore = -1;
    let dominant = 1;
    for (let type in userScores) {
      if (userScores[type] > maxScore) {
        maxScore = userScores[type];
        dominant = parseInt(type);
      }
    }
    primaryType = dominant;

    // 2. Calculate Level of Awareness based on dominant choices in Chapter 3 (indices 18 to 26)
    let ch3DominantCount = 0;
    for (let i = 18; i <= 26; i++) {
      const selectedChoiceIdx = answersHistory[i];
      if (selectedChoiceIdx !== undefined) {
        const selectedType = enneagramQuestions[i].choices[selectedChoiceIdx].type;
        if (selectedType === dominant) {
          ch3DominantCount++;
        }
      }
    }

    let maxPossibleInCh3 = 4;
    if (dominant === 3 || dominant === 6) maxPossibleInCh3 = 5;
    if (dominant === 2 || dominant === 5) maxPossibleInCh3 = 3;

    let awarenessLevel = "🔄 ระดับ \"เวียนว่ายตายเกิด\" (Average)";
    let awarenessClass = "neon-purple";

    if (maxPossibleInCh3 === 3) {
      if (ch3DominantCount >= 2) {
        awarenessLevel = "🔥 ระดับ \"จมดิ่งในขุมนรก\" (Unhealthy)";
        awarenessClass = "neon-red";
      } else if (ch3DominantCount === 0) {
        awarenessLevel = "🕊️ ระดับ \"หลุดพ้น\" (Healthy)";
        awarenessClass = "neon-green";
      } else {
        awarenessLevel = "🔄 ระดับ \"เวียนว่ายตายเกิด\" (Average)";
        awarenessClass = "neon-cyan";
      }
    } else {
      if (ch3DominantCount >= 3) {
        awarenessLevel = "🔥 ระดับ \"จมดิ่งในขุมนรก\" (Unhealthy)";
        awarenessClass = "neon-red";
      } else if (ch3DominantCount <= 1) {
        awarenessLevel = "🕊️ ระดับ \"หลุดพ้น\" (Healthy)";
        awarenessClass = "neon-green";
      } else {
        awarenessLevel = "🔄 ระดับ \"เวียนว่ายตายเกิด\" (Average)";
        awarenessClass = "neon-cyan";
      }
    }

    // 3. Ego thickness (based on dominant score)
    const egoThickness = Math.min(60 + maxScore * 3.5, 99);

    // 4. Generate random Invoice ID
    const randomSerial = Math.floor(1000 + Math.random() * 9000);
    invoiceId.innerText = `No. KM-${660 + dominant}-${randomSerial}`;

    return {
      dominant,
      maxScore,
      awarenessLevel,
      awarenessClass,
      egoThickness
    };
  }

  function showResults() {
    const results = calculateResults();
    const profile = enneagramProfiles[results.dominant];

    // Populating DOM elements
    resultTypeName.innerText = profile.name;
    resultTypeTitle.innerText = profile.title;
    resultDescription.innerText = profile.description;
    resultPassiveSkill.innerText = profile.passiveSkill;

    // Set character portrait
    const characterImage = document.getElementById("result-character-image");
    if (characterImage) {
      characterImage.src = `/enneagram/images/type${results.dominant}.png`;
      characterImage.alt = profile.name;
    }
    
    // Set mitigation & enemy
    resultEnemy.innerText = profile.enemyName;
    resultMitigation.innerText = profile.mitigation;

    // Set metrics
    metricAwareness.innerText = results.awarenessLevel;
    metricAwareness.className = `metric-value ${results.awarenessClass} neon-text`;
    metricEgo.innerText = `${results.egoThickness}%`;
    metricEgo.className = `metric-value neon-purple neon-text`;

    // Populate Brain Chemicals
    chemicalsList.innerHTML = "";
    profile.chemicals.forEach(chem => {
      const item = document.createElement("div");
      item.className = "chem-item";
      item.innerHTML = `
        <div class="chem-label-row">
          <span class="chem-name">${chem.name}</span>
          <span class="chem-value">${chem.value}%</span>
        </div>
        <div class="chem-bar-bg">
          <div class="chem-bar-fill" style="width: 0%;"></div>
        </div>
      `;
      chemicalsList.appendChild(item);
      
      // Animate progress bar fill in next tick
      setTimeout(() => {
        item.querySelector(".chem-bar-fill").style.width = `${chem.value}%`;
      }, 100);
    });

    // Render Radar Chart
    renderRadarChart(userScores, results.dominant);

    // Save results to Database
    saveResultToDatabase(results.dominant, results.awarenessLevel, userScores);

    // Transition Screen
    quizScreen.classList.remove("active");
    setTimeout(() => {
      quizScreen.classList.add("hidden");
      resultsScreen.classList.remove("hidden");
      resultsScreen.classList.add("active");
      // Scroll to top of invoice
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  }

  function saveResultToDatabase(dominant, awarenessLevel, scores) {
    const payload = {
      name: userName,
      email: userEmail,
      dominant_type: dominant,
      awareness_level: awarenessLevel,
      scores: scores
    };

    // Dynamically point to Vercel production deployment if running on GitHub Pages
    const apiEndpoint = window.location.hostname.includes("github.io")
      ? "https://mawinmalipho.vercel.app/api/quiz-submit"
      : "/api/quiz-submit";

    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error('Database response error');
      return res.json();
    })
    .then(data => {
      console.log('Successfully saved to database:', data);
      loadQuizCount();
    })
    .catch(err => console.error('Database saving failed:', err));
  }

  // --- SVG Radar Chart Rendering ---
  function renderRadarChart(scores, domType) {
    const size = 360;
    const center = size / 2;
    const maxVal = 12; // Max possible score
    const maxRadius = 120;
    
    let svgContent = `<svg class="radar-chart" viewBox="0 0 ${size} ${size}">`;
    
    // Concentric grids (rings)
    const rings = 4;
    for (let i = 1; i <= rings; i++) {
      const r = (i / rings) * maxRadius;
      // Draw grid ring (polygon shape with 9 points)
      let ringPoints = [];
      for (let t = 1; t <= 9; t++) {
        const angleDeg = -90 + (t - 9) * 40;
        const angleRad = (angleDeg * Math.PI) / 180;
        const px = center + r * Math.cos(angleRad);
        const py = center + r * Math.sin(angleRad);
        ringPoints.push(`${px},${py}`);
      }
      svgContent += `<polygon points="${ringPoints.join(" ")}" class="radar-grid-ring" />`;
    }

    // Axis Lines & Labels
    const labels = ["L9", "L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"];
    
    for (let t = 1; t <= 9; t++) {
      const angleDeg = -90 + (t - 9) * 40;
      const angleRad = (angleDeg * Math.PI) / 180;
      
      // Axis Line
      const lx = center + maxRadius * Math.cos(angleRad);
      const ly = center + maxRadius * Math.sin(angleRad);
      svgContent += `<line x1="${center}" y1="${center}" x2="${lx}" y2="${ly}" class="radar-grid-line" />`;
      
      // Label positioning slightly outer
      const labelDistance = maxRadius + 22;
      const tx = center + labelDistance * Math.cos(angleRad);
      const ty = center + labelDistance * Math.sin(angleRad) + 3; // vertical centering adjustment
      
      const labelText = labels[t === 9 ? 0 : t];
      const isDom = t === domType;
      const labelClass = isDom ? "radar-axis-label active" : "radar-axis-label";
      
      svgContent += `<text x="${tx}" y="${ty}" text-anchor="middle" class="${labelClass}">${labelText}</text>`;
    }

    // User Scores Area Polygon
    let polyPoints = [];
    let scorePoints = []; // To render circles later
    for (let t = 1; t <= 9; t++) {
      const score = scores[t] || 0;
      const r = 15 + (score / maxVal) * (maxRadius - 15);
      const angleDeg = -90 + (t - 9) * 40;
      const angleRad = (angleDeg * Math.PI) / 180;
      const px = center + r * Math.cos(angleRad);
      const py = center + r * Math.sin(angleRad);
      polyPoints.push(`${px},${py}`);
      scorePoints.push({ x: px, y: py, val: score, type: t });
    }

    // Render Polygon Area
    svgContent += `<polygon points="${polyPoints.join(" ")}" class="radar-polygon" />`;

    // Render Point circles
    scorePoints.forEach(pt => {
      const color = pt.type === domType ? "var(--neon-pink)" : "var(--neon-purple)";
      svgContent += `<circle cx="${pt.x}" cy="${pt.y}" r="4.5" class="radar-point" style="stroke: ${color}" data-type="${pt.type}" data-val="${pt.val}" />`;
    });

    svgContent += `</svg>`;
    radarChartWrapper.innerHTML = svgContent;
  }

  // --- Scan for Karmic Enemy Animation & Modal ---

  function openEnemyScan() {
    // Reset modal state
    scanStatusText.innerText = "กำลังเข้าถึงสัจธรรมข้อมูลเพื่อตรวจระบบคู่ปรับ...";
    scanResultDetails.classList.add("hidden");
    radarScanAnim.classList.remove("hidden");
    
    // Display modal
    enemyScanModal.classList.add("active");

    const profile = enneagramProfiles[primaryType];
    const enemyProfile = enneagramProfiles[profile.enemyType];

    const statuses = [
      "กำลังวิเคราะห์เกราะกลไกทางอารมณ์ของคุณ...",
      "ตรวจวิเคราะห์หาคู่ปรับกระตุ้นอัตตา...",
      "จำลองปฏิกิริยาการมีปฏิสัมพันธ์เมื่อทำกิจกรรมร่วมกัน...",
      "ตรวจพบเป้าหมายขัดขาชวนสะอึกเด่นหรา!"
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < statuses.length) {
        scanStatusText.innerText = statuses[step];
        step++;
      } else {
        clearInterval(interval);
        showEnemyResult(profile, enemyProfile);
      }
    }, 600);
  }

  function showEnemyResult(profile, enemyProfile) {
    radarScanAnim.classList.add("hidden");
    scanStatusText.innerText = "วิเคราะห์คู่สับเปลี่ยนพฤติกรรมเรียบร้อย!";
    
    // Set details
    enemyName.innerText = profile.enemyName;
    enemyDesc.innerText = profile.enemyDesc;
    
    // Custom emoji avatar for types
    const avatars = {
      1: "👮‍♂️ (กรรมเพ่งโทษ — นรกคนดีย์)",
      2: "😇 (บ่วงทวงบุญคุณ — นักบุญทุนชาวบ้าน)",
      3: "🏆 (กรรมภาพลวงตา — คุกแห่งความสำเร็จ)",
      4: "🥀 (กรรมโศกนาฏกรรม — วังวนคนถูกลืม)",
      5: "🧙‍♂️ (กรรมกำแพงใจ — ถ้ำฤๅษีไฮเทค)",
      6: "🕵️‍♂️ (กรรมระแวงภัย — มโนวิตกจริต)",
      7: "🦄 (กรรมแสวงหา — มารร้อยโปรเจกต์)",
      8: "🦁 (กรรมครอบงำ — บารมีนักเลง)",
      9: "🦥 (กรรมละเลย — เจ้าชายนิทรา)"
    };
    enemyAvatar.innerText = avatars[profile.enemyType] || "👹";

    // Show details
    scanResultDetails.classList.remove("hidden");
  }

  function closeEnemyScan() {
    enemyScanModal.classList.remove("active");
  }

  // --- Copy/Share Result ---

  function shareResult() {
    const profile = enneagramProfiles[primaryType];
    const scoresString = Object.keys(userScores)
      .map(k => `L${k}: ${userScores[k]}คะแนน`)
      .join(" | ");

    const textToCopy = `🔮 ผลการวิเคราะห์ตนเองจาก [Enneaกรรม] 🔮\n\n` +
      `ลักษณ์หลัก: ${profile.name} (${profile.title})\n` +
      `ระดับการตื่นรู้: ${metricAwareness.innerText}\n` +
      `เกราะป้องกันตัวตน: ${metricEgo.innerText}\n\n` +
      `🛡️ สกิลติดตัว: ${profile.passiveSkill}\n` +
      `🕊️ ทางสายกลาง: ${profile.mitigation}\n\n` +
      `📊 สถิติกรรม 9 ลักษณ์:\n[ ${scoresString} ]\n\n` +
      `ลองมาเช็กเสียงสะท้อนจากกระจกส่องใจของคุณได้ที่:\n` +
      `https://mawinmalipho.github.io/enneagram/`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      // Show toast notification
      const toast = document.getElementById("share-toast");
      toast.className = "toast show";
      setTimeout(() => {
        toast.className = "toast";
      }, 3000);
    }).catch(err => {
      alert("ไม่สามารถคัดลอกได้โดยอัตโนมัติ กรุณาลองแชร์ใหม่อีกครั้ง");
    });
  }

  // --- Event Listeners ---
  btnStart.addEventListener("click", startQuiz);
  btnRetry.addEventListener("click", () => {
    resultsScreen.classList.remove("active");
    setTimeout(() => {
      resultsScreen.classList.add("hidden");
      introScreen.classList.remove("hidden");
      introScreen.classList.add("active");
      document.getElementById("user-name").focus();
    }, 400);
  });
  btnShare.addEventListener("click", shareResult);
  btnScanEnemy.addEventListener("click", openEnemyScan);
  closeModalBtn.addEventListener("click", closeEnemyScan);

  if (btnDownloadImage) {
    btnDownloadImage.addEventListener("click", () => {
      const originalText = btnDownloadImage.innerHTML;
      btnDownloadImage.innerHTML = "⏳ กำลังบันทึกรูปภาพ...";
      btnDownloadImage.disabled = true;

      const targetElement = document.getElementById("results-screen");
      const options = {
        scale: 2,
        useCORS: true,
        backgroundColor: "#06020f",
        logging: false
      };

      html2canvas(targetElement, options).then(canvas => {
        const link = document.createElement("a");
        const nameSuffix = userName ? `-${userName}` : "";
        link.download = `EnneaKarma-Certificate${nameSuffix}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        btnDownloadImage.innerHTML = originalText;
        btnDownloadImage.disabled = false;
      }).catch(err => {
        console.error("Error capturing card:", err);
        alert("ขออภัย ไม่สามารถบันทึกภาพได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
        btnDownloadImage.innerHTML = originalText;
        btnDownloadImage.disabled = false;
      });
    });
  }

  // Back button functionality
  btnBack.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      const prevChoiceIndex = answersHistory[currentQuestionIndex];
      const prevSelectedType = enneagramQuestions[currentQuestionIndex].choices[prevChoiceIndex].type;
      // Decrement the score for this type
      userScores[prevSelectedType]--;
      // Redraw the previous question
      showQuestion();
    }
  });

  // Close modal when clicking outside contents
  window.addEventListener("click", (e) => {
    if (e.target === enemyScanModal) {
      closeEnemyScan();
    }
  });

  // Fetch live quiz count
  function loadQuizCount() {
    const counterElement = document.getElementById("karmic-counter");
    if (!counterElement) return;

    const apiEndpoint = window.location.hostname.includes("github.io")
      ? "https://mawinmalipho.vercel.app/api/quiz-count"
      : "/api/quiz-count";

    fetch(apiEndpoint)
      .then(res => {
        if (!res.ok) throw new Error("Could not fetch quiz count");
        return res.json();
      })
      .then(data => {
        counterElement.innerText = Number(data.count).toLocaleString();
      })
      .catch(err => {
        console.error("Failed to load quiz count:", err);
        counterElement.innerText = "99+"; // fallback
      });
  }

  // Load count initially
  loadQuizCount();

});
