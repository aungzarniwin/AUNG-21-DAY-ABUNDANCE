<!DOCTYPE html>
<html lang="my">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Aung 21-Day Abundance</title>

<style>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: Arial, "Noto Sans Myanmar", sans-serif;
    background: #f5f7fb;
    color: #222;
}

.container {
    max-width: 700px;
    margin: auto;
    padding: 20px;
}

header {
    background: linear-gradient(135deg,#6a5acd,#8a2be2);
    color: white;
    padding: 20px;
    border-radius: 0 0 25px 25px;
    text-align: center;
}

header h1 {
    margin: 0;
    font-size: 25px;
}

.card {
    background: white;
    border-radius: 18px;
    padding: 20px;
    margin: 15px 0;
    box-shadow: 0 5px 20px rgba(0,0,0,.08);
}

.hero {
    text-align: center;
    padding: 30px 20px;
}

.hero h2 {
    color: #6a5acd;
}

button {
    border: none;
    border-radius: 12px;
    padding: 14px 18px;
    font-size: 16px;
    cursor: pointer;
    margin: 5px;
}

.primary {
    background: #6a5acd;
    color: white;
}

.secondary {
    background: #eee;
    color: #333;
}

.success {
    background: #28a745;
    color: white;
}

.danger {
    background: #dc3545;
    color: white;
}

.progress {
    width: 100%;
    height: 12px;
    background: #eee;
    border-radius: 20px;
    overflow: hidden;
    margin: 10px 0;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg,#6a5acd,#8a2be2);
    width: 0%;
    transition: .3s;
}

.session-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.session {
    text-align: center;
    padding: 20px;
    background: #f8f8ff;
    border-radius: 15px;
}

.hidden {
    display: none !important;
}

.affirmation {
    font-size: 21px;
    line-height: 1.8;
    text-align: center;
    padding: 25px 15px;
    min-height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.number {
    text-align: center;
    color: #6a5acd;
    font-weight: bold;
}

.navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
}

.day-grid {
    display: grid;
    grid-template-columns: repeat(7,1fr);
    gap: 8px;
}

.day {
    padding: 10px 3px;
    text-align: center;
    border-radius: 10px;
    background: #eee;
    font-size: 13px;
}

.day.active {
    background: #6a5acd;
    color: white;
}

.day.completed {
    background: #28a745;
    color: white;
}

.center {
    text-align: center;
}

.big {
    font-size: 45px;
}

@media(max-width:500px) {
    .container {
        padding: 12px;
    }

    .session-buttons {
        grid-template-columns: 1fr;
    }

    .affirmation {
        font-size: 18px;
    }

    button {
        width: 100%;
        margin: 5px 0;
    }

    .navigation {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
    }
}
</style>
</head>

<body>

<header>
    <h1>✨ Aung 21-Day Abundance ✨</h1>
    <div id="headerDay">Day 1</div>
</header>

<div class="container">

<!-- HOME -->
<section id="home">

    <div class="card hero">
        <h2>21-Day Abundance Journey</h2>
        <p>နေ့စဉ် Morning & Night Affirmation ပြုလုပ်ပါ။</p>

        <h3>လက်ရှိ Day <span id="currentDay">1</span></h3>

        <div class="progress">
            <div class="progress-bar" id="overallProgress"></div>
        </div>

        <p id="progressText">0 / 21 Days Completed</p>
    </div>

    <div class="card">
        <h3>🌅 Daily Practice</h3>

        <div class="session-buttons">

            <div class="session">
                <h3>🌅 Morning</h3>
                <p>မနက်ပိုင်း Affirmation</p>
                <button class="primary" onclick="startSession('morning')">
                    Start Morning
                </button>
            </div>

            <div class="session">
                <h3>🌙 Night</h3>
                <p>ညပိုင်း Affirmation</p>
                <button class="primary" onclick="startSession('night')">
                    Start Night
                </button>
            </div>

        </div>
    </div>

    <div class="card center">
        <div class="big">🔥</div>
        <h2><span id="streak">0</span> Day Streak</h2>
        <p>နေ့စဉ်ဆက်တိုက် လုပ်ဆောင်ပါ။</p>
    </div>

    <div class="card">
        <h3>📅 21 Days</h3>
        <div class="day-grid" id="dayGrid"></div>
    </div>

    <div class="card center">
        <button class="danger" onclick="resetApp()">
            Reset Progress
        </button>
    </div>

</section>


<!-- SESSION -->
<section id="session" class="hidden">

    <div class="card">

        <button class="secondary" onclick="goHome()">
            ← Home
        </button>

        <div class="center">
            <h2 id="sessionTitle">Morning</h2>
            <p>Day <span id="sessionDay">1</span></p>
        </div>

        <div class="progress">
            <div class="progress-bar" id="sessionProgress"></div>
        </div>

        <p class="number">
            Affirmation <span id="affirmationNumber">1</span> / 17
        </p>

        <div class="affirmation" id="affirmationText"></div>

        <div class="center">
            <button class="success" onclick="markDone()">
                ✓ ဖတ်ပြီးပါပြီ
            </button>
        </div>

        <div class="navigation">
            <button class="secondary" onclick="previousAffirmation()">
                ← Previous
            </button>

            <button class="primary" onclick="nextAffirmation()">
                Next →
            </button>
        </div>

    </div>

</section>


<!-- COMPLETE -->
<section id="complete" class="hidden">

    <div class="card center">

        <div class="big">🎉</div>

        <h2 id="completeTitle">
            Session Complete!
        </h2>

        <p id="completeText">
            ဒီနေ့အတွက် အောင်မြင်စွာ ပြီးဆုံးပါပြီ။
        </p>

        <button class="primary" onclick="goHome()">
            ← Home
        </button>

        <button id="nextSessionButton"
                class="success"
                onclick="startNextSession()">
            Next Session →
        </button>

    </div>

</section>

</div>


<script>

const affirmations = [

"ကျွနုပ်သည် ကာယကံ၊ ဝစီကံ၊ မနောကံ တို့ဖြင့် အမိအဖ ဆရာသမားတို့အပေါ်၌ သိ၍ဖြစ်စေ မသိ၍ဖြစ်စေ ပြစ်မှားထားမိပါက ခွင့်လွှတ်ပေးပါရန် တောင်းပန်အပ်ပါသည်။ ယနေ့မှစပြီး ကံများပွင့် ဉာဏ်များပွင့်ပြီး စီးပွားဥစ္စာများ တိုးပါစေသော်။",

"972999 AC ကျွနုပ်သည် စိတ်ချမ်းသာပြီး ကြွယ်ဝချမ်းသာစေသော Abundance coach ma Thandar မိသားစုဝင်အဖြစ် ခံယူလိုက်ပါပြီ။",

"972999 AC Abundance coach Ma Thandar မိသားစုဝင် ဖြစ်သောကြောင့် စိတ်ချမ်းသာပြီး အန္တရာယ်များကင်းနေပါပြီ။",

"နေ့စဉ်စိတ်တွေ အေးချမ်းပြီး ကျန်းမာလှပနေပါပြီ။",

"ငွေရှာရတာ အရမ်းလွယ်ကူနေပါပြီ။",

"ကြွယ်ဝချမ်းသာမှုတို့ကို လွယ်ကူစွာ ညှို့ယူနိုင်ပါပြီ။",

"972999 AC Abundance coach Ma Thandar မိသားစုဝင်ဖြစ်သောကြောင့် အပေါဆုံးက ငွေဖြစ်နေပါပြီ။",

"972999 AC Abundance coach Ma Thandar မိသားစုဝင်ဖြစ်သောကြောင့် အပေါဆုံးက စိန်ရွှေရတနာ ဖြစ်နေပါပြီ။",

"သုံးလိုက်သမျှ ငွေ ပိုက်ဆံတိုင်းက ဆပွားတိုးပြီး ပြန်လာကြရသည်။",

"ငွေတွေက မျှော်မှန်းထားတဲ့နေရာကရော မမျှော်မှန်းထားတဲ့နေရာကရော အလုံးလိုက် အလိပ်လိုက် ဝင်လာနေပါပြီ။",

"အလုပ်တွေလုပ်ရတာ အရမ်းလွယ်ကူလာပါပြီ။",

"ဝင်ငွေတွေ တစ်နေ့တစ်ခြား များသည်ထက် များလာနေပါပြီ။",

"ဘာလေးပဲ လိုချင်လိုချင် လွယ်လွယ်ကူကူနဲ့ ရတဲ့သူ ဖြစ်နေပါပြီ။",

"အတင်းမပြောပါ။ စိတ်ထားကောင်းတယ်။ အမြဲကြိုးစားတယ်။ ဒါ့ကြောင့် ကြွယ်ဝချမ်းသာမှုတို့နဲ့ထိုက်တန်တဲ့သူ ဖြစ်နေပါပြီ။",

"စိတ်တွေ အေးချမ်းနေပါပြီ။",

"ပြည့်စုံကြွယ်ဝ လိုတရနေပါပြီ။",

"972999 AC Abundance coach Ma Thandar မိသားစုဝင်ဖြစ်သောကြောင့် အမိ-အဖ-ဆရာသမားတွေနဲ့ အကျိုးရှိတဲ့ နေရာတွေကို များစွာ လှူဒါန်းနိုင်နေပါပြီ။ Thank you. Thank you. Thank you."

];


let data = JSON.parse(
    localStorage.getItem("aung21abundance")
) || {
    currentDay: 1,
    completedDays: [],
    sessions: {}
};


let currentSession = "morning";
let currentAffirmation = 0;


function saveData() {
    localStorage.setItem(
        "aung21abundance",
        JSON.stringify(data)
    );
}


function show(id) {

    document.getElementById("home")
        .classList.add("hidden");

    document.getElementById("session")
        .classList.add("hidden");

    document.getElementById("complete")
        .classList.add("hidden");

    document.getElementById(id)
        .classList.remove("hidden");
}


function startSession(type) {

    currentSession = type;
    currentAffirmation = 0;

    show("session");

    renderSession();
}


function renderSession() {

    const day = data.currentDay;

    document.getElementById("sessionDay")
        .textContent = day;

    document.getElementById("headerDay")
        .textContent = "Day " + day;

    document.getElementById("sessionTitle")
        .textContent =
        currentSession === "morning"
        ? "🌅 Morning"
        : "🌙 Night";

    document.getElementById("affirmationText")
        .textContent =
        affirmations[currentAffirmation];

    document.getElementById("affirmationNumber")
        .textContent =
        currentAffirmation + 1;

    const percent =
        ((currentAffirmation + 1) /
        affirmations.length) * 100;

    document.getElementById("sessionProgress")
        .style.width = percent + "%";
}


function nextAffirmation() {

    if (currentAffirmation <
        affirmations.length - 1) {

        currentAffirmation++;

        renderSession();

    } else {

        finishSession();
    }
}


function previousAffirmation() {

    if (currentAffirmation > 0) {

        currentAffirmation--;

        renderSession();
    }
}


function markDone() {

    const key =
        data.currentDay + "_" + currentSession;

    if (!data.sessions[key]) {
        data.sessions[key] = [];
    }

    if (!data.sessions[key].includes(currentAffirmation)) {

        data.sessions[key].push(currentAffirmation);
    }

    saveData();

    if (currentAffirmation <
        affirmations.length - 1) {

        currentAffirmation++;

        renderSession();

    } else {

        finishSession();
    }
}


function finishSession() {

    const key =
        data.currentDay + "_" + currentSession;

    data.sessions[key] =
        affirmations.map((x,i) => i);

    saveData();

    show("complete");

    if (currentSession === "morning") {

        document.getElementById("completeTitle")
            .textContent =
            "🌅 Morning Complete!";

        document.getElementById("completeText")
            .textContent =
            "Morning Affirmation 17 ခု ပြီးပါပြီ။";

        document.getElementById("nextSessionButton")
            .style.display = "block";

        document.getElementById("nextSessionButton")
            .textContent =
            "🌙 Night ကိုစမယ်";

    } else {

        if (!data.completedDays.includes(data.currentDay)) {

            data.completedDays.push(data.currentDay);
        }

        saveData();

        document.getElementById("completeTitle")
            .textContent =
            "🎉 Day " + data.currentDay + " Complete!";

        document.getElementById("completeText")
            .textContent =
            "Morning + Night နှစ်ခုလုံး အောင်မြင်စွာ ပြီးပါပြီ။";

        if (data.currentDay < 21) {

            data.currentDay++;

            saveData();

            document.getElementById("nextSessionButton")
                .style.display = "block";

            document.getElementById("nextSessionButton")
                .textContent =
                "Day " + data.currentDay + " စမယ်";

        } else {

            document.getElementById("nextSessionButton")
                .style.display = "none";
        }
    }

    updateHome();
}


function startNextSession() {

    if (currentSession === "morning") {

        startSession("night");

    } else {

        startSession("morning");
    }
}


function goHome() {

    show("home");

    updateHome();
}


function updateHome() {

    document.getElementById("currentDay")
        .textContent = data.currentDay;

    document.getElementById("headerDay")
        .textContent =
        "Day " + data.currentDay;

    const completed =
        data.completedDays.length;

    const percent =
        (completed / 21) * 100;

    document.getElementById("overallProgress")
        .style.width = percent + "%";

    document.getElementById("progressText")
        .textContent =
        completed + " / 21 Days Completed";

    document.getElementById("streak")
        .textContent = calculateStreak();

    createDays();
}


function createDays() {

    const grid =
        document.getElementById("dayGrid");

    grid.innerHTML = "";

    for (let i = 1; i <= 21; i++) {

        const div =
            document.createElement("div");

        div.className = "day";

        div.textContent = i;

        if (i === data.currentDay) {
            div.classList.add("active");
        }

        if (data.completedDays.includes(i)) {
            div.classList.add("completed");
        }

        grid.appendChild(div);
    }
}


function calculateStreak() {

    let streak = 0;

    for (let i = 1; i <= 21; i++) {

        if (data.completedDays.includes(i)) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}


function resetApp() {

    if (confirm(
        "Progress အားလုံးကို Reset လုပ်မှာ သေချာပါသလား?"
    )) {

        localStorage.removeItem(
            "aung21abundance"
        );

        data = {
            currentDay: 1,
            completedDays: [],
            sessions: {}
        };

        updateHome();
        show("home");
    }
}


updateHome();

</script>

</body>
</html>
