```javascript
/* =========================================
   AUNG 21-DAY ABUNDANCE APP
   ========================================= */


/* ===============================
   AFFIRMATIONS
   =============================== */

const affirmations = [

  ကျွန်ုပ်သည် ကာယကံ၊ ဝစီကံ၊ မနောကံ တို့ဖြင့် အမိအဖ ဆရာသမားတို့အပေါ်၌ သိ၍ဖြစ်စေ မသိ၍ဖြစ်စေ ပြစ်မှားထားမိပါက ခွင့်လွှတ်ပေးပါရန် တောင်းပန်အပ်ပါသည်။ ယနေ့မှစပြီး ကံများပွင့် ဉာဏ်များပွင့်ပြီး စီးပွားဥစ္စာများ တိုးပါစေသော်။",

  972999 AC ကျွနုပ်သည် စိတ်ချမ်းသာပြီး ကြွယ်ဝချမ်းသာစေသော Abundance coach ma Thandar မိသားစုဝင်အဖြစ် ခံယူလိုက်ပါပြီ

  972999 AC Abundance coach Ma Thandar မိသားစုဝင် ဖြစ်သောကြောင့် စိတ်ချမ်းသာပြီး အန္တရာယ်များကင်းနေပါပြီ

  နေ့စဉ်စိတ်တွေ အေးချမ်းပြီး ကျန်းမာလှပနေပါပြီ

  ငွေရှာရတာ အရမ်းလွယ်ကူနေပါပြီ

  ကြွယ်ဝချမ်းသာမှုတို့ကို လွယ်ကူစွာ ညှို့ယူနိုင်ပါပြီ

  972999 AC Abundance coach Ma Thandar မိသားစုဝင်ဖြစ်သောကြောင့် အပေါဆုံးက ငွေဖြစ်နေပါပြီ

  972999 AC Abundance coach Ma Thandar မိသားစုဝင်ဖြစ်သောကြောင့် အပေါဆုံးက စိန်ရွှေရတနာ ဖြစ်နေပါပြီ

  သုံးလိုက်သမျှ ငွေ ပိုက်ဆံတိုင်းက ဆပွားတိုးပြီး ပြန်လာကြရသည်

  ငွေတွေက မျှော်မှန်းထားတဲ့နေရာကရော မမျှော်မှန်းထားတဲ့နေရာကရော အလုံးလိုက် အလိပ်လိုက် ဝင်လာနေပါပြီ

  အလုပ်တွေလုပ်ရတာ အရမ်းလွယ်ကူလာပါပြီ

  ဝင်ငွေတွေ တစ်နေ့တစ်ခြား များသည်ထက် များလာနေပါပြီ

  ဘာလေးပဲ လိုချင်လိုချင် လွယ်လွယ်ကူကူနဲ့ ရတဲ့သူ ဖြစ်နေပါပြီ

  အတင်းမပြောပါ။ စိတ်ထားကောင်းတယ်။ အမြဲကြိုးစားတယ်။ ဒါ့ကြောင့် ကြွယ်ဝချမ်းသာမှုတို့နဲ့ ထိုက်တန်တဲ့သူ ဖြစ်နေပါပြီ။

  စိတ်တွေ အေးချမ်းနေပါပြီ

  ပြည့်စုံကြွယ်ဝ လိုတရနေပါပြီ

  972999 AC Abundance coach Ma Thandar မိသားစုဝင်ဖြစ်သောကြောင့် အမိ-အဖ-ဆရာသမားတွေနဲ့ အကျိုးရှိတဲ့ နေရာတွေကို များစွာ လှူဒါန်းနိုင်နေပါပြီ။ Thank you. Thank you. Thank you.

];


/* ===============================
   APP STATE
   =============================== */

let currentDay = 1;

let currentSession = "morning";

let currentIndex = 0;


/* ===============================
   STORAGE
   =============================== */

const STORAGE_KEY = "aung21dayAbundance";


function loadData() {

  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {

    return JSON.parse(saved);

  }

  return {

    currentDay: 1,

    completed: {},

    lastCompletedDate: null,

    streak: 0

  };

}


let data = loadData();


function saveData() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );

}


/* ===============================
   COMPLETION KEY
   =============================== */

function completionKey(day, session, index) {

  return `${day}-${session}-${index}`;

}


function isCompleted(day, session, index) {

  return !!data.completed[
    completionKey(day, session, index)
  ];

}


function sessionCompletedCount(day, session) {

  let count = 0;

  for (let i = 0; i < affirmations.length; i++) {

    if (isCompleted(day, session, i)) {

      count++;

    }

  }

  return count;

}


function isSessionComplete(day, session) {

  return sessionCompletedCount(day, session)
    === affirmations.length;

}


function isDayComplete(day) {

  return (
    isSessionComplete(day, "morning") &&
    isSessionComplete(day, "night")
  );

}


/* ===============================
   HOME SCREEN
   =============================== */

function updateHome() {

  document.getElementById("dayTitle").textContent =
    `Day ${data.currentDay}`;


  const morningCount =
    sessionCompletedCount(
      data.currentDay,
      "morning"
    );


  const nightCount =
    sessionCompletedCount(
      data.currentDay,
      "night"
    );


  document.getElementById("morningStatus")
    .textContent =
    `${morningCount} / ${affirmations.length} completed`;


  document.getElementById("nightStatus")
    .textContent =
    `${nightCount} / ${affirmations.length} completed`;


  const totalCompleted =
    Object.keys(data.completed).length;


  const total =
    21 * 2 * affirmations.length;


  const percentage =
    Math.round(
      (totalCompleted / total) * 100
    );


  document.getElementById("overallProgress")
    .style.width =
    `${percentage}%`;


  document.getElementById("overallText")
    .textContent =
    `${percentage}% Completed`;


  document.getElementById("streakNumber")
    .textContent =
    data.streak;


  updateDays();

}


/* ===============================
   DAYS
   =============================== */

function updateDays() {

  const grid =
    document.getElementById("daysGrid");

  grid.innerHTML = "";


  for (let day = 1; day <= 21; day++) {

    const button =
      document.createElement("button");


    button.className = "day-box";

    button.textContent = day;


    if (isDayComplete(day)) {

      button.classList.add("completed");

    }


    if (day === data.currentDay) {

      button.classList.add("current");

    }


    /*
       Allow user to open any day.
    */

    button.onclick = () => {

      data.currentDay = day;

      saveData();

      updateHome();

    };


    grid.appendChild(button);

  }

}


/* ===============================
   OPEN SESSION
   =============================== */

function openSession(session) {

  currentSession = session;

  currentIndex = findFirstIncomplete(
    data.currentDay,
    session
  );


  document.getElementById("homeScreen")
    .classList.add("hidden");

  document.getElementById("sessionScreen")
    .classList.remove("hidden");

  document.getElementById("completeScreen")
    .classList.add("hidden");


  renderAffirmation();

}


/* ===============================
   FIND FIRST INCOMPLETE
   =============================== */

function findFirstIncomplete(day, session) {

  for (
    let i = 0;
    i < affirmations.length;
    i++
  ) {

    if (!isCompleted(day, session, i)) {

      return i;

    }

  }

  return affirmations.length - 1;

}


/* ===============================
   RENDER AFFIRMATION
   =============================== */

function renderAffirmation() {

  document.getElementById("sessionDay")
    .textContent =
    `Day ${data.currentDay}`;


  document.getElementById("sessionType")
    .textContent =
    currentSession === "morning"
      ? "☀️ Morning"
      : "🌙 Night";


  document.getElementById("affirmationNumber")
    .textContent =
    currentIndex + 1;


  document.getElementById("affirmationText")
    .textContent =
    affirmations[currentIndex];


  const done =
    isCompleted(
      data.currentDay,
      currentSession,
      currentIndex
    );


  const button =
    document.getElementById("doneButton");


  if (done) {

    button.textContent =
      "✓ ဖတ်ပြီးပါပြီ";

    button.classList.add("completed");

  } else {

    button.textContent =
      "✓ ဖတ်ပြီးပါပြီ";

    button.classList.remove("completed");

  }


  updateSessionProgress();

}


/* ===============================
   SESSION PROGRESS
   =============================== */

function updateSessionProgress() {

  const count =
    sessionCompletedCount(
      data.currentDay,
      currentSession
    );


  const percentage =
    Math.round(
      (count / affirmations.length) * 100
    );


  document.getElementById("sessionProgress")
    .style.width =
    `${percentage}%`;


  document.getElementById("sessionProgressText")
    .textContent =
    `${count} / ${affirmations.length}`;

}


/* ===============================
   MARK DONE
   =============================== */

function markDone() {

  data.completed[
    completionKey(
      data.currentDay,
      currentSession,
      currentIndex
    )
  ] = true;


  saveData();

  updateSessionProgress();


  document.getElementById("doneButton")
    .classList.add("completed");


  /*
     Automatically move to next
     affirmation after short delay.
  */

  setTimeout(() => {

    if (
      currentIndex <
      affirmations.length - 1
    ) {

      currentIndex++;

      renderAffirmation();

    } else {

      finishSession();

    }

  }, 300);

}


/* ===============================
   NEXT
   =============================== */

function nextAffirmation() {

  if (
    currentIndex <
    affirmations.length - 1
  ) {

    currentIndex++;

    renderAffirmation();

  }

}


/* ===============================
   PREVIOUS
   =============================== */

function previousAffirmation() {

  if (currentIndex > 0) {

    currentIndex--;

    renderAffirmation();

  }

}


/* ===============================
   FINISH SESSION
   =============================== */

function finishSession() {

  saveData();


  if (
    currentSession === "morning" &&
    isSessionComplete(
      data.currentDay,
      "morning"
    )
  ) {

    /*
       Morning finished.
       User can continue with Night.
    */

    document.getElementById("affirmationText")
      .textContent =
      "☀️ Morning Practice Complete!\n\n🌙 Night Practice ကို ဆက်လုပ်နိုင်ပါပြီ။";


    document.getElementById("doneButton")
      .textContent =
      "🌙 Start Night";


    document.getElementById("doneButton")
      .onclick =
      () => openSession("night");


    return;

  }


  if (
    currentSession === "night" &&
    isSessionComplete(
      data.currentDay,
      "night"
    )
  ) {

    completeDay();

  }

}


/* ===============================
   COMPLETE DAY
   =============================== */

function completeDay() {

  updateStreak();


  /*
     Move to next day automatically
  */

  if (data.currentDay < 21) {

    data.currentDay++;

  }


  saveData();


  document.getElementById("sessionScreen")
    .classList.add("hidden");

  document.getElementById("completeScreen")
    .classList.remove("hidden");


  if (data.currentDay === 1) {

    document.getElementById("completeTitle")
      .textContent =
      "🎉 21 Days Complete!";

  } else {

    document.getElementById("completeTitle")
      .textContent =
      "🎉 Day Complete!";

  }


  document.getElementById("completeMessage")
    .textContent =
    "Morning + Night practice ပြီးဆုံးပါပြီ။ မနက်ဖြန်ကို ဆက်လက်လုပ်ဆောင်ပါ။";

}


/* ===============================
   STREAK
   =============================== */

function getToday() {

  const date = new Date();

  return date.toISOString()
    .split("T")[0];

}


function updateStreak() {

  const today = getToday();


  if (data.lastCompletedDate === today) {

    return;

  }


  if (!data.lastCompletedDate) {

    data.streak = 1;

  } else {

    const previous =
      new Date(data.lastCompletedDate);

    const current =
      new Date(today);


    const difference =
      Math.round(
        (
          current - previous
        ) /
        (1000 * 60 * 60 * 24)
      );


    if (difference === 1) {

      data.streak++;

    } else {

      data.streak = 1;

    }

  }


  data.lastCompletedDate = today;

}


/* ===============================
   GO HOME
   =============================== */

function goHome() {

  document.getElementById("sessionScreen")
    .classList.add("hidden");

  document.getElementById("completeScreen")
    .classList.add("hidden");

  document.getElementById("homeScreen")
    .classList.remove("hidden");


  /*
     Restore normal button
  */

  const button =
    document.getElementById("doneButton");

  button.onclick = markDone;


  updateHome();

}


/* ===============================
   RESET
   =============================== */

function resetAll() {

  const answer =
    confirm(
      "21-Day progress အားလုံးကို ဖျက်မလား?"
    );


  if (!answer) {

    return;

  }


  localStorage.removeItem(
    STORAGE_KEY
  );


  data = loadData();

  currentDay = 1;

  currentSession = "morning";

  currentIndex = 0;


  goHome();

}


/* ===============================
   START
   =============================== */

updateHome();
```
