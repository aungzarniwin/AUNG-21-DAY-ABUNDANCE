const affirmations = [
ကျွန်ုပ်သည် ကာယကံ၊ ဝစီကံ၊ မနောကံ တို့ဖြင့် အမိအဖ ဆရာသမားတို့အပေါ်၌ သိ၍ဖြစ်စေ မသိ၍ဖြစ်စေ ပြစ်မှားထားမိပါက ခွင့်လွှတ်ပေးပါရန် တောင်းပန်အပ်ပါသည်။ ယနေ့မှစပြီး ကံများပွင့် ဉာဏ်များပွင့်ပြီး စီးပွားဥစ္စာများ တိုးပါစေသော်
972999 AC ကျွန်ုပ်သည် စိတ်ချမ်းသာပြီး ကြွယ်ဝချမ်းသာစေသော Abundance coach ma Thandar မိသားစုဝင်အဖြစ် ခံယူလိုက်ပါပြီ
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
အတင်းမပြောပါ။ စိတ်ထားကောင်းတယ်။ အမြဲကြိုးစားတယ်။ ဒါ့ကြောင့် ကြွယ်ဝချမ်းသာမှုတို့နဲ့ထိုက်တန်တဲ့သူ ဖြစ်နေပါပြီ
စိတ်တွေ အေးချမ်းနေပါပြီ
ပြည့်စုံကြွယ်ဝ လိုတရနေပါပြီ
972999 AC Abundance coach Ma Thandar မိသားစုဝင်ဖြစ်သောကြောင့် အမိ-အဖ-ဆရာသမားတွေနဲ့ အကျိုးရှိတဲ့ နေရာတွေကို များစွာ လှူဒါန်းနိုင်နေပါပြီ။ Thank you. Thank you. Thank you
];

let currentDay = Number(localStorage.getItem("currentDay")) || 1;
let currentSession = "morning";
let currentIndex = 0;

let completed = JSON.parse(
    localStorage.getItem("completed") || "{}"
);

function save() {
    localStorage.setItem("currentDay", currentDay);
    localStorage.setItem("completed", JSON.stringify(completed));
}

function openSession(type) {
    currentSession = type;
    currentIndex = 0;

    document.getElementById("homeScreen").classList.add("hidden");
    document.getElementById("completeScreen").classList.add("hidden");
    document.getElementById("sessionScreen").classList.remove("hidden");

    showAffirmation();
}

function showAffirmation() {
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
}

function markDone() {

    const key = currentDay + "-" + currentSession;

    if (!completed[key]) {
        completed[key] = [];
    }

    if (!completed[key].includes(currentIndex)) {
        completed[key].push(currentIndex);
    }

    save();

    if (currentIndex < 16) {
        currentIndex++;
        showAffirmation();
    } else {
        finishSession();
    }
}

function nextAffirmation() {

    if (currentIndex < 16) {
        currentIndex++;
        showAffirmation();
    }
}

function previousAffirmation() {

    if (currentIndex > 0) {
        currentIndex--;
        showAffirmation();
    }
}

function finishSession() {

    const key = currentDay + "-" + currentSession;

    completed[key] = [];

    for (let i = 0; i < 17; i++) {
        completed[key].push(i);
    }

    save();

    document.getElementById("sessionScreen")
        .classList.add("hidden");

    document.getElementById("completeScreen")
        .classList.remove("hidden");

    document.getElementById("completeTitle").textContent =
        currentSession === "morning"
        ? "☀️ Morning Complete!"
        : "🌙 Night Complete!";

    document.getElementById("completeMessage").textContent =
        "ဒီ Session ကို အောင်မြင်စွာ ပြီးဆုံးပါပြီ။";
}

function goHome() {

    document.getElementById("sessionScreen")
        .classList.add("hidden");

    document.getElementById("completeScreen")
        .classList.add("hidden");

    document.getElementById("homeScreen")
        .classList.remove("hidden");

    updateHome();
}

function resetAll() {

    if (confirm("အားလုံး Reset လုပ်မလား?")) {

        localStorage.clear();

        currentDay = 1;
        completed = {};

        updateHome();
        goHome();
    }
}

function updateHome() {

    document.getElementById("dayTitle").textContent =
        "Day " + currentDay;

    const morningKey =
        currentDay + "-morning";

    const nightKey =
        currentDay + "-night";

    const morningCount =
        completed[morningKey]
        ? completed[morningKey].length
        : 0;

    const nightCount =
        completed[nightKey]
        ? completed[nightKey].length
        : 0;

    document.getElementById("morningStatus").textContent =
        morningCount + " / 17 completed";

    document.getElementById("nightStatus").textContent =
        nightCount + " / 17 completed";

    let completedDays = 0;

    for (let d = 1; d <= 21; d++) {

        const m = completed[d + "-morning"];
        const n = completed[d + "-night"];

        if (
            m &&
            m.length === 17 &&
            n &&
            n.length === 17
        ) {
            completedDays++;
        }
    }

    document.getElementById("overallText").textContent =
        Math.round(completedDays / 21 * 100) +
        "% Completed";

    document.getElementById("overallProgress").style.width =
        (completedDays / 21 * 100) + "%";

    document.getElementById("streakNumber").textContent =
        completedDays;

    createDays();
}

function createDays() {

    const grid =
        document.getElementById("daysGrid");

    grid.innerHTML = "";

    for (let i = 1; i <= 21; i++) {

        const day = document.createElement("div");

        day.className = "day";

        day.textContent = "Day " + i;

        if (i === currentDay) {
            day.classList.add("active");
        }

        grid.appendChild(day);
    }
}

updateHome();
