/* =========================================================
   AUNG 21-DAY ABUNDANCE
   V2.2 PROFESSIONAL JOURNEY APP
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

   NEW
   IMPORTANT VIP 21 SYSTEM
   - 21 VIP Items
   - Runtime System Data
   - No LocalStorage for VIP
   - No Cloud Database for VIP
   - Edit / Update
   - Complete / Incomplete
   - Pin
   - Search
   - Progress
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

  if (
    currentSession === "night"
  ) {

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

  renderImportantVIP();

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
   IMPORTANT VIP 21 SYSTEM
   ---------------------------------------------------------
   IMPORTANT:
   VIP DATA IS NOT SAVED TO LOCALSTORAGE
   VIP DATA IS NOT SAVED TO CLOUD
   VIP DATA EXISTS INSIDE APP RUNTIME
========================================================= */

const IMPORTANT_VIP_TOTAL = 21;


/* =========================================================
   IMPORTANT VIP DATA
========================================================= */

const importantVIP = Array.from(
  { length: IMPORTANT_VIP_TOTAL },
  (_, index) => ({
    id: index + 1,
    title: `VIP ${String(index + 1).padStart(2, "0")}`,
    note: "",
    completed: false,
    pinned: false
  })
);


/* =========================================================
   IMPORTANT VIP HELPERS
========================================================= */

function getImportantVIP(id) {

  const vipId =
    Number(id);

  return importantVIP.find(
    item =>
      item.id === vipId
  ) || null;

}


function updateImportantVIP(
  id,
  note
) {

  const item =
    getImportantVIP(id);

  if (!item) {

    return false;

  }

  item.note =
    typeof note === "string"
      ? note.trim()
      : "";

  renderImportantVIP();

  return true;

}


function completeImportantVIP(id) {

  const item =
    getImportantVIP(id);

  if (!item) {

    return false;

  }

  item.completed = true;

  renderImportantVIP();

  return true;

}


function uncompleteImportantVIP(id) {

  const item =
    getImportantVIP(id);

  if (!item) {

    return false;

  }

  item.completed = false;

  renderImportantVIP();

  return true;

}


function toggleImportantVIPPin(id) {

  const item =
    getImportantVIP(id);

  if (!item) {

    return false;

  }

  item.pinned =
    !item.pinned;

  renderImportantVIP();

  return true;

}


function getImportantVIPProgress() {

  const completed =
    importantVIP.filter(
      item =>
        item.completed
    ).length;

  const percentage =
    Math.round(
      (
        completed /
        IMPORTANT_VIP_TOTAL
      ) * 100
    );

  return {

    completed,

    total:
      IMPORTANT_VIP_TOTAL,

    percentage,

    remaining:
      IMPORTANT_VIP_TOTAL -
      completed

  };

}


/* =========================================================
   IMPORTANT VIP ESCAPE
========================================================= */

function escapeVIPHTML(value) {

  return String(value || "")
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   IMPORTANT VIP CSS
========================================================= */

function injectImportantVIPStyles() {

  if (
    document.getElementById(
      "importantVIPStyles"
    )
  ) {

    return;

  }

  const style =
    document.createElement(
      "style"
    );

  style.id =
    "importantVIPStyles";

  style.textContent = `

    .important-vip-wrapper {
      margin: 22px 0;
      padding: 0;
    }

    .important-vip-card {
      background: #ffffff;
      border: 1px solid #ebe7f4;
      border-radius: 22px;
      padding: 18px;
      box-shadow: 0 12px 35px rgba(49,36,105,.08);
    }

    .important-vip-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 15px;
    }

    .important-vip-title {
      margin: 0;
      font-size: 20px;
      font-weight: 800;
      color: #211d2d;
    }

    .important-vip-subtitle {
      margin: 5px 0 0;
      color: #777184;
      font-size: 13px;
      line-height: 1.5;
    }

    .important-vip-crown {
      width: 46px;
      height: 46px;
      border-radius: 15px;
      background: #fff4cf;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 23px;
      flex: 0 0 auto;
    }

    .important-vip-progress {
      height: 9px;
      background: #eeeaf7;
      border-radius: 999px;
      overflow: hidden;
      margin: 12px 0 8px;
    }

    .important-vip-progress-bar {
      height: 100%;
      width: 0%;
      background: linear-gradient(
        90deg,
        #6d4aff,
        #9a7cff
      );
      border-radius: 999px;
      transition: width .25s ease;
    }

    .important-vip-progress-text {
      font-size: 12px;
      color: #777184;
      margin-bottom: 15px;
    }

    .important-vip-search {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #ebe7f4;
      border-radius: 14px;
      padding: 12px 13px;
      outline: none;
      background: #faf9ff;
      color: #211d2d;
      font-size: 14px;
      margin-bottom: 14px;
    }

    .important-vip-search:focus {
      border-color: #6d4aff;
      background: #ffffff;
    }

    .important-vip-list {
      display: grid;
      gap: 10px;
    }

    .important-vip-item {
      border: 1px solid #ebe7f4;
      border-radius: 17px;
      padding: 13px;
      background: #ffffff;
    }

    .important-vip-item.pinned {
      border-color: #d6b03c;
      background: #fffdf4;
    }

    .important-vip-item.completed {
      background: #f5fff9;
      border-color: #bfe8d0;
    }

    .important-vip-item-top {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .important-vip-number {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: #eeeaff;
      color: #4f35c9;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 12px;
      flex: 0 0 auto;
    }

    .important-vip-item.completed
      .important-vip-number {
      background: #dff7e8;
      color: #16834c;
    }

    .important-vip-item-title {
      flex: 1;
      min-width: 0;
      font-weight: 800;
      color: #211d2d;
      font-size: 14px;
    }

    .important-vip-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 5px 8px;
      border-radius: 999px;
      background: #f1eef8;
      color: #777184;
      white-space: nowrap;
    }

    .important-vip-badge.done {
      background: #dff7e8;
      color: #16834c;
    }

    .important-vip-note {
      margin: 11px 0 0;
      color: #5d5668;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .important-vip-note.empty {
      color: #aaa3b3;
      font-style: italic;
    }

    .important-vip-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin-top: 11px;
    }

    .important-vip-actions button {
      border: 0;
      border-radius: 11px;
      padding: 9px 11px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      background: #f1eef8;
      color: #4f35c9;
    }

    .important-vip-actions button.primary {
      background: #6d4aff;
      color: #ffffff;
    }

    .important-vip-actions button.success {
      background: #dff7e8;
      color: #16834c;
    }

    .important-vip-actions button.gold {
      background: #fff1bd;
      color: #85620b;
    }

    .important-vip-editor {
      display: none;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #ebe7f4;
    }

    .important-vip-editor.open {
      display: block;
    }

    .important-vip-editor textarea {
      width: 100%;
      min-height: 105px;
      box-sizing: border-box;
      resize: vertical;
      border: 1px solid #ebe7f4;
      border-radius: 14px;
      padding: 12px;
      outline: none;
      font-family: inherit;
      font-size: 14px;
      line-height: 1.6;
      color: #211d2d;
      background: #faf9ff;
    }

    .important-vip-editor textarea:focus {
      border-color: #6d4aff;
      background: #ffffff;
    }

    .important-vip-editor-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    .important-vip-empty {
      text-align: center;
      padding: 24px 12px;
      color: #777184;
      font-size: 13px;
    }

    .important-vip-system-note {
      margin-top: 12px;
      padding: 10px 12px;
      border-radius: 12px;
      background: #f7f5ff;
      color: #777184;
      font-size: 11px;
      line-height: 1.5;
    }

    @media (max-width: 600px) {

      .important-vip-card {
        padding: 15px;
        border-radius: 19px;
      }

      .important-vip-header {
        align-items: center;
      }

      .important-vip-title {
        font-size: 18px;
      }

      .important-vip-actions button {
        flex: 1 1 auto;
      }

    }

  `;

  document.head.appendChild(
    style
  );

}


/* =========================================================
   IMPORTANT VIP SECTION CREATOR
========================================================= */

function ensureImportantVIPSection() {

  let section =
    document.getElementById(
      "importantVIPSection"
    );

  if (section) {

    return section;

  }

  const home =
    document.getElementById(
      "homeScreen"
    );

  if (!home) {

    return null;

  }

  section =
    document.createElement(
      "section"
    );

  section.id =
    "importantVIPSection";

  section.className =
    "important-vip-wrapper";

  section.innerHTML = `
    <div class="important-vip-card">

      <div class="important-vip-header">

        <div>

          <h2 class="important-vip-title">
            👑 Important VIP 21
          </h2>

          <p class="important-vip-subtitle">
            Your 21 most important points
          </p>

        </div>

        <div class="important-vip-crown">
          👑
        </div>

      </div>

      <div class="important-vip-progress">
        <div
          id="importantVIPProgressBar"
          class="important-vip-progress-bar"
        ></div>
      </div>

      <div
        id="importantVIPProgressText"
        class="important-vip-progress-text"
      >
        0 / 21 completed
      </div>

      <input
        id="importantVIPSearch"
        class="important-vip-search"
        type="search"
        placeholder="Search Important VIP..."
        autocomplete="off"
      >

      <div
        id="importantVIPList"
        class="important-vip-list"
      ></div>

      <div class="important-vip-system-note">
        Important VIP is part of the app system. VIP changes are runtime changes and are not saved to LocalStorage or Cloud.
      </div>

    </div>
  `;

  home.appendChild(
    section
  );

  const search =
    document.getElementById(
      "importantVIPSearch"
    );

  if (search) {

    search.addEventListener(
      "input",
      () => {

        renderImportantVIP();

      }
    );

  }

  return section;

}


/* =========================================================
   IMPORTANT VIP RENDER
========================================================= */

function renderImportantVIP() {

  if (!document.body) {

    return;

  }

  injectImportantVIPStyles();

  const section =
    ensureImportantVIPSection();

  if (!section) {

    return;

  }

  const list =
    document.getElementById(
      "importantVIPList"
    );

  const progressBar =
    document.getElementById(
      "importantVIPProgressBar"
    );

  const progressText =
    document.getElementById(
      "importantVIPProgressText"
    );

  if (!list) {

    return;

  }

  const search =
    document.getElementById(
      "importantVIPSearch"
    );

  const query =
    search
      ? search.value
          .trim()
          .toLowerCase()
      : "";

  let filtered =
    importantVIP.filter(
      item => {

        if (!query) {

          return true;

        }

        return (
          item.title
            .toLowerCase()
            .includes(query) ||
          item.note
            .toLowerCase()
            .includes(query)
        );

      }
    );

  filtered.sort(
    (a, b) => {

      if (
        a.pinned &&
        !b.pinned
      ) {

        return -1;

      }

      if (
        !a.pinned &&
        b.pinned
      ) {

        return 1;

      }

      return a.id - b.id;

    }
  );

  const progress =
    getImportantVIPProgress();

  if (progressBar) {

    progressBar.style.width =
      `${progress.percentage}%`;

  }

  if (progressText) {

    progressText.textContent =
      `${progress.completed} / ${progress.total} completed • ${progress.percentage}%`;

  }

  if (filtered.length === 0) {

    list.innerHTML = `
      <div class="important-vip-empty">
        No Important VIP found
      </div>
    `;

    return;

  }

  list.innerHTML =
    filtered.map(
      item => {

        const note =
          item.note
            ? escapeVIPHTML(
                item.note
              )
            : "No important point added yet";

        return `

          <div
            class="
              important-vip-item
              ${item.pinned ? "pinned" : ""}
              ${item.completed ? "completed" : ""}
            "
            data-vip-id="${item.id}"
          >

            <div class="important-vip-item-top">

              <div class="important-vip-number">
                ${String(item.id).padStart(2, "0")}
              </div>

              <div class="important-vip-item-title">
                ${escapeVIPHTML(item.title)}
              </div>

              <div
                class="
                  important-vip-badge
                  ${item.completed ? "done" : ""}
                "
              >
                ${
                  item.completed
                    ? "✓ Done"
                    : "Open"
                }
              </div>

            </div>

            <div
              class="
                important-vip-note
                ${item.note ? "" : "empty"}
              "
            >
              ${note}
            </div>

            <div class="important-vip-actions">

              <button
                type="button"
                class="primary"
                onclick="editImportantVIPUI(${item.id})"
              >
                ✏️ Edit
              </button>

              <button
                type="button"
                class="${
                  item.completed
                    ? ""
                    : "success"
                }"
                onclick="${
                  item.completed
                    ? `uncompleteImportantVIPUI(${item.id})`
                    : `completeImportantVIPUI(${item.id})`
                }"
              >
                ${
                  item.completed
                    ? "↩ Undo"
                    : "✓ Complete"
                }
              </button>

              <button
                type="button"
                class="${
                  item.pinned
                    ? "gold"
                    : ""
                }"
                onclick="toggleImportantVIPPin(${item.id})"
              >
                ${
                  item.pinned
                    ? "📌 Pinned"
                    : "📌 Pin"
                }
              </button>

            </div>

            <div
              id="vipEditor-${item.id}"
              class="important-vip-editor"
            >

              <textarea
                id="vipTextarea-${item.id}"
                placeholder="Write Teacher's important point..."
              >${escapeVIPHTML(item.note)}</textarea>

              <div class="important-vip-editor-actions">

                <button
                  type="button"
                  class="important-vip-actions button primary"
                  onclick="saveImportantVIPUI(${item.id})"
                >
                  Update
                </button>

                <button
                  type="button"
                  class="important-vip-actions button"
                  onclick="cancelImportantVIPUI(${item.id})"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        `;

      }
    ).join("");

}


/* =========================================================
   IMPORTANT VIP EDIT UI
========================================================= */

function editImportantVIPUI(id) {

  const editor =
    document.getElementById(
      `vipEditor-${id}`
    );

  if (!editor) {

    return;

  }

  document
    .querySelectorAll(
      ".important-vip-editor"
    )
    .forEach(
      element => {

        element.classList.remove(
          "open"
        );

      }
    );

  editor.classList.add(
    "open"
  );

  const textarea =
    document.getElementById(
      `vipTextarea-${id}`
    );

  if (textarea) {

    textarea.focus();

    try {

      textarea.setSelectionRange(
        textarea.value.length,
        textarea.value.length
      );

    } catch (error) {}

  }

}


/* =========================================================
   IMPORTANT VIP SAVE UI
========================================================= */

function saveImportantVIPUI(id) {

  const textarea =
    document.getElementById(
      `vipTextarea-${id}`
    );

  if (!textarea) {

    return;

  }

  updateImportantVIP(
    id,
    textarea.value
  );

}


/* =========================================================
   IMPORTANT VIP CANCEL UI
========================================================= */

function cancelImportantVIPUI(id) {

  const editor =
    document.getElementById(
      `vipEditor-${id}`
    );

  if (editor) {

    editor.classList.remove(
      "open"
    );

  }

}


/* =========================================================
   IMPORTANT VIP COMPLETE UI
========================================================= */

function completeImportantVIPUI(id) {

  completeImportantVIP(
    id
  );

}


/* =========================================================
   IMPORTANT VIP UNCOMPLETE UI
========================================================= */

function uncompleteImportantVIPUI(id) {

  uncompleteImportantVIP(
    id
  );

}


/* =========================================================
   IMPORTANT VIP SCROLL
========================================================= */

function openImportantVIPSystem() {

  const section =
    ensureImportantVIPSection();

  if (!section) {

    return;

  }

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


/* =========================================================
   IMPORTANT VIP RESET RUNTIME
========================================================= */

function resetImportantVIP() {

  importantVIP.forEach(
    item => {

      item.note = "";

      item.completed = false;

      item.pinned = false;

    }
  );

  renderImportantVIP();

}


/* =========================================================
   IMPORTANT VIP PUBLIC API
========================================================= */

window.ImportantVIP = {

  items:
    importantVIP,

  total:
    IMPORTANT_VIP_TOTAL,

  get:
    getImportantVIP,

  update:
    updateImportantVIP,

  complete:
    completeImportantVIP,

  uncomplete:
    uncompleteImportantVIP,

  pin:
    toggleImportantVIPPin,

  progress:
    getImportantVIPProgress,

  open:
    openImportantVIPSystem,

  reset:
    resetImportantVIP,

  render:
    renderImportantVIP

};


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

  saveData();

  updateHome();

  showScreen(
    "homeScreen"
  );

  /*
    Important VIP UI
    is created after the
    Home Screen exists
  */

  setTimeout(
    () => {

      injectImportantVIPStyles();

      ensureImportantVIPSection();

      renderImportantVIP();

    },
    0
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
