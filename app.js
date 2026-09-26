/* =========================================================
   AUNG 21-DAY ABUNDANCE
   V2.1 PROFESSIONAL JOURNEY APP
   ---------------------------------------------------------
   21 Days
   Morning + Night
   17 Affirmations
   LocalStorage
   Journal
   Gratitude
   Reflection
   Streak
   Certificate
   No 369 functionality
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const TOTAL_DAYS = 21;
const TOTAL_AFFIRMATIONS = 17;

const STORAGE_KEY = "aung21_abundance_v2";
const OLD_COMPLETED_KEY = "completed";

const SESSION_TYPES = ["morning", "night"];


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
   RUNTIME STATE
========================================================= */

let currentDay = 1;
let currentSession = "morning";
let currentIndex = 0;

let appData = createDefaultData();

let navigationTimer = null;


/* =========================================================
   DEFAULT JOURNAL
========================================================= */

function createEmptyJournal() {

  return {
    intention: "",
    action: "",
    gratitude1: "",
    gratitude2: "",
    gratitude3: "",
    reflection: ""
  };

}


/* =========================================================
   DEFAULT DATA
========================================================= */

function createDefaultData() {

  return {

    version: 2.1,

    currentDay: 1,

    completed: {},

    journal: {},

    startedAt: new Date().toISOString(),

    completedAt: null

  };

}


/* =========================================================
   NORMALIZE DATA
========================================================= */

function normalizeData(data) {

  const defaults = createDefaultData();

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {

    return defaults;

  }

  const normalized = {

    ...defaults,

    ...data,

    completed:
      data.completed &&
      typeof data.completed === "object" &&
      !Array.isArray(data.completed)
        ? data.completed
        : {},

    journal:
      data.journal &&
      typeof data.journal === "object" &&
      !Array.isArray(data.journal)
        ? data.journal
        : {}

  };

  let day =
    Number(normalized.currentDay);

  if (
    !Number.isFinite(day) ||
    day < 1 ||
    day > TOTAL_DAYS
  ) {

    day = 1;

  }

  normalized.currentDay = day;

  normalized.version = 2.1;

  return normalized;

}


/* =========================================================
   SAFE STORAGE - LOAD
========================================================= */

function loadData() {

  try {

    const raw =
      localStorage.getItem(STORAGE_KEY);

    if (!raw) {

      return createDefaultData();

    }

    const parsed =
      JSON.parse(raw);

    return normalizeData(parsed);

  } catch (error) {

    console.warn(
      "Unable to load saved data",
      error
    );

    return createDefaultData();

  }

}


/* =========================================================
   SAFE STORAGE - SAVE
========================================================= */

function saveData() {

  try {

    appData =
      normalizeData(appData);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(appData)
    );

    return true;

  } catch (error) {

    console.warn(
      "Unable to save data",
      error
    );

    return false;

  }

}


/* =========================================================
   SESSION KEY
========================================================= */

function getSessionKey(day, type) {

  const safeDay =
    Number(day);

  const safeType =
    type === "night"
      ? "night"
      : "morning";

  return `${safeDay}_${safeType}`;

}


/* =========================================================
   GET COMPLETED
========================================================= */

function getCompleted(day, type) {

  const key =
    getSessionKey(
      day,
      type
    );

  if (
    !appData.completed ||
    !Array.isArray(
      appData.completed[key]
    )
  ) {

    return [];

  }

  /*
    Remove invalid indexes
    and duplicate values
  */

  const clean =
    [...new Set(
      appData.completed[key]
        .map(Number)
        .filter(
          index =>
            Number.isInteger(index) &&
            index >= 0 &&
            index < TOTAL_AFFIRMATIONS
        )
    )].sort(
      (a, b) => a - b
    );

  return clean;

}


/* =========================================================
   IS AFFIRMATION DONE
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
   MARK AFFIRMATION DONE
========================================================= */

function markAffirmationDone(
  day,
  type,
  index
) {

  if (
    index < 0 ||
    index >= TOTAL_AFFIRMATIONS
  ) {

    return false;

  }

  const key =
    getSessionKey(
      day,
      type
    );

  const completed =
    getCompleted(
      day,
      type
    );

  if (
    !completed.includes(index)
  ) {

    completed.push(index);

    completed.sort(
      (a, b) => a - b
    );

  }

  if (!appData.completed) {

    appData.completed = {};

  }

  appData.completed[key] =
    completed;

  saveData();

  return true;

}


/* =========================================================
   MARK ENTIRE SESSION COMPLETE
========================================================= */

function markSessionComplete(
  day,
  type
) {

  const key =
    getSessionKey(
      day,
      type
    );

  appData.completed[key] =
    Array.from(
      { length: TOTAL_AFFIRMATIONS },
      (_, index) => index
    );

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
    getCompleted(
      day,
      type
    ).length ===
    TOTAL_AFFIRMATIONS
  );

}


/* =========================================================
   DAY COMPLETE
========================================================= */

function isDayComplete(day) {

  return (
    isSessionComplete(
      day,
      "morning"
    ) &&
    isSessionComplete(
      day,
      "night"
    )
  );

}


/* =========================================================
   FIND FIRST UNFINISHED
========================================================= */

function findFirstUnfinished(
  day,
  type
) {

  const completed =
    getCompleted(
      day,
      type
    );

  for (
    let i = 0;
    i < TOTAL_AFFIRMATIONS;
    i++
  ) {

    if (!completed.includes(i)) {

      return i;

    }

  }

  /*
    Fully completed session
    opens at first affirmation
    for review
  */

  return 0;

}


/* =========================================================
   OPEN SESSION
========================================================= */

function openSession(type) {

  if (
    type !== "morning" &&
    type !== "night"
  ) {

    type = "morning";

  }

  currentSession =
    type;

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

  currentIndex =
    findFirstUnfinished(
      currentDay,
      currentSession
    );

  showScreen(
    "sessionScreen"
  );

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

  /*
    Safety
  */

  if (
    currentIndex < 0 ||
    currentIndex >= TOTAL_AFFIRMATIONS
  ) {

    currentIndex = 0;

  }

  textElement.textContent =
    affirmations[currentIndex] || "";

  if (numberElement) {

    numberElement.textContent =
      currentIndex + 1;

  }

  if (sessionDayElement) {

    sessionDayElement.textContent =
      `Day ${currentDay}`;

  }

  if (sessionTypeElement) {

    sessionTypeElement.textContent =
      currentSession === "morning"
        ? "☀️ Morning"
        : "🌙 Night";

  }

  if (counterElement) {

    counterElement.textContent =
      `${currentIndex + 1} / ${TOTAL_AFFIRMATIONS}`;

  }

  const done =
    isAffirmationDone(
      currentDay,
      currentSession,
      currentIndex
    );

  if (doneButton) {

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

  }

  if (previousButton) {

    previousButton.disabled =
      currentIndex === 0;

  }

  if (nextButton) {

    nextButton.disabled =
      currentIndex ===
      TOTAL_AFFIRMATIONS - 1;

  }

  updateSessionProgress();

}


/* =========================================================
   MARK DONE
========================================================= */

function markDone() {

  /*
    Prevent accidental repeated execution
  */

  if (navigationTimer) {

    clearTimeout(
      navigationTimer
    );

    navigationTimer = null;

  }

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
    Automatically move to next
  */

  if (
    currentIndex <
    TOTAL_AFFIRMATIONS - 1
  ) {

    navigationTimer =
      setTimeout(() => {

        navigationTimer = null;

        currentIndex++;

        showAffirmation();

      }, 180);

    return;

  }

  /*
    Last affirmation
  */

  if (
    isSessionComplete(
      currentDay,
      currentSession
    )
  ) {

    navigationTimer =
      setTimeout(() => {

        navigationTimer = null;

        finishSession();

      }, 250);

  }

}


/* =========================================================
   NEXT AFFIRMATION
========================================================= */

function nextAffirmation() {

  if (
    currentIndex >=
    TOTAL_AFFIRMATIONS - 1
  ) {

    return;

  }

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
   PREVIOUS AFFIRMATION
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

  markSessionComplete(
    currentDay,
    currentSession
  );

  currentIndex = 0;

  saveData();

  updateHome();

  showCompleteScreen();

}


/* =========================================================
   SHOW COMPLETE SCREEN
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

  const dayComplete =
    isDayComplete(
      currentDay
    );

  const journeyComplete =
    currentDay === TOTAL_DAYS &&
    dayComplete;

  if (journeyComplete) {

    if (title) {

      title.textContent =
        "🏆 21-Day Journey Complete";

    }

    if (message) {

      message.textContent =
        "You have completed your full 21-Day Abundance Journey";

    }

  } else if (
    currentSession === "morning"
  ) {

    if (title) {

      title.textContent =
        "☀️ Morning Complete";

    }

    if (message) {

      message.textContent =
        dayComplete
          ? "Today's Morning and Night practices are complete"
          : "Morning practice completed. Continue with your Night practice";

    }

  } else {

    if (title) {

      title.textContent =
        "🌙 Night Complete";

    }

    if (message) {

      message.textContent =
        dayComplete
          ? "Today's complete practice is finished"
          : "Night practice completed. Your daily practice is complete";

    }

  }

  if (dayNumber) {

    dayNumber.textContent =
      `Day ${currentDay}`;

  }

  if (streak) {

    streak.textContent =
      calculateStreak();

  }

  showScreen(
    "completeScreen"
  );

}


/* =========================================================
   CONTINUE AFTER COMPLETE
========================================================= */

function continueAfterComplete() {

  /*
    MORNING → NIGHT
  */

  if (
    currentSession === "morning"
  ) {

    currentSession =
      "night";

    currentIndex =
      findFirstUnfinished(
        currentDay,
        "night"
      );

    openSession(
      "night"
    );

    return;

  }


  /*
    NIGHT → NEXT DAY
  */

  if (
    currentSession === "night"
  ) {

    /*
      Day 21
    */

    if (
      currentDay === TOTAL_DAYS &&
      isDayComplete(currentDay)
    ) {

      appData.completedAt =
        new Date().toISOString();

      saveData();

      showCertificate();

      return;

    }

    /*
      Move to next day
    */

    if (
      currentDay < TOTAL_DAYS
    ) {

      currentDay++;

      appData.currentDay =
        currentDay;

      saveData();

      currentSession =
        "morning";

      currentIndex = 0;

      updateHome();

      openSession(
        "morning"
      );

      return;

    }

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

    let completedDate;

    if (appData.completedAt) {

      completedDate =
        new Date(
          appData.completedAt
        );

    } else {

      completedDate =
        new Date();

    }

    dateElement.textContent =
      `Completed ${completedDate.toLocaleDateString(
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

  showScreen(
    "homeScreen"
  );

  updateHome();

}


/* =========================================================
   SHOW SCREEN
========================================================= */

function showScreen(screenId) {

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

  /*
    Use instant scroll for
    screen transitions so mobile
    navigation feels stable
  */

  window.scrollTo({
    top: 0,
    behavior: "auto"
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
      `${Math.min(
        100,
        percentage
      )}%`;

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

  const totalPossible =
    TOTAL_AFFIRMATIONS * 2;

  return {

    morning,

    night,

    total,

    percentage:
      Math.round(
        (
          total /
          totalPossible
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

  const percentage =
    totalPossible > 0
      ? Math.round(
          (
            totalCompleted /
            totalPossible
          ) * 100
        )
      : 0;

  return {

    completed:
      totalCompleted,

    total:
      totalPossible,

    percentage:
      Math.min(
        100,
        percentage
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
   ---------------------------------------------------------
   Streak = consecutive completed days
   from the latest completed day
========================================================= */

function calculateStreak() {

  const completedDays = [];

  for (
    let day = 1;
    day <= TOTAL_DAYS;
    day++
  ) {

    if (
      isDayComplete(day)
    ) {

      completedDays.push(day);

    }

  }

  if (
    completedDays.length === 0
  ) {

    return 0;

  }

  let streak = 0;

  for (
    let i =
      completedDays.length - 1;
    i >= 0;
    i--
  ) {

    if (
      i ===
      completedDays.length - 1
    ) {

      streak = 1;

      continue;

    }

    if (
      completedDays[i + 1] -
      completedDays[i] === 1
    ) {

      streak++;

    } else {

      break;

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
      `${calculateDayProgress(
        currentDay
      ).percentage}%`;

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

  const progress =
    calculateDayProgress(
      currentDay
    );

  const morningCount =
    progress.morning;

  const nightCount =
    progress.night;

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
      `${Math.min(
        100,
        morningPercent
      )}%`;

  }

  if (nightProgress) {

    nightProgress.style.width =
      `${Math.min(
        100,
        nightPercent
      )}%`;

  }

  updateSessionButton(
    morningButton,
    morningCount
  );

  updateSessionButton(
    nightButton,
    nightCount
  );

}


/* =========================================================
   SESSION BUTTON
========================================================= */

function updateSessionButton(
  button,
  completedCount
) {

  if (!button) {

    return;

  }

  button.classList.remove(
    "completed"
  );

  if (
    completedCount >=
    TOTAL_AFFIRMATIONS
  ) {

    button.textContent =
      "Review";

    button.classList.add(
      "completed"
    );

    return;

  }

  if (
    completedCount > 0
  ) {

    button.textContent =
      "Continue";

    return;

  }

  button.textContent =
    "Start";

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

    button.type =
      "button";

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

      status =
        "✓ Done";

    }

    button.innerHTML = `
      <span>${day}</span>
      <span>${status}</span>
    `;

    button.setAttribute(
      "aria-label",
      `Day ${day}, ${status}`
    );

    button.addEventListener(
      "click",
      () => {

        selectDay(day);

      }
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

  const selectedDay =
    Number(day);

  if (
    !Number.isInteger(
      selectedDay
    ) ||
    selectedDay < 1 ||
    selectedDay > TOTAL_DAYS
  ) {

    return;

  }

  currentDay =
    selectedDay;

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
    !appData.journal[key] ||
    typeof appData.journal[key] !== "object"
  ) {

    return createEmptyJournal();

  }

  const saved =
    appData.journal[key];

  return {

    intention:
      typeof saved.intention === "string"
        ? saved.intention
        : "",

    action:
      typeof saved.action === "string"
        ? saved.action
        : "",

    gratitude1:
      typeof saved.gratitude1 === "string"
        ? saved.gratitude1
        : "",

    gratitude2:
      typeof saved.gratitude2 === "string"
        ? saved.gratitude2
        : "",

    gratitude3:
      typeof saved.gratitude3 === "string"
        ? saved.gratitude3
        : "",

    reflection:
      typeof saved.reflection === "string"
        ? saved.reflection
        : ""

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
      getValue(
        "intentionInput"
      ),

    action:
      getValue(
        "actionInput"
      ),

    gratitude1:
      getValue(
        "gratitude1"
      ),

    gratitude2:
      getValue(
        "gratitude2"
      ),

    gratitude3:
      getValue(
        "gratitude3"
      ),

    reflection:
      getValue(
        "reflectionInput"
      )

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
   GET VALUE
========================================================= */

function getValue(id) {

  const element =
    document.getElementById(id);

  if (!element) {

    return "";

  }

  return element.value || "";

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
    document.getElementById(
      id
    );

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
   RESET ALL
========================================================= */

function resetAll() {

  const confirmed =
    window.confirm(
      "Are you sure you want to reset your entire 21-Day Journey?"
    );

  if (!confirmed) {

    return;

  }

  try {

    localStorage.removeItem(
      STORAGE_KEY
    );

    localStorage.removeItem(
      OLD_COMPLETED_KEY
    );

  } catch (error) {

    console.warn(
      "Unable to clear storage",
      error
    );

  }

  appData =
    createDefaultData();

  currentDay =
    1;

  currentSession =
    "morning";

  currentIndex =
    0;

  if (navigationTimer) {

    clearTimeout(
      navigationTimer
    );

    navigationTimer = null;

  }

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

    /*
      Don't hijack keyboard navigation
      while user is typing into an input
    */

    const active =
      document.activeElement;

    if (
      active &&
      (
        active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.isContentEditable
      )
    ) {

      return;

    }

    if (
      event.key ===
      "ArrowRight"
    ) {

      event.preventDefault();

      nextAffirmation();

    }

    if (
      event.key ===
      "ArrowLeft"
    ) {

      event.preventDefault();

      previousAffirmation();

    }

    if (
      event.key ===
      "Enter"
    ) {

      event.preventDefault();

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

    appData.currentDay =
      1;

  }

  currentSession =
    "morning";

  currentIndex =
    0;

  /*
    Repair invalid stored data
  */

  saveData();

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
    initApp,
    {
      once: true
    }
  );

} else {

  initApp();

}
