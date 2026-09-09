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

let currentDay = Number(localStorage.getItem("currentDay")) || 1;
let currentSession = "morning";
let currentIndex = 0;

let completed = JSON.parse(
localStorage.getItem("completed") || "{}"
);

// ===============================
// SAVE DATA
// ===============================

function save() {
localStorage.setItem("currentDay", currentDay);
localStorage.setItem(
"completed",
JSON.stringify(completed)
);
}

// ===============================
// OPEN SESSION
// ===============================

function openSession(type) {

```
currentSession = type;
currentIndex = 0;

document
    .getElementById("homeScreen")
    .classList.add("hidden");

document
    .getElementById("completeScreen")
    .classList.add("hidden");

document
    .getElementById("sessionScreen")
    .classList.remove("hidden");

showAffirmation();
```

}

// ===============================
// SHOW AFFIRMATION
// ===============================

function showAffirmation() {

```
document.getElementById("sessionDay").textContent =
    "Day " + currentDay;

document.getElementById("sessionType").textContent =
    currentSession === "morning"
        ? "☀️ Morning"
        : "🌙 Night";

document.getElementById("affirmationNumber").textContent =
    currentIndex + 1;

document.getElementById("affirmationText").textContent =
    affirmations[currentIndex];

document.getElementById("sessionProgressText").textContent =
    (currentIndex + 1) + " / 17";

document.getElementById("sessionProgress").style.width =
    ((currentIndex + 1) / 17 * 100) + "%";
```

}

// ===============================
// MARK AFFIRMATION DONE
// ===============================

function markDone() {

```
const key =
    currentDay + "-" + currentSession;

if (!completed[key]) {
    completed[key] = [];
}

if (!completed[key].includes(currentIndex)) {

    completed[key].push(currentIndex);

}

save();


// Next affirmation
if (currentIndex < 16) {

    currentIndex++;

    showAffirmation();

} else {

    finishSession();

}
```

}

// ===============================
// NEXT
// ===============================

function nextAffirmation() {

```
if (currentIndex < 16) {

    currentIndex++;

    showAffirmation();

}
```

}

// ===============================
// PREVIOUS
// ===============================

function previousAffirmation() {

```
if (currentIndex > 0) {

    currentIndex--;

    showAffirmation();

}
```

}

// ===============================
// CHECK DAY COMPLETE
// ===============================

function isDayComplete(day) {

```
const morning =
    completed[day + "-morning"];

const night =
    completed[day + "-night"];

return (
    morning &&
    morning.length === 17 &&
    night &&
    night.length === 17
);
```

}

// ===============================
// CALCULATE STREAK
// ===============================

function calculateStreak() {

```
let streak = 0;

for (let d = 1; d <= 21; d++) {

    if (isDayComplete(d)) {

        streak++;

    } else {

        break;

    }
}

return streak;
```

}

// ===============================
// FINISH SESSION
// ===============================

function finishSession() {

```
const key =
    currentDay + "-" + currentSession;


// Mark all 17 complete
completed[key] = [];

for (let i = 0; i < 17; i++) {

    completed[key].push(i);

}

save();


// Hide session
document
    .getElementById("sessionScreen")
    .classList.add("hidden");


// Show complete screen
document
    .getElementById("completeScreen")
    .classList.remove("hidden");


// Morning complete
if (currentSession === "morning") {

    document.getElementById("completeTitle").textContent =
        "☀️ Morning Complete!";

    document.getElementById("completeMessage").textContent =
        "Morning Session ပြီးပါပြီ။ ယနေ့ Night Session ကို ဆက်လုပ်ပါ။";

    return;
}


// Night complete
if (currentSession === "night") {

    const streak =
        calculateStreak();


    // Day 21 complete
    if (currentDay === 21) {

        document.getElementById("completeTitle").textContent =
            "🏆 21-Day Journey Complete!";

        document.getElementById("completeMessage").textContent =
            "ဂုဏ်ယူပါတယ်! 21 ရက်လုံး Morning + Night ကို ပြီးမြောက်ခဲ့ပါပြီ။ 🔥 Streak: " +
            streak +
            " Days";

        return;
    }


    // Normal day complete
    document.getElementById("completeTitle").textContent =
        "🌙 Night Complete!";

    document.getElementById("completeMessage").textContent =
        "Day " +
        currentDay +
        " ပြီးပါပြီ! 🔥 Streak: " +
        streak +
        " Days";
}
```

}

// ===============================
// CONTINUE
// ===============================

function continueAfterComplete() {
    if (currentSession === "morning") {
        openSession("night");
        return;
    }

    if (currentSession === "night") {
        if (currentDay < 21) {
            currentDay++;
            currentSession = "morning";
            currentIndex = 0;
            save();
            goHome();
        } else {
            goHome();
        }
    }
}
