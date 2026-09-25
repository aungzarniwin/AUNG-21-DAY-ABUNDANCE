/* =========================================================
   AUNG 21-DAY ABUNDANCE
   V2 PROFESSIONAL JOURNEY APP
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const TOTAL_DAYS = 21;

const TOTAL_AFFIRMATIONS = 17;

const STORAGE_KEY = "aung21_abundance_v2";

const OLD_COMPLETED_KEY = "completed";



/* =========================================================
   AFFIRMATIONS
========================================================= */

const affirmations = [

  "ကျွန်ုပ်သည် ကာယကံ၊ ဝစီကံ၊ မနောကံ တို့ဖြင့် အမိအဖ ဆရာသမားတို့အပေါ်၌ သိ၍ဖြစ်စေ မသိ၍ဖြစ်စေ ပြစ်မှားထားမိပါက ခွင့်လွှတ်ပေးပါရန် တောင်းပန်အပ်ပါသည်။ ယနေ့မှစပြီး ကံများပွင့် ဉာဏ်များပွင့်ပြီး စီးပွားဥစ္စာများ တိုးပါစေသော်",

  "972999 AC ကျွန်ုပ်သည် စိတ်ချမ်းသာပြီး ကြွယ်ဝချမ်းသာစေသော Abundance coach ma Thandar မိသားစုဝင်အဖြစ် ခံယူလိုက်ပါပြီ",

  "972999 AC Abundance coach Ma Thandar မိသားစုဝင် ဖြစ်သောကြောင့် စိတ်ချမ်းသာပြီး အန္တရာယ်များကင်းနေပါပြီ",

  "နေ့စဉ်စိတ်တွေ အေးချမ်းပြီး ကျန်းမာလှပနေပါပြီ",

  "ငွေရှာရတာ အရမ်းလွယ်ကူနေပါပြီ",

  "ကြွယ်ဝချမ်းသာမှုတို့ကို လွယ်ကူစွာ ညှို့ယူနိုင်ပါပြီ",

  "972999 AC Abundance coach Ma Thandar မိသားစုဝင်ဖြစ်သောကြောင့် အပေါဆုံးက ငွေဖြစ်နေပါပြီ",

  "972999 AC Abundance coach Ma Thandar မိသားစုဝင်ဖြစ်သောကြောင့် အပေါဆုံးက စိန်ရွှေရတနာ ဖြစ်နေပါပြီ",

  "သုံးလိုက်သမျှ ငွေ ပိုက်ဆံတိုင်းက ဆပွားတိုးပြီး ပြန်လာကြရသည်",

  "ငွေတွေက မျှော်မှန်းထားတဲ့နေရာကရော မမျှော်မှန်းထားတဲ့နေရာကရော အလုံးလိုက် အလိပ်လိုက် ဝင်လာနေပါပြီ",

  "အလုပ်တွေလုပ်ရတာ အရမ်းလွယ်ကူလာပါပြီ",

  "ဝင်ငွေတွေ တစ်နေ့တစ်ခြား များသည်ထက် များလာနေပါပြီ",

  "ဘာလေးပဲ လိုချင်လိုချင် လွယ်လွယ်ကူကူနဲ့ ရတဲ့သူ ဖြစ်နေပါပြီ",

  "အတင်းမပြောပါ။ စိတ်ထားကောင်းတယ်။ အမြဲကြိုးစားတယ်။ ဒါ့ကြောင့် ကြွယ်ဝချမ်းသာမှုတို့နဲ့ထိုက်တန်တဲ့သူ ဖြစ်နေပါပြီ",

  "စိတ်တွေ အေးချမ်းနေပါပြီ",

  "ပြည့်စုံကြွယ်ဝ လိုတရနေပါပြီ",

  "972999 AC Abundance coach Ma Thandar မိသားစုဝင်ဖြစ်သောကြောင့် အမိ-အဖ-ဆရာသမားတွေနဲ့ အကျိုးရှိတဲ့ နေရာတွေကို များစွာ လှူဒါန်းနိုင်နေပါပြီ။ Thank you. Thank you. Thank you"

];



/* =========================================================
   STATE
========================================================= */

let currentDay = 1;

let currentSession = "morning";

let currentIndex = 0;

let appData = createDefaultData();



/* =========================================================
   DEFAULT DATA
========================================================= */

function createDefaultData() {

  return {

    version: 2,

    currentDay: 1,

    completed: {},

    journal: {},

    startedAt: new Date().toISOString(),

    completedAt: null

  };

}



/* =========================================================
   SAFE STORAGE
========================================================= */

function loadData() {

  try {

    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {

      return createDefaultData();

    }

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {

      return createDefaultData();

    }

    return {

      ...createDefaultData(),

      ...parsed

    };

  } catch (error) {

    console.warn(
      "Unable to load saved data",
      error
    );

    return createDefaultData();

  }

}



function saveData() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(appData)
    );

  } catch (error) {

    console.warn(
      "Unable to save data",
      error
    );

  }

}



/* =========================================================
   SESSION KEY
========================================================= */

function getSessionKey(
  day,
  type
) {

  return `${day}_${type}`;

}



/* =========================================================
   GET COMPLETED ARRAY
========================================================= */

function getCompleted(
  day,
  type
) {

  const key = getSessionKey(
    day,
    type
  );

  if (
    !appData.completed ||
    !Array.isArray(appData.completed[key])
  ) {

    return [];

  }

  return appData.completed[key];

}



/* =========================================================
   IS DONE
========================================================= */

function isAffirmationDone(
  day,
  type,
  index
) {

  return getCompleted(
    day,
    type
  ).includes(index);

}



/* =========================================================
   MARK SINGLE DONE
========================================================= */

function markAffirmationDone(
  day,
  type,
  index
) {

  const key = getSessionKey(
    day,
    type
  );

  if (!Array.isArray(appData.completed[key])) {

    appData.completed[key] = [];

  }

  if (
    !appData.completed[key].includes(index)
  ) {

    appData.completed[key].push(index);

  }

  saveData();

}



/* =========================================================
   SESSION COMPLETE
========================================================= */

function isSessionComplete(
  day,
  type
) {

  return (
    getCompleted(day, type).length >=
    TOTAL_AFFIRMATIONS
  );

}



/* =========================================================
   DAY COMPLETE
========================================================= */

function isDayComplete(day) {

  return (
    isSessionComplete(day, "morning") &&
    isSessionComplete(day, "night")
  );

}



/* =========================================================
   OPEN SESSION
========================================================= */

function openSession(type) {

  currentSession = type;

  currentDay =
    Number(
      appData.currentDay
    ) || 1;

  if (
    currentDay < 1 ||
    currentDay > TOTAL_DAYS
  ) {

    currentDay = 1;

  }

  const completed =
    getCompleted(
      currentDay,
      currentSession
    );


  /*
    Resume from first unfinished item
  */

  let firstUnfinished = 0;

  for (
    let i = 0;
    i < TOTAL_AFFIRMATIONS;
    i++
  ) {

    if (!completed.includes(i)) {

      firstUnfinished = i;

      break;

    }

    if (
      i ===
      TOTAL_AFFIRMATIONS - 1
    ) {

      firstUnfinished = 0;

    }

  }

  currentIndex = firstUnfinished;


  showScreen("sessionScreen");

  showAffirmation();

}



/* =========================================================
   SHOW AFFIRMATION
========================================================= */

function showAffirmation() {

  const textElement =
    document.getElementById(
      "affirmationText"
    );

  const numberElement =
    document.getElementById(
      "affirmationNumber"
    );

  const sessionDayElement =
    document.getElementById(
      "sessionDay"
    );

  const sessionTypeElement =
    document.getElementById(
      "sessionType"
    );

  const counterElement =
    document.getElementById(
      "sessionCounter"
    );

  const doneButton =
    document.getElementById(
      "doneButton"
    );

  const previousButton =
    document.getElementById(
      "previousButton"
    );

  const nextButton =
    document.getElementById(
      "nextButton"
    );


  if (!textElement) {

    return;

  }


  textElement.textContent =
    affirmations[currentIndex];


  numberElement.textContent =
    currentIndex + 1;


  sessionDayElement.textContent =
    `Day ${currentDay}`;


  sessionTypeElement.textContent =
    currentSession === "morning"
      ? "☀️ Morning"
      : "🌙 Night";


  counterElement.textContent =
    `${currentIndex + 1} / ${TOTAL_AFFIRMATIONS}`;


  const done =
    isAffirmationDone(
      currentDay,
      currentSession,
      currentIndex
    );


  if (done) {

    doneButton.textContent =
      "✓ Completed";

    doneButton.classList.add(
      "completed"
    );

  } else {

    doneButton.textContent =
      "✓ ဖတ်ပြီးပါပြီ";

    doneButton.classList.remove(
      "completed"
    );

  }


  previousButton.disabled =
    currentIndex === 0;


  nextButton.disabled =
    currentIndex ===
    TOTAL_AFFIRMATIONS - 1;


  updateSessionProgress();

}



/* =========================================================
   MARK DONE
========================================================= */

function markDone() {

  markAffirmationDone(
    currentDay,
    currentSession,
    currentIndex
  );

  updateSessionProgress();

  updateHome();

  const button =
    document.getElementById(
      "doneButton"
    );

  if (button) {

    button.textContent =
      "✓ Completed";

    button.classList.add(
      "completed"
    );

  }


  /*
    Small automatic movement
  */

  if (
    currentIndex <
    TOTAL_AFFIRMATIONS - 1
  ) {

    setTimeout(() => {

      currentIndex++;

      showAffirmation();

    }, 180);

  } else {

    /*
      Last affirmation
    */

    setTimeout(() => {

      if (
        isSessionComplete(
          currentDay,
          currentSession
        )
      ) {

        finishSession();

      }

    }, 250);

  }

}



/* =========================================================
   NEXT
========================================================= */

function nextAffirmation() {

  if (
    currentIndex >=
    TOTAL_AFFIRMATIONS - 1
  ) {

    return;

  }

  /*
    Automatically mark current
    as completed when moving forward
  */

  markAffirmationDone(
    currentDay,
    currentSession,
    currentIndex
  );

  currentIndex++;

  showAffirmation();

  updateHome();

}



/* =========================================================
   PREVIOUS
========================================================= */

function previousAffirmation() {

  if (currentIndex <= 0) {

    return;

  }

  currentIndex--;

  showAffirmation();

}



/* =========================================================
   FINISH SESSION
========================================================= */

function finishSession() {

  for (
    let i = 0;
    i < TOTAL_AFFIRMATIONS;
    i++
  ) {

    markAffirmationDone(
      currentDay,
      currentSession,
      i
    );

  }


  saveData();

  showCompleteScreen();

}



/* =========================================================
   SHOW COMPLETE
========================================================= */

function showCompleteScreen() {

  const title =
    document.getElementById(
      "completeTitle"
    );

  const message =
    document.getElementById(
      "completeMessage"
    );

  const dayNumber =
    document.getElementById(
      "completeDayNumber"
    );

  const streak =
    document.getElementById(
      "completeStreak"
    );


  if (
    currentDay === TOTAL_DAYS &&
    currentSession === "night"
  ) {

    title.textContent =
      "🏆 21-Day Journey Complete";

    message.textContent =
      "You have completed your full 21-Day Abundance Journey";

  } else {

    title.textContent =
      currentSession === "morning"
        ? "☀️ Morning Complete"
        : "🌙 Night Complete";


    message.textContent =
      currentSession === "morning"
        ? "Morning practice completed. Continue with your Night practice"
        : "Night practice completed. Your daily practice is complete";

  }


  dayNumber.textContent =
    `Day ${currentDay}`;


  streak.textContent =
    calculateStreak();


  showScreen("completeScreen");

}



/* =========================================================
   CONTINUE AFTER COMPLETE
========================================================= */

function continueAfterComplete() {

  /*
    Morning → Night
  */

  if (
    currentSession === "morning"
  ) {

    currentSession = "night";

    currentIndex = 0;

    saveData();

    openSession("night");

    return;

  }


  /*
    Night → Next Day
  */

  if (
    currentSession === "night"
  ) {

    if (
      currentDay <
      TOTAL_DAYS
    ) {

      currentDay++;

      appData.currentDay =
        currentDay;

      saveData();

      /*
        New day
      */

      currentSession = "morning";

      currentIndex = 0;

      updateHome();

      openSession("morning");

      return;

    }


    /*
      Day 21 completed
    */

    appData.completedAt =
      new Date().toISOString();

    saveData();

    showCertificate();

  }

}



/* =========================================================
   SHOW CERTIFICATE
========================================================= */

function showCertificate() {

  const dateElement =
    document.getElementById(
      "certificateDate"
    );


  if (dateElement) {

    const date =
      new Date();

    dateElement.textContent =
      `Completed ${date.toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }
      )}`;

  }


  showScreen(
    "certificateScreen"
  );

}



/* =========================================================
   GO HOME
========================================================= */

function goHome() {

  showScreen("homeScreen");

  updateHome();

}



/* =========================================================
   SHOW SCREEN
========================================================= */

function showScreen(
  screenId
) {

  const screens = [
    "homeScreen",
    "sessionScreen",
    "completeScreen",
    "certificateScreen"
  ];


  screens.forEach(
    id => {

      const element =
        document.getElementById(id);

      if (!element) {

        return;

      }

      if (id === screenId) {

        element.classList.remove(
          "hidden"
        );

      } else {

        element.classList.add(
          "hidden"
        );

      }

    }
  );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}



/* =========================================================
   SESSION PROGRESS
========================================================= */

function updateSessionProgress() {

  const completed =
    getCompleted(
      currentDay,
      currentSession
    ).length;


  const percentage =
    Math.round(
      (
        completed /
        TOTAL_AFFIRMATIONS
      ) * 100
    );


  const progress =
    document.getElementById(
      "sessionProgress"
    );


  const text =
    document.getElementById(
      "sessionProgressText"
    );


  if (progress) {

    progress.style.width =
      `${percentage}%`;

  }


  if (text) {

    text.textContent =
      `${completed} / ${TOTAL_AFFIRMATIONS} completed`;

  }

}



/* =========================================================
   DAILY PROGRESS
========================================================= */

function calculateDayProgress(day) {

  const morning =
    getCompleted(
      day,
      "morning"
    ).length;


  const night =
    getCompleted(
      day,
      "night"
    ).length;


  const total =
    morning + night;


  return {

    morning,

    night,

    total,

    percentage:
      Math.round(
        (
          total /
          (
            TOTAL_AFFIRMATIONS * 2
          )
        ) * 100
      )

  };

}



/* =========================================================
   OVERALL PROGRESS
========================================================= */

function calculateOverallProgress() {

  let totalCompleted = 0;


  for (
    let day = 1;
    day <= TOTAL_DAYS;
    day++
  ) {

    totalCompleted +=
      getCompleted(
        day,
        "morning"
      ).length;


    totalCompleted +=
      getCompleted(
        day,
        "night"
      ).length;

  }


  const totalPossible =
    TOTAL_DAYS *
    2 *
    TOTAL_AFFIRMATIONS;


  return {

    completed:
      totalCompleted,

    total:
      totalPossible,

    percentage:
      Math.round(
        (
          totalCompleted /
          totalPossible
        ) * 100
      )

  };

}



/* =========================================================
   COMPLETED DAYS
========================================================= */

function countCompletedDays() {

  let count = 0;


  for (
    let day = 1;
    day <= TOTAL_DAYS;
    day++
  ) {

    if (
      isDayComplete(day)
    ) {

      count++;

    }

  }


  return count;

}



/* =========================================================
   STREAK
========================================================= */

function calculateStreak() {

  let streak = 0;


  /*
    Find the latest completed day
  */

  for (
    let day = TOTAL_DAYS;
    day >= 1;
    day--
  ) {

    if (
      isDayComplete(day)
    ) {

      streak++;

    } else {

      break;

    }

  }


  /*
    If current progress is not
    completed from the end,
    calculate consecutive days
    from Day 1
  */

  if (streak === 0) {

    for (
      let day = 1;
      day <= TOTAL_DAYS;
      day++
    ) {

      if (
        isDayComplete(day)
      ) {

        streak++;

      } else {

        break;

      }

    }

  }


  return streak;

}



/* =========================================================
   UPDATE HOME
========================================================= */

function updateHome() {

  updateDayTitle();

  updateOverallProgress();

  updateStreak();

  updateSessionStatus();

  updateJournal();

  renderDays();

  updateDate();

}



/* =========================================================
   DAY TITLE
========================================================= */

function updateDayTitle() {

  const element =
    document.getElementById(
      "dayTitle"
    );


  if (!element) {

    return;

  }


  element.textContent =
    `Day ${currentDay}`;

}



/* =========================================================
   OVERALL UI
========================================================= */

function updateOverallProgress() {

  const data =
    calculateOverallProgress();


  const progress =
    document.getElementById(
      "overallProgress"
    );


  const text =
    document.getElementById(
      "overallText"
    );


  const daysText =
    document.getElementById(
      "completedDaysText"
    );


  const totalText =
    document.getElementById(
      "totalCompletedText"
    );


  const todayText =
    document.getElementById(
      "todayPercent"
    );


  if (progress) {

    progress.style.width =
      `${data.percentage}%`;

  }


  if (text) {

    text.textContent =
      `${data.percentage}%`;

  }


  if (daysText) {

    daysText.textContent =
      `${countCompletedDays()} / ${TOTAL_DAYS}`;

  }


  if (totalText) {

    totalText.textContent =
      `${data.completed}`;

  }


  if (todayText) {

    todayText.textContent =
      `${calculateDayProgress(currentDay).percentage}%`;

  }

}



/* =========================================================
   STREAK UI
========================================================= */

function updateStreak() {

  const element =
    document.getElementById(
      "streakNumber"
    );


  if (element) {

    element.textContent =
      calculateStreak();

  }

}



/* =========================================================
   SESSION STATUS
========================================================= */

function updateSessionStatus() {

  const morningData =
    calculateDayProgress(
      currentDay
    );


  const morningCount =
    morningData.morning;


  const nightCount =
    morningData.night;


  const morningStatus =
    document.getElementById(
      "morningStatus"
    );


  const nightStatus =
    document.getElementById(
      "nightStatus"
    );


  const morningProgress =
    document.getElementById(
      "morningProgress"
    );


  const nightProgress =
    document.getElementById(
      "nightProgress"
    );


  const morningButton =
    document.getElementById(
      "morningButton"
    );


  const nightButton =
    document.getElementById(
      "nightButton"
    );


  const morningPercent =
    Math.round(
      (
        morningCount /
        TOTAL_AFFIRMATIONS
      ) * 100
    );


  const nightPercent =
    Math.round(
      (
        nightCount /
        TOTAL_AFFIRMATIONS
      ) * 100
    );


  if (morningStatus) {

    morningStatus.textContent =
      `${morningCount} / ${TOTAL_AFFIRMATIONS} completed`;

  }


  if (nightStatus) {

    nightStatus.textContent =
      `${nightCount} / ${TOTAL_AFFIRMATIONS} completed`;

  }


  if (morningProgress) {

    morningProgress.style.width =
      `${morningPercent}%`;

  }


  if (nightProgress) {

    nightProgress.style.width =
      `${nightPercent}%`;

  }


  if (morningButton) {

    if (
      morningCount >=
      TOTAL_AFFIRMATIONS
    ) {

      morningButton.textContent =
        "Review";

      morningButton.classList.add(
        "completed"
      );

    } else if (morningCount > 0) {

      morningButton.textContent =
        "Continue";

      morningButton.classList.remove(
        "completed"
      );

    } else {

      morningButton.textContent =
        "Start";

      morningButton.classList.remove(
        "completed"
      );

    }

  }


  if (nightButton) {

    if (
      nightCount >=
      TOTAL_AFFIRMATIONS
    ) {

      nightButton.textContent =
        "Review";

      nightButton.classList.add(
        "completed"
      );

    } else if (nightCount > 0) {

      nightButton.textContent =
        "Continue";

      nightButton.classList.remove(
        "completed"
      );

    } else {

      nightButton.textContent =
        "Start";

      nightButton.classList.remove(
        "completed"
      );

    }

  }

}



/* =========================================================
   RENDER DAYS
========================================================= */

function renderDays() {

  const grid =
    document.getElementById(
      "daysGrid"
    );


  if (!grid) {

    return;

  }


  grid.innerHTML = "";


  for (
    let day = 1;
    day <= TOTAL_DAYS;
    day++
  ) {

    const button =
      document.createElement(
        "button"
      );


    button.type = "button";

    button.className =
      "day-button";


    if (
      day === currentDay
    ) {

      button.classList.add(
        "active"
      );

    }


    if (
      isDayComplete(day)
    ) {

      button.classList.add(
        "completed"
      );

    }


    const progress =
      calculateDayProgress(
        day
      );


    let status =
      `${progress.percentage}%`;


    if (
      isDayComplete(day)
    ) {

      status = "✓ Done";

    }


    button.innerHTML = `
      <span>${day}</span>
      <span>${status}</span>
    `;


    button.addEventListener(
      "click",
      () => selectDay(day)
    );


    grid.appendChild(
      button
    );

  }

}



/* =========================================================
   SELECT DAY
========================================================= */

function selectDay(day) {

  if (
    day < 1 ||
    day > TOTAL_DAYS
  ) {

    return;

  }


  currentDay = day;

  appData.currentDay =
    currentDay;

  saveData();

  updateHome();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}



/* =========================================================
   JOURNAL KEY
========================================================= */

function getJournalKey(day) {

  return `day_${day}`;

}



/* =========================================================
   GET JOURNAL
========================================================= */

function getJournal(day) {

  const key =
    getJournalKey(day);


  if (
    !appData.journal ||
    typeof appData.journal[key] !==
      "object"
  ) {

    return {

      intention: "",
      action: "",
      gratitude1: "",
      gratitude2: "",
      gratitude3: "",
      reflection: ""

    };

  }


  return {

    intention:
      appData.journal[key].intention || "",

    action:
      appData.journal[key].action || "",

    gratitude1:
      appData.journal[key].gratitude1 || "",

    gratitude2:
      appData.journal[key].gratitude2 || "",

    gratitude3:
      appData.journal[key].gratitude3 || "",

    reflection:
      appData.journal[key].reflection || ""

  };

}



/* =========================================================
   SAVE JOURNAL
========================================================= */

function saveJournal() {

  const key =
    getJournalKey(
      currentDay
    );


  if (!appData.journal) {

    appData.journal = {};

  }


  appData.journal[key] = {

    intention:
      getValue("intentionInput"),

    action:
      getValue("actionInput"),

    gratitude1:
      getValue("gratitude1"),

    gratitude2:
      getValue("gratitude2"),

    gratitude3:
      getValue("gratitude3"),

    reflection:
      getValue("reflectionInput")

  };


  saveData();


  const status =
    document.getElementById(
      "journalSaveStatus"
    );


  if (status) {

    status.textContent =
      "✓ Auto saved";

    status.style.color =
      "#16a34a";

  }

}



/* =========================================================
   GET INPUT VALUE
========================================================= */

function getValue(id) {

  const element =
    document.getElementById(id);


  if (!element) {

    return "";

  }


  return element.value;

}



/* =========================================================
   UPDATE JOURNAL UI
========================================================= */

function updateJournal() {

  const journal =
    getJournal(
      currentDay
    );


  setValue(
    "intentionInput",
    journal.intention
  );


  setValue(
    "actionInput",
    journal.action
  );


  setValue(
    "gratitude1",
    journal.gratitude1
  );


  setValue(
    "gratitude2",
    journal.gratitude2
  );


  setValue(
    "gratitude3",
    journal.gratitude3
  );


  setValue(
    "reflectionInput",
    journal.reflection
  );

}



/* =========================================================
   SET VALUE
========================================================= */

function setValue(
  id,
  value
) {

  const element =
    document.getElementById(id);


  if (element) {

    element.value =
      value || "";

  }

}



/* =========================================================
   DATE
========================================================= */

function updateDate() {

  const element =
    document.getElementById(
      "todayDate"
    );


  if (!element) {

    return;

  }


  const date =
    new Date();


  element.textContent =
    date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

}



/* =========================================================
   RESET
========================================================= */

function resetAll() {

  const confirmed =
    window.confirm(
      "Are you sure you want to reset your entire 21-Day Journey?"
    );


  if (!confirmed) {

    return;

  }


  localStorage.removeItem(
    STORAGE_KEY
  );


  /*
    Remove old version too
  */

  localStorage.removeItem(
    OLD_COMPLETED_KEY
  );


  appData =
    createDefaultData();


  currentDay = 1;

  currentSession =
    "morning";

  currentIndex = 0;


  updateHome();

  showScreen(
    "homeScreen"
  );

}



/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    const sessionScreen =
      document.getElementById(
        "sessionScreen"
      );


    if (
      !sessionScreen ||
      sessionScreen.classList.contains(
        "hidden"
      )
    ) {

      return;

    }


    if (
      event.key ===
      "ArrowRight"
    ) {

      nextAffirmation();

    }


    if (
      event.key ===
      "ArrowLeft"
    ) {

      previousAffirmation();

    }


    if (
      event.key ===
      "Enter"
    ) {

      markDone();

    }

  }
);



/* =========================================================
   INITIALIZE
========================================================= */

function initApp() {

  appData =
    loadData();


  currentDay =
    Number(
      appData.currentDay
    ) || 1;


  if (
    currentDay < 1 ||
    currentDay > TOTAL_DAYS
  ) {

    currentDay = 1;

    appData.currentDay = 1;

    saveData();

  }


  currentSession =
    "morning";


  currentIndex = 0;


  updateHome();

  showScreen(
    "homeScreen"
  );

}



/* =========================================================
   DOM READY
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initApp
  );

} else {

  initApp();

}
