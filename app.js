```javascript
const affirmations = [
  ကျွန်ုပ်သည် ကာယကံ၊ ဝစီကံ၊ မနောကံ တို့ဖြင့် အမိအဖ ဆရာသမားတို့အပေါ်၌ သိ၍ဖြစ်စေ မသိ၍ဖြစ်စေ ပြစ်မှားထားမိပါက ခွင့်လွှတ်ပေးပါရန် တောင်းပန်အပ်ပါသည်။ ယနေ့မှစပြီး ကံများပွင့် ဉာဏ်များပွင့်ပြီး စီးပွားဥစ္စာများ တိုးပါစေသော်
  972999 AC ကျွန်ုပ်သည် စိတ်ချမ်းသာပြီး ကြွယ်ဝချမ်းသာစေသော Abundance coach ma Thandar မိသားစုဝင်အဖြစ် ခံယူလိုက်ပါပြီ
  972999 AC Abundance coach Ma Thandar မိသားစုဝင် ဖြစ်သောကြောင့် စိတ်ချမ်းသာပြီး အန္တရာယ်များကင်းနေပါပြီ
  နေ့စဉ်စိတ်တွေ အေးချမ်းပြီး ကျန်းမာလှပနေပါပြီ
  ငွေရှာရတာ အရမ်းလွယ်ကူနေပါပြီ
  ကြွယ်ဝချမ်းသာမှုတို့ကို လွယ်ကူစွာ ညှို့ယူနိုင်ပါပြီ
  972999 AC Abundance coach Ma Thandar မိသားစုဝင်ဖြစ်သောကြောင့် အပေါဆုံးက ငွေဖြစ်နေပါပြီ
  972999 AC Abundance coach Ma Thandar မိသားစုဝင်ဖြစ်သောကြောင့် အပေါဆုံးက စိန်ရွှေရတနာ ဖြစ်နေပါပြီ
  သုံးလိုက်သမျှ ငွေ ပိုက်ဆံတိုင်းက ဆပွားတိုးပြီး ပြန်လာကြရသည်။",
  ငွေတွေက မျှော်မှန်းထားတဲ့နေရာကရော မမျှော်မှန်းထားတဲ့နေရာကရော အလုံးလိုက် အလိပ်လိုက် ဝင်လာနေပါပြီ
  အလုပ်တွေလုပ်ရတာ အရမ်းလွယ်ကူလာပါပြီ
  ဝင်ငွေတွေ တစ်နေ့တစ်ခြား များသည်ထက် များလာနေပါပြီ
  ဘာလေးပဲ လိုချင်လိုချင် လွယ်လွယ်ကူကူနဲ့ ရတဲ့သူ ဖြစ်နေပါပြီ
  အတင်းမပြောပါ။ စိတ်ထားကောင်းတယ်။ အမြဲကြိုးစားတယ်။ ဒါ့ကြောင့် ကြွယ်ဝချမ်းသာမှုတို့နဲ့ထိုက်တန်တဲ့သူ ဖြစ်နေပါပြီ
  စိတ်တွေ အေးချမ်းနေပါပြီ
  ပြည့်စုံကြွယ်ဝ လိုတရနေပါပြီ
  972999 AC Abundance coach Ma Thandar မိသားစုဝင်ဖြစ်သောကြောင့် အမိ-အဖ-ဆရာသမားတွေနဲ့ အကျိုးရှိတဲ့ နေရာတွေကို များစွာ လှူဒါန်းနိုင်နေပါပြီ။ Thank you. Thank you. Thank you.
];

const STORAGE_KEY = "aung_21_day_abundance_v2";

let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  currentDay: 1,
  completed: {},
  streak: 0,
  lastDate: null
};

let currentSession = "morning";
let currentIndex = 0;


/* ---------- SAVE ---------- */

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}


/* ---------- KEY ---------- */

function getKey(day, session, index) {
  return `${day}_${session}_${index}`;
}


/* ---------- CHECK ---------- */

function isDone(day, session, index) {
  return data.completed[getKey(day, session, index)] === true;
}


/* ---------- COUNT ---------- */

function getCount(day, session) {
  let count = 0;

  for (let i = 0; i < affirmations.length; i++) {
    if (isDone(day, session, i)) {
      count++;
    }
  }

  return count;
}


/* ---------- SESSION COMPLETE ---------- */

function sessionComplete(day, session) {
  return getCount(day, session) === affirmations.length;
}


/* ---------- DAY COMPLETE ---------- */

function dayComplete(day) {
  return (
    sessionComplete(day, "morning") &&
    sessionComplete(day, "night")
  );
}


/* ---------- HOME ---------- */

function updateHome() {

  const day = data.currentDay;

  document.getElementById("dayTitle").textContent =
    "Day " + day;

  const morning =
    getCount(day, "morning");

  const night =
    getCount(day, "night");

  document.getElementById("morningStatus").textContent =
    morning + " / " + affirmations.length + " completed";

  document.getElementById("nightStatus").textContent =
    night + " / " + affirmations.length + " completed";


  const totalDone =
    Object.keys(data.completed).length;

  const total =
    21 * 2 * affirmations.length;

  const percent =
    Math.round((totalDone / total) * 100);

  document.getElementById("overallProgress").style.width =
    percent + "%";

  document.getElementById("overallText").textContent =
    percent + "% Completed";

  document.getElementById("streakNumber").textContent =
    data.streak;

  createDays();
}


/* ---------- DAYS ---------- */

function createDays() {

  const grid =
    document.getElementById("daysGrid");

  grid.innerHTML = "";

  for (let day = 1; day <= 21; day++) {

    const button =
      document.createElement("button");

    button.className = "day-box";

    button.textContent = day;

    if (dayComplete(day)) {
      button.classList.add("completed");
    }

    if (day === data.currentDay) {
      button.classList.add("current");
    }

    button.addEventListener("click", function () {

      data.currentDay = day;

      save();

      updateHome();

    });

    grid.appendChild(button);
  }
}


/* ---------- OPEN SESSION ---------- */

function openSession(session) {

  currentSession = session;

  currentIndex =
    findFirstIncomplete(
      data.currentDay,
      session
    );

  document
    .getElementById("homeScreen")
    .classList.add("hidden");

  document
    .getElementById("completeScreen")
    .classList.add("hidden");

  document
    .getElementById("sessionScreen")
    .classList.remove("hidden");

  render();
}


/* ---------- FIND INCOMPLETE ---------- */

function findFirstIncomplete(day, session) {

  for (let i = 0; i < affirmations.length; i++) {

    if (!isDone(day, session, i)) {
      return i;
    }
  }

  return affirmations.length - 1;
}


/* ---------- RENDER ---------- */

function render() {

  document.getElementById("sessionDay").textContent =
    "Day " + data.currentDay;

  document.getElementById("sessionType").textContent =
    currentSession === "morning"
      ? "☀️ Morning"
      : "🌙 Night";

  document.getElementById("affirmationNumber").textContent =
    currentIndex + 1;

  document.getElementById("affirmationText").textContent =
    affirmations[currentIndex];


  const button =
    document.getElementById("doneButton");

  button.onclick = markDone;

  if (
    isDone(
      data.currentDay,
      currentSession,
      currentIndex
    )
  ) {

    button.classList.add("completed");

    button.textContent =
      "✓ ပြီးပါပြီ";

  } else {

    button.classList.remove("completed");

    button.textContent =
      "✓ ဖတ်ပြီးပါပြီ";
  }

  updateSessionProgress();
}


/* ---------- SESSION PROGRESS ---------- */

function updateSessionProgress() {

  const count =
    getCount(
      data.currentDay,
      currentSession
    );

  const percent =
    Math.round(
      (count / affirmations.length) * 100
    );

  document.getElementById("sessionProgress").style.width =
    percent + "%";

  document.getElementById("sessionProgressText").textContent =
    count + " / " + affirmations.length;
}


/* ---------- MARK DONE ---------- */

function markDone() {

  const key =
    getKey(
      data.currentDay,
      currentSession,
      currentIndex
    );

  data.completed[key] = true;

  save();

  document.getElementById("doneButton")
    .classList.add("completed");

  document.getElementById("doneButton")
    .textContent = "✓ ပြီးပါပြီ";

  updateSessionProgress();


  setTimeout(function () {

    if (
      currentIndex <
      affirmations.length - 1
    ) {

      currentIndex++;

      render();

    } else {

      finishSession();

    }

  }, 400);
}


/* ---------- NEXT ---------- */

function nextAffirmation() {

  if (
    currentIndex <
    affirmations.length - 1
  ) {

    currentIndex++;

    render();
  }
}


/* ---------- PREVIOUS ---------- */

function previousAffirmation() {

  if (currentIndex > 0) {

    currentIndex--;

    render();
  }
}


/* ---------- FINISH SESSION ---------- */

function finishSession() {

  save();

  if (currentSession === "morning") {

    document.getElementById("affirmationText").textContent =
      "☀️ Morning Practice Complete!\n\n🌙 Night Practice ကို ဆက်လုပ်ပါ။";

    document.getElementById("affirmationNumber").textContent =
      "✓";

    const button =
      document.getElementById("doneButton");

    button.textContent =
      "🌙 Start Night";

    button.onclick = function () {
      openSession("night");
    };

    return;
  }


  if (currentSession === "night") {

    completeToday();

  }
}


/* ---------- COMPLETE TODAY ---------- */

function completeToday() {

  updateStreak();

  save();

  document
    .getElementById("sessionScreen")
    .classList.add("hidden");

  document
    .getElementById("completeScreen")
    .classList.remove("hidden");

  if (data.currentDay >= 21) {

    document.getElementById("completeTitle")
      .textContent =
      "🏆 21 Days Complete!";

    document.getElementById("completeMessage")
      .textContent =
      "Congratulations! သင်၏ 21-Day Journey ပြီးဆုံးပါပြီ။";

  } else {

    document.getElementById("completeTitle")
      .textContent =
      "🎉 Day " + data.currentDay + " Complete!";

    document.getElementById("completeMessage")
      .textContent =
      "Morning + Night Practice ပြီးပါပြီ။ မနက်ဖြန် Day " +
      (data.currentDay + 1) +
      " ကို ဆက်လုပ်ပါ။";

    data.currentDay++;

    save();
  }
}


/* ---------- STREAK ---------- */

function updateStreak() {

  const today =
    new Date().toISOString().split("T")[0];

  if (data.lastDate === today) {
    return;
  }

  if (!data.lastDate) {

    data.streak = 1;

  } else {

    const last =
      new Date(data.lastDate);

    const now =
      new Date(today);

    const difference =
      Math.round(
        (now - last) /
        (1000 * 60 * 60 * 24)
      );

    if (difference === 1) {

      data.streak++;

    } else {

      data.streak = 1;

    }
  }

  data.lastDate = today;
}


/* ---------- HOME ---------- */

function goHome() {

  document
    .getElementById("sessionScreen")
    .classList.add("hidden");

  document
    .getElementById("completeScreen")
    .classList.add("hidden");

  document
    .getElementById("homeScreen")
    .classList.remove("hidden");

  updateHome();
}


/* ---------- RESET ---------- */

function resetAll() {

  const confirmReset =
    confirm(
      "21-Day progress အားလုံးကို ဖျက်မလား?"
    );

  if (!confirmReset) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);

  data = {
    currentDay: 1,
    completed: {},
    streak: 0,
    lastDate: null
  };

  currentSession = "morning";
  currentIndex = 0;

  goHome();
}


/* ---------- START APP ---------- */

document.addEventListener(
  "DOMContentLoaded",
  function () {
    updateHome();
  }
);
```
