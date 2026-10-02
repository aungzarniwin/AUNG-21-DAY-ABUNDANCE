(function () {
  "use strict";

  /* =========================================================
     21-DAY ABUNDANCE
     COMPLETE APP.JS
     ========================================================= */

  const TOTAL_DAYS = 21;
  const TOTAL_AFFIRMATIONS = 17;

  const STORAGE_KEY = "aung21_abundance_v2";
  const OLD_COMPLETED_KEY = "completed";
  const VIP_STORAGE_KEY = "aung21_important_vip_v1";

  const SESSION_TYPES = ["morning", "night"];

  const VIP_CATEGORIES = [
    "Teacher",
    "Mindset",
    "Money",
    "Business",
    "Personal",
    "Other"
  ];

  let appData = null;

  let currentSession = {
    day: 1,
    type: "morning",
    affirmationIndex: 0
  };

  let importantVIPNotes = [];

  let vipEditingId = null;

  let previousBodyOverflow = "";

  let appInitialized = false;
  let vipInitialized = false;

  /* =========================================================
     AFFIRMATIONS
     ========================================================= */

  const affirmations = [
    "I am worthy of abundance, success, peace and happiness",
    "Money flows to me through valuable work, smart decisions and positive action",
    "I trust myself to create a better future",
    "I am becoming more confident every day",
    "I deserve to live a financially free and meaningful life",
    "I attract opportunities that help me grow",
    "I take consistent action toward my goals",
    "I am capable of learning, improving and succeeding",
    "I release fear and choose courage",
    "I manage money wisely and create increasing value",
    "I am grateful for everything I already have",
    "I welcome new ideas, opportunities and possibilities",
    "I believe that my actions today can change my future",
    "I choose progress over perfection",
    "I am building a life that reflects my true goals",
    "I am open to receiving abundance in many forms",
    "I am responsible for creating the future I want"
  ];

  /* =========================================================
     BASIC HELPERS
     ========================================================= */

  function $(id) {
    return document.getElementById(id);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function safeText(value) {
    return value == null ? "" : String(value);
  }

  function todayKey() {
    const d = new Date();

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${y}-${m}-${day}`;
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
  }

  function escapeHTML(value) {
    return safeText(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =========================================================
     JOURNAL
     ========================================================= */

  function createEmptyJournal() {
    return {
      intention: "",
      action: "",
      gratitude1: "",
      gratitude2: "",
      gratitude3: "",
      reflection: "",
      journal: ""
    };
  }

  /* =========================================================
     DEFAULT DATA
     ========================================================= */

  function createDefaultData() {
    const days = {};

    for (let i = 1; i <= TOTAL_DAYS; i++) {
      days[i] = {
        morning: {
          completed: false,
          completedAt: null
        },

        night: {
          completed: false,
          completedAt: null
        },

        journal: createEmptyJournal()
      };
    }

    return {
      version: 2,

      createdAt: nowISO(),

      lastActiveDate: todayKey(),

      activeDay: 1,

      days: days
    };
  }

  /* =========================================================
     DATA NORMALIZATION
     ========================================================= */

  function normalizeData(data) {
    const fresh = createDefaultData();

    if (!data || typeof data !== "object") {
      return fresh;
    }

    if (typeof data.activeDay === "number") {
      fresh.activeDay = clamp(
        Math.floor(data.activeDay),
        1,
        TOTAL_DAYS
      );
    }

    if (data.createdAt) {
      fresh.createdAt = data.createdAt;
    }

    if (data.lastActiveDate) {
      fresh.lastActiveDate = data.lastActiveDate;
    }

    if (data.days && typeof data.days === "object") {
      for (let i = 1; i <= TOTAL_DAYS; i++) {
        const source = data.days[i] || data.days[String(i)] || {};

        fresh.days[i].morning.completed =
          !!source.morning?.completed;

        fresh.days[i].morning.completedAt =
          source.morning?.completedAt || null;

        fresh.days[i].night.completed =
          !!source.night?.completed;

        fresh.days[i].night.completedAt =
          source.night?.completedAt || null;

        const journal = source.journal || {};

        fresh.days[i].journal = {
          intention: safeText(journal.intention),
          action: safeText(journal.action),
          gratitude1: safeText(journal.gratitude1),
          gratitude2: safeText(journal.gratitude2),
          gratitude3: safeText(journal.gratitude3),
          reflection: safeText(journal.reflection),
          journal: safeText(journal.journal)
        };
      }
    }

    return fresh;
  }

  /* =========================================================
     LOAD / SAVE
     ========================================================= */

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        appData = normalizeData(JSON.parse(saved));
        return;
      }
    } catch (error) {
      console.warn("21-Day Abundance data load error:", error);
    }

    appData = createDefaultData();

    /*
      Old compatibility
    */
    try {
      const oldCompleted = localStorage.getItem(OLD_COMPLETED_KEY);

      if (oldCompleted) {
        try {
          const parsed = JSON.parse(oldCompleted);

          if (Array.isArray(parsed)) {
            parsed.forEach(function (dayNumber) {
              const day = Number(dayNumber);

              if (day >= 1 && day <= TOTAL_DAYS) {
                appData.days[day].morning.completed = true;
              }
            });
          }
        } catch (e) {
          console.warn("Old completion data could not be imported");
        }
      }
    } catch (e) {}

    saveData();
  }

  function saveData() {
    if (!appData) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(appData)
      );
    } catch (error) {
      console.warn("21-Day Abundance save error:", error);
    }
  }

  /* =========================================================
     DATE
     ========================================================= */

  function updateDate() {
    const dateText =
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });

    const candidates = [
      "todayDate",
      "currentDate",
      "dateText"
    ];

    candidates.forEach(function (id) {
      const el = $(id);

      if (el) {
        el.textContent = dateText;
      }
    });
  }

  /* =========================================================
     SESSION STATUS
     ========================================================= */

  function isSessionCompleted(day, type) {
    if (!appData?.days?.[day]) {
      return false;
    }

    if (!SESSION_TYPES.includes(type)) {
      return false;
    }

    return !!appData.days[day][type].completed;
  }

  function completeSession(day, type) {
    day = Number(day) || currentSession.day;
    type = type || currentSession.type;

    if (!appData.days[day]) {
      return;
    }

    if (!SESSION_TYPES.includes(type)) {
      return;
    }

    appData.days[day][type].completed = true;
    appData.days[day][type].completedAt = nowISO();

    appData.activeDay = clamp(
      day,
      1,
      TOTAL_DAYS
    );

    appData.lastActiveDate = todayKey();

    saveData();

    updateAllUI();
  }

  /* =========================================================
     DAY STATUS
     ========================================================= */

  function isDayCompleted(day) {
    if (!appData?.days?.[day]) {
      return false;
    }

    return (
      appData.days[day].morning.completed &&
      appData.days[day].night.completed
    );
  }

  function getCompletedDays() {
    if (!appData) {
      return 0;
    }

    let count = 0;

    for (let i = 1; i <= TOTAL_DAYS; i++) {
      if (isDayCompleted(i)) {
        count++;
      }
    }

    return count;
  }

  function countCompletedDays() {
    return getCompletedDays();
  }

  function getTotalCompletedSessions() {
    if (!appData) {
      return 0;
    }

    let total = 0;

    for (let i = 1; i <= TOTAL_DAYS; i++) {
      if (appData.days[i].morning.completed) {
        total++;
      }

      if (appData.days[i].night.completed) {
        total++;
      }
    }

    return total;
  }

  /* =========================================================
     STREAK
     ========================================================= */

  function calculateStreak() {
    if (!appData) {
      return 0;
    }

    let streak = 0;

    for (let day = TOTAL_DAYS; day >= 1; day--) {
      if (isDayCompleted(day)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /* =========================================================
     ACTIVE DAY
     ========================================================= */

  function getActiveDay() {
    if (!appData) {
      return 1;
    }

    const completed = getCompletedDays();

    if (completed >= TOTAL_DAYS) {
      return TOTAL_DAYS;
    }

    for (let i = 1; i <= TOTAL_DAYS; i++) {
      if (!isDayCompleted(i)) {
        return i;
      }
    }

    return clamp(
      Number(appData.activeDay) || 1,
      1,
      TOTAL_DAYS
    );
  }

  /* =========================================================
     OVERALL PROGRESS
     ========================================================= */

  function getOverallProgress() {
    const completedSessions =
      getTotalCompletedSessions();

    return Math.round(
      (completedSessions /
        (TOTAL_DAYS * 2)) *
        100
    );
  }

  function calculateOverallProgress() {
    return getOverallProgress();
  }

  /* =========================================================
     HOME UI
     ========================================================= */

  function setTextById(id, value) {
    const el = $(id);

    if (el) {
      el.textContent = safeText(value);
    }
  }

  function setWidthById(id, percent) {
    const el = $(id);

    if (el) {
      el.style.width = clamp(
        Number(percent) || 0,
        0,
        100
      ) + "%";
    }
  }

  function updateHome() {
    if (!appData) {
      return;
    }

    const activeDay = getActiveDay();

    const overall = getOverallProgress();

    const completedDays = getCompletedDays();

    const totalSessions =
      getTotalCompletedSessions();

    const streak = calculateStreak();

    setTextById(
      "dayTitle",
      `Day ${activeDay}`
    );

    setTextById(
      "overallProgress",
      overall + "%"
    );

    setTextById(
      "overallText",
      overall + "%"
    );

    setTextById(
      "completedDaysText",
      completedDays
    );

    setTextById(
      "totalCompletedText",
      totalSessions
    );

    setTextById(
      "todayPercent",
      isDayCompleted(activeDay)
        ? "100%"
        : (
            (
              Number(
                appData.days[activeDay].morning.completed
              ) +
              Number(
                appData.days[activeDay].night.completed
              )
            ) * 50
          ) + "%"
    );

    setTextById(
      "streakNumber",
      streak
    );

    setWidthById(
      "overallProgressBar",
      overall
    );

    setWidthById(
      "overallProgressFill",
      overall
    );

    updateSessionButtons();

    renderDays();
  }

  /* =========================================================
     SESSION BUTTONS
     ========================================================= */

  function updateSessionButtons() {
    if (!appData) {
      return;
    }

    const day = getActiveDay();

    const morningDone =
      isSessionCompleted(day, "morning");

    const nightDone =
      isSessionCompleted(day, "night");

    setTextById(
      "morningStatus",
      morningDone ? "Completed" : "Not Started"
    );

    setTextById(
      "nightStatus",
      nightDone ? "Completed" : "Not Started"
    );

    setTextById(
      "morningProgress",
      morningDone ? "100%" : "0%"
    );

    setTextById(
      "nightProgress",
      nightDone ? "100%" : "0%"
    );

    const morningButton = $("morningButton");

    if (morningButton) {
      if (morningDone) {
        morningButton.classList.add("completed");
      } else {
        morningButton.classList.remove("completed");
      }
    }

    const nightButton = $("nightButton");

    if (nightButton) {
      if (nightDone) {
        nightButton.classList.add("completed");
      } else {
        nightButton.classList.remove("completed");
      }
    }
  }

  /* =========================================================
     DAY LIST
     ========================================================= */

  function renderDays() {
    const containers = [
      $("daysGrid"),
      $("daysContainer"),
      $("dayGrid"),
      $("daysList")
    ];

    const container =
      containers.find(Boolean);

    if (!container) {
      return;
    }

    container.innerHTML = "";

    for (let day = 1; day <= TOTAL_DAYS; day++) {
      const completed =
        isDayCompleted(day);

      const morning =
        isSessionCompleted(day, "morning");

      const night =
        isSessionCompleted(day, "night");

      const active =
        day === getActiveDay();

      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "day-item" +
        (completed ? " completed" : "") +
        (active ? " active" : "");

      button.innerHTML = `
        <span class="day-number">${day}</span>
        <span class="day-label">Day ${day}</span>
        <span class="day-status">
          ${completed
            ? "✓"
            : `${morning ? "☀" : "○"} ${night ? "☾" : "○"}`
          }
        </span>
      `;

      button.addEventListener(
        "click",
        function () {
          selectDay(day);
        }
      );

      container.appendChild(button);
    }
  }

  /* =========================================================
     SELECT DAY
     ========================================================= */

  function selectDay(day) {
    day = Number(day);

    if (!Number.isFinite(day)) {
      return;
    }

    if (day < 1 || day > TOTAL_DAYS) {
      return;
    }

    appData.activeDay = day;

    saveData();

    updateAllUI();

    scrollToTop();
  }

  /* =========================================================
     JOURNAL
     ========================================================= */

  function ensureJournal(day) {
    if (!appData.days[day]) {
      return;
    }

    if (
      !appData.days[day].journal ||
      typeof appData.days[day].journal !== "object"
    ) {
      appData.days[day].journal =
        createEmptyJournal();
    }

    const current =
      appData.days[day].journal;

    appData.days[day].journal = {
      intention: safeText(current.intention),
      action: safeText(current.action),
      gratitude1: safeText(current.gratitude1),
      gratitude2: safeText(current.gratitude2),
      gratitude3: safeText(current.gratitude3),
      reflection: safeText(current.reflection),
      journal: safeText(current.journal)
    };
  }

  function findJournalField(name) {
    const possibleIds = {
      intention: [
        "intention",
        "intentionInput",
        "dailyIntention"
      ],

      action: [
        "action",
        "actionInput",
        "dailyAction"
      ],

      gratitude1: [
        "gratitude1",
        "gratitudeOne"
      ],

      gratitude2: [
        "gratitude2",
        "gratitudeTwo"
      ],

      gratitude3: [
        "gratitude3",
        "gratitudeThree"
      ],

      reflection: [
        "reflection",
        "reflectionInput"
      ],

      journal: [
        "journal",
        "journalInput",
        "journalText"
      ]
    };

    const ids =
      possibleIds[name] || [];

    for (const id of ids) {
      const el = $(id);

      if (el) {
        return el;
      }
    }

    return null;
  }

  function loadJournal(day) {
    day = Number(day) || getActiveDay();

    ensureJournal(day);

    const journal =
      appData.days[day].journal;

    Object.keys(journal).forEach(
      function (field) {
        const input =
          findJournalField(field);

        if (input) {
          input.value =
            journal[field] || "";
        }
      }
    );
  }

  function saveJournal() {
    if (!appData) {
      return;
    }

    const day = getActiveDay();

    ensureJournal(day);

    const journal =
      appData.days[day].journal;

    Object.keys(journal).forEach(
      function (field) {
        const input =
          findJournalField(field);

        if (input) {
          journal[field] =
            input.value || "";
        }
      }
    );

    saveData();

    showSmallMessage(
      "Journal saved"
    );
  }

  function setupJournalAutoSave() {
    const fields = [
      "intention",
      "action",
      "gratitude1",
      "gratitude2",
      "gratitude3",
      "reflection",
      "journal"
    ];

    fields.forEach(
      function (field) {
        const input =
          findJournalField(field);

        if (!input) {
          return;
        }

        input.addEventListener(
          "input",
          function () {
            const day =
              getActiveDay();

            ensureJournal(day);

            appData.days[day].journal[field] =
              input.value || "";

            saveData();
          }
        );
      }
    );
  }

  /* =========================================================
     SESSION START
     ========================================================= */

  function startSession(type) {
    if (!SESSION_TYPES.includes(type)) {
      type = "morning";
    }

    const day =
      getActiveDay();

    currentSession = {
      day: day,
      type: type,
      affirmationIndex: 0
    };

    appData.activeDay = day;
    appData.lastActiveDate = todayKey();

    saveData();

    showScreen("sessionScreen");

    renderSession();

    scrollToTop();
  }

  /* =========================================================
     SESSION RENDER
     ========================================================= */

  function renderSession() {
    const day =
      currentSession.day;

    const type =
      currentSession.type;

    const index =
      clamp(
        currentSession.affirmationIndex,
        0,
        affirmations.length - 1
      );

    const affirmation =
      affirmations[index];

    setTextById(
      "sessionDay",
      `Day ${day}`
    );

    setTextById(
      "sessionTitle",
      type === "morning"
        ? "Morning Abundance"
        : "Night Abundance"
    );

    setTextById(
      "sessionType",
      type === "morning"
        ? "Morning Practice"
        : "Night Practice"
    );

    setTextById(
      "affirmation",
      affirmation
    );

    setTextById(
      "affirmationText",
      affirmation
    );

    setTextById(
      "affirmationNumber",
      `${index + 1}/${TOTAL_AFFIRMATIONS}`
    );

    setTextById(
      "currentAffirmation",
      `${index + 1}`
    );

    setTextById(
      "totalAffirmations",
      TOTAL_AFFIRMATIONS
    );

    setWidthById(
      "affirmationProgress",
      ((index + 1) /
        TOTAL_AFFIRMATIONS) *
        100
    );

    const previousButtons = [
      $("previousAffirmationButton"),
      $("previousButton")
    ];

    previousButtons.forEach(
      function (button) {
        if (button) {
          button.disabled =
            index <= 0;
        }
      }
    );

    const nextButtons = [
      $("nextAffirmationButton"),
      $("nextButton")
    ];

    nextButtons.forEach(
      function (button) {
        if (button) {
          button.disabled =
            index >= affirmations.length - 1;
        }
      }
    );

    const finishButtons = [
      $("finishButton"),
      $("finishSessionButton")
    ];

    finishButtons.forEach(
      function (button) {
        if (button) {
          button.style.display =
            index >= affirmations.length - 1
              ? ""
              : "none";
        }
      }
    );
  }

  /* =========================================================
     AFFIRMATION NAVIGATION
     ========================================================= */

  function nextAffirmation() {
    if (
      currentSession.affirmationIndex <
      affirmations.length - 1
    ) {
      currentSession.affirmationIndex++;

      renderSession();

      return;
    }

    finishSession();
  }

  function previousAffirmation() {
    if (
      currentSession.affirmationIndex > 0
    ) {
      currentSession.affirmationIndex--;

      renderSession();
    }
  }

  /* =========================================================
     FINISH SESSION
     ========================================================= */

  function finishSession() {
    const day =
      currentSession.day;

    const type =
      currentSession.type;

    completeSession(
      day,
      type
    );

    showCompleteScreen();
  }

  /* =========================================================
     COMPLETE SCREEN
     ========================================================= */

  function showCompleteScreen() {
    showScreen("completeScreen");

    const day =
      currentSession.day;

    const type =
      currentSession.type;

    setTextById(
      "completedDay",
      `Day ${day}`
    );

    setTextById(
      "completedSession",
      type === "morning"
        ? "Morning Practice Complete"
        : "Night Practice Complete"
    );

    setTextById(
      "completeTitle",
      "Well Done!"
    );

    setTextById(
      "completeMessage",
      "You completed this abundance practice"
    );

    updateAllUI();

    scrollToTop();
  }

  /* =========================================================
     GO HOME
     ========================================================= */

  function goHome() {
    showScreen("homeScreen");

    updateAllUI();

    loadJournal(
      getActiveDay()
    );

    scrollToTop();
  }

  /* =========================================================
     CERTIFICATE
     ========================================================= */

  function updateCertificateAvailability() {
    const complete =
      getCompletedDays() >= TOTAL_DAYS;

    const buttons = [
      $("certificateButton"),
      $("viewCertificateButton")
    ];

    buttons.forEach(
      function (button) {
        if (!button) return;

        button.disabled =
          !complete;

        button.classList.toggle(
          "locked",
          !complete
        );
      }
    );
  }

  function showCertificate() {
    if (getCompletedDays() < TOTAL_DAYS) {
      showSmallMessage(
        "Complete all 21 days to unlock your certificate"
      );

      return;
    }

    showScreen(
      "certificateScreen"
    );

    setTextById(
      "certificateName",
      "21-Day Abundance"
    );

    setTextById(
      "certificateDate",
      new Date().toLocaleDateString()
    );

    scrollToTop();
  }

  /* =========================================================
     RESET
     ========================================================= */

  function resetAll() {
    const confirmed =
      window.confirm(
        "Reset your 21-Day Abundance journey?"
      );

    if (!confirmed) {
      return;
    }

    appData =
      createDefaultData();

    /*
      Important:
      VIP notes are intentionally NOT deleted
    */

    saveData();

    currentSession = {
      day: 1,
      type: "morning",
      affirmationIndex: 0
    };

    goHome();

    showVIPToast(
      "Journey reset successfully"
    );
  }

  /* =========================================================
     SCREEN SYSTEM
     ========================================================= */

  function showScreen(screenId) {
    const screenIds = [
      "homeScreen",
      "sessionScreen",
      "completeScreen",
      "certificateScreen"
    ];

    screenIds.forEach(
      function (id) {
        const screen = $(id);

        if (!screen) {
          return;
        }

        if (id === screenId) {
          screen.classList.add("active");

          screen.style.display = "";
        } else {
          screen.classList.remove("active");

          /*
            Do not force display:none if existing CSS
            controls screen behavior.
          */
        }
      }
    );

    const selected =
      $(screenId);

    if (selected) {
      selected.scrollTop = 0;
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /* =========================================================
     SMALL MESSAGE
     ========================================================= */

  function showSmallMessage(message) {
    let toast =
      $("abundanceToast");

    if (!toast) {
      toast =
        document.createElement("div");

      toast.id =
        "abundanceToast";

      toast.style.position =
        "fixed";

      toast.style.left =
        "50%";

      toast.style.bottom =
        "90px";

      toast.style.transform =
        "translateX(-50%)";

      toast.style.zIndex =
        "99999";

      toast.style.padding =
        "12px 18px";

      toast.style.borderRadius =
        "999px";

      toast.style.background =
        "rgba(20,20,30,.95)";

      toast.style.color =
        "#fff";

      toast.style.fontSize =
        "14px";

      toast.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.25)";

      document.body.appendChild(
        toast
      );
    }

    toast.textContent =
      safeText(message);

    toast.style.opacity = "1";

    clearTimeout(
      toast._timer
    );

    toast._timer =
      setTimeout(
        function () {
          toast.style.opacity =
            "0";
        },
        2200
      );
  }

  /* =========================================================
     KEYBOARD
     ========================================================= */

  function setupKeyboard() {
    document.addEventListener(
      "keydown",
      function (event) {
        const active =
          $("sessionScreen");

        if (
          !active ||
          !active.classList.contains("active")
        ) {
          return;
        }

        if (event.key === "ArrowRight") {
          nextAffirmation();
        }

        if (event.key === "ArrowLeft") {
          previousAffirmation();
        }

        if (event.key === "Escape") {
          goHome();
        }
      }
    );
  }

  /* =========================================================
     BUTTON BINDINGS
     ========================================================= */

  function bindButtons() {
    const morning =
      $("morningButton");

    if (morning) {
      morning.addEventListener(
        "click",
        function () {
          openSession("morning");
        }
      );
    }

    const night =
      $("nightButton");

    if (night) {
      night.addEventListener(
        "click",
        function () {
          openSession("night");
        }
      );
    }

    const next =
      $("nextAffirmationButton");

    if (next) {
      next.addEventListener(
        "click",
        nextAffirmation
      );
    }

    const previous =
      $("previousAffirmationButton");

    if (previous) {
      previous.addEventListener(
        "click",
        previousAffirmation
      );
    }

    const finish =
      $("finishButton");

    if (finish) {
      finish.addEventListener(
        "click",
        finishSession
      );
    }

    const homeButtons =
      qsa(
        '[data-action="home"]'
      );

    homeButtons.forEach(
      function (button) {
        button.addEventListener(
          "click",
          goHome
        );
      }
    );
  }

  /* =========================================================
     VIP NOTES
     ========================================================= */

  function createVIPId() {
    return (
      "vip_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2, 8)
    );
  }

  function escapeVIPHTML(value) {
    return escapeHTML(value);
  }

  function formatVIPDate(dateValue) {
    if (!dateValue) {
      return "";
    }

    const date =
      new Date(dateValue);

    if (Number.isNaN(
      date.getTime()
    )) {
      return "";
    }

    return date.toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric"
      }
    );
  }

  function normalizeVIPCategory(category) {
    if (
      VIP_CATEGORIES.includes(category)
    ) {
      return category;
    }

    return "Other";
  }

  function loadVIPNotes() {
    try {
      const raw =
        localStorage.getItem(
          VIP_STORAGE_KEY
        );

      if (!raw) {
        importantVIPNotes = [];

        return;
      }

      const parsed =
        JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        importantVIPNotes = [];

        return;
      }

      importantVIPNotes =
        parsed
          .filter(
            note =>
              note &&
              typeof note === "object"
          )
          .map(
            function (note) {
              return {
                id:
                  note.id ||
                  createVIPId(),

                title:
                  safeText(
                    note.title
                  ),

                content:
                  safeText(
                    note.content
                  ),

                category:
                  normalizeVIPCategory(
                    note.category
                  ),

                pinned:
                  !!note.pinned,

                createdAt:
                  note.createdAt ||
                  nowISO(),

                updatedAt:
                  note.updatedAt ||
                  note.createdAt ||
                  nowISO()
              };
            }
          );
    } catch (error) {
      console.warn(
        "VIP notes load error:",
        error
      );

      importantVIPNotes = [];
    }
  }

  function saveVIPNotes() {
    try {
      localStorage.setItem(
        VIP_STORAGE_KEY,
        JSON.stringify(
          importantVIPNotes
        )
      );
    } catch (error) {
      console.warn(
        "VIP notes save error:",
        error
      );
    }
  }

  /* =========================================================
     VIP STYLES
     ========================================================= */

  function injectVIPStyles() {
    if (
      $("importantVIPStyles")
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "importantVIPStyles";

    style.textContent = `
      .a21-vip-section{
        margin:20px 0;
        padding:18px;
        border-radius:24px;
        background:
          linear-gradient(
            145deg,
            rgba(255,255,255,.98),
            rgba(250,247,255,.96)
          );
        border:1px solid rgba(130,90,180,.15);
        box-shadow:
          0 12px 35px rgba(40,20,70,.08);
      }

      .a21-vip-header{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        margin-bottom:16px;
      }

      .a21-vip-title{
        display:flex;
        align-items:center;
        gap:10px;
      }

      .a21-vip-icon{
        width:42px;
        height:42px;
        display:flex;
        align-items:center;
        justify-content:center;
        border-radius:14px;
        background:linear-gradient(135deg,#8b5cf6,#ec4899);
        color:#fff;
        font-size:20px;
      }

      .a21-vip-heading{
        font-size:17px;
        font-weight:800;
      }

      .a21-vip-sub{
        font-size:12px;
        opacity:.65;
        margin-top:3px;
      }

      .a21-vip-add{
        border:0;
        min-width:42px;
        height:42px;
        padding:0 14px;
        border-radius:14px;
        cursor:pointer;
        color:#fff;
        background:#111827;
        font-weight:700;
      }

      .a21-vip-tools{
        display:flex;
        gap:8px;
        margin-bottom:14px;
      }

      .a21-vip-search{
        flex:1;
        min-width:0;
        border:1px solid #e5e7eb;
        background:#fff;
        border-radius:14px;
        padding:12px 14px;
        outline:none;
        font-size:14px;
      }

      .a21-vip-filter{
        border:1px solid #e5e7eb;
        background:#fff;
        border-radius:14px;
        padding:0 10px;
        outline:none;
        font-size:13px;
      }

      .a21-vip-empty{
        padding:24px 12px;
        text-align:center;
        border-radius:18px;
        background:#f8f7fb;
        color:#777;
        font-size:13px;
      }

      .a21-vip-card{
        position:relative;
        padding:16px;
        margin-top:10px;
        border-radius:18px;
        background:#fff;
        border:1px solid #eee;
        box-shadow:0 5px 18px rgba(0,0,0,.04);
      }

      .a21-vip-card.pinned{
        border-color:rgba(245,158,11,.45);
      }

      .a21-vip-card-top{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
      }

      .a21-vip-card-title{
        font-weight:800;
        line-height:1.35;
        word-break:break-word;
      }

      .a21-vip-category{
        display:inline-flex;
        margin-top:7px;
        padding:5px 9px;
        border-radius:999px;
        background:#f3e8ff;
        color:#7c3aed;
        font-size:11px;
        font-weight:700;
      }

      .a21-vip-content{
        margin-top:12px;
        color:#4b5563;
        line-height:1.6;
        font-size:13px;
        white-space:pre-wrap;
        word-break:break-word;
      }

      .a21-vip-date{
        margin-top:10px;
        font-size:10px;
        color:#9ca3af;
      }

      .a21-vip-actions{
        display:flex;
        gap:7px;
        margin-top:12px;
      }

      .a21-vip-action{
        flex:1;
        border:1px solid #e5e7eb;
        background:#fff;
        border-radius:11px;
        padding:9px 7px;
        cursor:pointer;
        font-size:11px;
      }

      .a21-vip-action.delete{
        color:#dc2626;
      }

      .a21-vip-action.pin{
        color:#b45309;
      }

      .a21-vip-modal-backdrop{
        position:fixed;
        inset:0;
        z-index:100000;
        display:flex;
        align-items:flex-end;
        justify-content:center;
        padding:12px;
        background:rgba(15,23,42,.58);
        backdrop-filter:blur(5px);
      }

      .a21-vip-modal{
        width:min(620px,100%);
        max-height:92vh;
        overflow:auto;
        background:#fff;
        border-radius:26px;
        padding:20px;
        box-shadow:0 30px 80px rgba(0,0,0,.3);
      }

      .a21-vip-modal-head{
        display:flex;
        align-items:center;
        justify-content:space-between;
        margin-bottom:16px;
      }

      .a21-vip-modal-title{
        font-size:18px;
        font-weight:800;
      }

      .a21-vip-close{
        width:38px;
        height:38px;
        border:0;
        border-radius:12px;
        background:#f3f4f6;
        cursor:pointer;
        font-size:20px;
      }

      .a21-vip-field{
        margin-top:13px;
      }

      .a21-vip-label{
        display:block;
        margin-bottom:7px;
        font-size:12px;
        font-weight:700;
        color:#374151;
      }

      .a21-vip-input,
      .a21-vip-textarea,
      .a21-vip-select{
        width:100%;
        box-sizing:border-box;
        border:1px solid #e5e7eb;
        border-radius:14px;
        padding:12px 13px;
        outline:none;
        font-size:14px;
        background:#fff;
      }

      .a21-vip-textarea{
        min-height:150px;
        resize:vertical;
        line-height:1.6;
      }

      .a21-vip-save{
        width:100%;
        margin-top:16px;
        border:0;
        border-radius:15px;
        padding:13px;
        background:linear-gradient(135deg,#7c3aed,#db2777);
        color:#fff;
        font-weight:800;
        cursor:pointer;
      }

      .a21-vip-cancel{
        width:100%;
        margin-top:8px;
        border:1px solid #e5e7eb;
        border-radius:15px;
        padding:12px;
        background:#fff;
        cursor:pointer;
      }

      .a21-vip-toast{
        position:fixed;
        left:50%;
        bottom:86px;
        transform:translateX(-50%);
        z-index:100001;
        padding:11px 16px;
        border-radius:999px;
        background:#111827;
        color:#fff;
        font-size:12px;
        box-shadow:0 12px 35px rgba(0,0,0,.22);
      }

      @media(min-width:700px){
        .a21-vip-modal-backdrop{
          align-items:center;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  /* =========================================================
     VIP SECTION
     ========================================================= */

  function createVIPSection() {
    if (
      $("importantVIPSection")
    ) {
      return $("importantVIPSection");
    }

    const section =
      document.createElement("section");

    section.id =
      "importantVIPSection";

    section.className =
      "a21-vip-section";

    section.innerHTML = `
      <div class="a21-vip-header">
        <div class="a21-vip-title">
          <div class="a21-vip-icon">★</div>

          <div>
            <div class="a21-vip-heading">
              Important VIP Notes
            </div>

            <div class="a21-vip-sub">
              သိမ်းထားချင်တဲ့ အရေးကြီးတဲ့ note တွေကို ဒီမှာထားနိုင်ပါတယ်
            </div>
          </div>
        </div>

        <button
          type="button"
          class="a21-vip-add"
          id="importantVIPAddButton"
        >
          + Add
        </button>
      </div>

      <div class="a21-vip-tools">
        <input
          id="importantVIPSearch"
          class="a21-vip-search"
          type="search"
          placeholder="Search important notes..."
        />

        <select
          id="importantVIPFilter"
          class="a21-vip-filter"
        >
          <option value="All">All</option>
          ${VIP_CATEGORIES.map(
            category =>
              `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`
          ).join("")}
        </select>
      </div>

      <div id="importantVIPNotesList"></div>
    `;

    /*
      Prefer dashboard/home area
    */

    const possibleParents = [
      $("homeScreen"),
      $("dashboardScreen"),
      $("home"),
      document.querySelector("main")
    ];

    const parent =
      possibleParents.find(Boolean);

    if (parent) {
      parent.appendChild(section);
    } else {
      document.body.appendChild(
        section
      );
    }

    return section;
  }

  /* =========================================================
     VIP QUICK ACTION
     ========================================================= */

  function createVIPQuickAction() {
    /*
      Existing HTML may already have a Quick Action.
      We intentionally do not duplicate it.
    */

    const existing =
      document.querySelector(
        '[data-vip-action="important"]'
      );

    if (existing) {
      return;
    }
  }

  /* =========================================================
     VIP MODAL
     ========================================================= */

  function createVIPModal() {
    if (
      $("importantVIPModal")
    ) {
      return;
    }

    const backdrop =
      document.createElement("div");

    backdrop.id =
      "importantVIPModal";

    backdrop.className =
      "a21-vip-modal-backdrop";

    backdrop.style.display =
      "none";

    backdrop.innerHTML = `
      <div
        class="a21-vip-modal"
        role="dialog"
        aria-modal="true"
      >
        <div class="a21-vip-modal-head">
          <div
            class="a21-vip-modal-title"
            id="importantVIPModalTitle"
          >
            Add Important Note
          </div>

          <button
            type="button"
            class="a21-vip-close"
            id="importantVIPClose"
          >
            ×
          </button>
        </div>

        <div class="a21-vip-field">
          <label
            class="a21-vip-label"
            for="importantVIPTitle"
          >
            Title
          </label>

          <input
            id="importantVIPTitle"
            class="a21-vip-input"
            type="text"
            maxlength="120"
            placeholder="e.g. Teacher's important lesson"
          />
        </div>

        <div class="a21-vip-field">
          <label
            class="a21-vip-label"
            for="importantVIPCategory"
          >
            Category
          </label>

          <select
            id="importantVIPCategory"
            class="a21-vip-select"
          >
            ${VIP_CATEGORIES.map(
              category =>
                `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`
            ).join("")}
          </select>
        </div>

        <div class="a21-vip-field">
          <label
            class="a21-vip-label"
            for="importantVIPContent"
          >
            Important Note
          </label>

          <textarea
            id="importantVIPContent"
            class="a21-vip-textarea"
            placeholder="Write your important note here..."
          ></textarea>
        </div>

        <button
          type="button"
          class="a21-vip-save"
          id="importantVIPSave"
        >
          Save Important Note
        </button>

        <button
          type="button"
          class="a21-vip-cancel"
          id="importantVIPCancel"
        >
          Cancel
        </button>
      </div>
    `;

    document.body.appendChild(
      backdrop
    );
  }

  /* =========================================================
     OPEN VIP
     ========================================================= */

  function openImportantVIP() {
    createVIPModal();

    vipEditingId = null;

    const modal =
      $("importantVIPModal");

    const title =
      $("importantVIPModalTitle");

    const input =
      $("importantVIPTitle");

    const category =
      $("importantVIPCategory");

    const content =
      $("importantVIPContent");

    if (!modal) {
      return;
    }

    if (title) {
      title.textContent =
        "Add Important Note";
    }

    if (input) {
      input.value = "";
    }

    if (category) {
      category.value =
        "Teacher";
    }

    if (content) {
      content.value = "";
    }

    previousBodyOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    modal.style.display =
      "flex";

    setTimeout(
      function () {
        if (input) {
          input.focus();
        }
      },
      50
    );
  }

  /* =========================================================
     EDIT VIP
     ========================================================= */

  function editVIPNote(id) {
    const note =
      importantVIPNotes.find(
        item => item.id === id
      );

    if (!note) {
      return;
    }

    createVIPModal();

    vipEditingId = id;

    const modal =
      $("importantVIPModal");

    const title =
      $("importantVIPModalTitle");

    const input =
      $("importantVIPTitle");

    const category =
      $("importantVIPCategory");

    const content =
      $("importantVIPContent");

    if (title) {
      title.textContent =
        "Edit Important Note";
    }

    if (input) {
      input.value =
        note.title;
    }

    if (category) {
      category.value =
        normalizeVIPCategory(
          note.category
        );
    }

    if (content) {
      content.value =
        note.content;
    }

    previousBodyOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    modal.style.display =
      "flex";

    setTimeout(
      function () {
        if (input) {
          input.focus();
        }
      },
      50
    );
  }

  /* =========================================================
     CLOSE VIP MODAL
     ========================================================= */

  function closeVIPModal() {
    const modal =
      $("importantVIPModal");

    if (!modal) {
      return;
    }

    modal.style.display =
      "none";

    document.body.style.overflow =
      previousBodyOverflow || "";

    vipEditingId = null;
  }

  /* =========================================================
     SAVE VIP NOTE
     ========================================================= */

  function saveVIPNote() {
    const titleInput =
      $("importantVIPTitle");

    const categoryInput =
      $("importantVIPCategory");

    const contentInput =
      $("importantVIPContent");

    const title =
      titleInput?.value.trim() || "";

    const category =
      normalizeVIPCategory(
        categoryInput?.value
      );

    const content =
      contentInput?.value.trim() || "";

    if (!title) {
      showVIPToast(
        "Please enter a title"
      );

      titleInput?.focus();

      return;
    }

    if (!content) {
      showVIPToast(
        "Please enter your important note"
      );

      contentInput?.focus();

      return;
    }

    if (vipEditingId) {
      const note =
        importantVIPNotes.find(
          item =>
            item.id ===
            vipEditingId
        );

      if (note) {
        note.title =
          title;

        note.category =
          category;

        note.content =
          content;

        note.updatedAt =
          nowISO();
      }

      showVIPToast(
        "Important note updated"
      );
    } else {
      importantVIPNotes.unshift({
        id:
          createVIPId(),

        title:
          title,

        content:
          content,

        category:
          category,

        pinned:
          false,

        createdAt:
          nowISO(),

        updatedAt:
          nowISO()
      });

      showVIPToast(
        "Important note saved"
      );
    }

    saveVIPNotes();

    closeVIPModal();

    renderVIPNotes();
  }

  /* =========================================================
     DELETE VIP
     ========================================================= */

  function deleteVIPNote(id) {
    const note =
      importantVIPNotes.find(
        item => item.id === id
      );

    if (!note) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${note.title}"?`
      );

    if (!confirmed) {
      return;
    }

    importantVIPNotes =
      importantVIPNotes.filter(
        item => item.id !== id
      );

    saveVIPNotes();

    renderVIPNotes();

    showVIPToast(
      "Important note deleted"
    );
  }

  /* =========================================================
     PIN VIP
     ========================================================= */

  function toggleVIPPin(id) {
    const note =
      importantVIPNotes.find(
        item => item.id === id
      );

    if (!note) {
      return;
    }

    note.pinned =
      !note.pinned;

    note.updatedAt =
      nowISO();

    saveVIPNotes();

    renderVIPNotes();

    showVIPToast(
      note.pinned
        ? "Note pinned"
        : "Note unpinned"
    );
  }

  /* =========================================================
     SEARCH
     ========================================================= */

  function getVIPSearchValue() {
    const input =
      $("importantVIPSearch");

    return (
      input?.value
        ?.trim()
        .toLowerCase() ||
      ""
    );
  }

  /* =========================================================
     RENDER VIP
     ========================================================= */

  function renderVIPNotes() {
    const container =
      $("importantVIPNotesList");

    if (!container) {
      return;
    }

    const search =
      getVIPSearchValue();

    const filter =
      $("importantVIPFilter")
        ?.value ||
      "All";

    let notes =
      importantVIPNotes.filter(
        function (note) {
          const searchable = (
            note.title +
            " " +
            note.content +
            " " +
            note.category
          ).toLowerCase();

          const matchesSearch =
            !search ||
            searchable.includes(search);

          const matchesFilter =
            filter === "All" ||
            note.category === filter;

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );

    notes.sort(
      function (a, b) {
        if (
          a.pinned !== b.pinned
        ) {
          return a.pinned ? -1 : 1;
        }

        return (
          new Date(
            b.updatedAt
          ).getTime() -
          new Date(
            a.updatedAt
          ).getTime()
        );
      }
    );

    if (!notes.length) {
      container.innerHTML = `
        <div class="a21-vip-empty">
          ${importantVIPNotes.length
            ? "No matching notes found"
            : "No important notes yet. Add your first VIP note."}
        </div>
      `;

      return;
    }

    container.innerHTML =
      notes.map(
        function (note) {
          return `
            <article
              class="a21-vip-card ${note.pinned ? "pinned" : ""}"
            >
              <div class="a21-vip-card-top">
                <div>
                  <div class="a21-vip-card-title">
                    ${note.pinned ? "📌 " : ""}
                    ${escapeVIPHTML(note.title)}
                  </div>

                  <span class="a21-vip-category">
                    ${escapeVIPHTML(note.category)}
                  </span>
                </div>
              </div>

              <div class="a21-vip-content">
                ${escapeVIPHTML(note.content)}
              </div>

              <div class="a21-vip-date">
                Updated ${formatVIPDate(note.updatedAt)}
              </div>

              <div class="a21-vip-actions">
                <button
                  type="button"
                  class="a21-vip-action pin"
                  data-vip-action="pin"
                  data-vip-id="${escapeHTML(note.id)}"
                >
                  ${note.pinned ? "Unpin" : "Pin"}
                </button>

                <button
                  type="button"
                  class="a21-vip-action"
                  data-vip-action="edit"
                  data-vip-id="${escapeHTML(note.id)}"
                >
                  Edit
                </button>

                <button
                  type="button"
                  class="a21-vip-action delete"
                  data-vip-action="delete"
                  data-vip-id="${escapeHTML(note.id)}"
                >
                  Delete
                </button>
              </div>
            </article>
          `;
        }
      ).join("");
  }

  /* =========================================================
     VIP EVENTS
     ========================================================= */

  function setupVIPEvents() {
    const add =
      $("importantVIPAddButton");

    if (add) {
      add.addEventListener(
        "click",
        openImportantVIP
      );
    }

    const search =
      $("importantVIPSearch");

    if (search) {
      search.addEventListener(
        "input",
        renderVIPNotes
      );
    }

    const filter =
      $("importantVIPFilter");

    if (filter) {
      filter.addEventListener(
        "change",
        renderVIPNotes
      );
    }

    const list =
      $("importantVIPNotesList");

    if (list) {
      list.addEventListener(
        "click",
        function (event) {
          const button =
            event.target.closest(
              "[data-vip-action]"
            );

          if (!button) {
            return;
          }

          const action =
            button.dataset.vipAction;

          const id =
            button.dataset.vipId;

          if (action === "edit") {
            editVIPNote(id);
          }

          if (action === "delete") {
            deleteVIPNote(id);
          }

          if (action === "pin") {
            toggleVIPPin(id);
          }
        }
      );
    }

    const close =
      $("importantVIPClose");

    if (close) {
      close.addEventListener(
        "click",
        closeVIPModal
      );
    }

    const cancel =
      $("importantVIPCancel");

    if (cancel) {
      cancel.addEventListener(
        "click",
        closeVIPModal
      );
    }

    const save =
      $("importantVIPSave");

    if (save) {
      save.addEventListener(
        "click",
        saveVIPNote
      );
    }

    const modal =
      $("importantVIPModal");

    if (modal) {
      modal.addEventListener(
        "click",
        function (event) {
          if (
            event.target === modal
          ) {
            closeVIPModal();
          }
        }
      );
    }
  }

  /* =========================================================
     VIP TOAST
     ========================================================= */

  function showVIPToast(message) {
    let toast =
      $("importantVIPToast");

    if (!toast) {
      toast =
        document.createElement("div");

      toast.id =
        "importantVIPToast";

      toast.className =
        "a21-vip-toast";

      toast.style.display =
        "none";

      document.body.appendChild(
        toast
      );
    }

    toast.textContent =
      safeText(message);

    toast.style.display =
      "block";

    clearTimeout(
      toast._timer
    );

    toast._timer =
      setTimeout(
        function () {
          toast.style.display =
            "none";
        },
        2200
      );
  }

  /* =========================================================
     INIT VIP
     ========================================================= */

  function initImportantVIP() {
    if (vipInitialized) {
      return;
    }

    vipInitialized = true;

    injectVIPStyles();

    loadVIPNotes();

    createVIPSection();

    createVIPModal();

    setupVIPEvents();

    renderVIPNotes();
  }

  /* =========================================================
     DASHBOARD EXTRA COMPATIBILITY
     ========================================================= */

  function updateDashboardExtras() {
    /*
      Compatible aliases for the existing index.html
    */

    try {
      if (
        typeof window.updateDashboardExtrasInternal ===
        "function"
      ) {
        window.updateDashboardExtrasInternal();
      }
    } catch (error) {
      console.warn(
        "Dashboard enhancement error:",
        error
      );
    }
  }

  /* =========================================================
     UPDATE EVERYTHING
     ========================================================= */

  function updateAllUI() {
    updateDate();

    updateHome();

    loadJournal(
      getActiveDay()
    );

    updateCertificateAvailability();

    renderVIPNotes();

    updateDashboardExtras();
  }

  /* =========================================================
     IMPORTANT:
     HTML COMPATIBILITY FUNCTIONS
     ========================================================= */

  /*
    Existing index.html calls:

      openSession('morning')
      openSession('night')

    So we MUST expose this globally.
  */

  window.openSession =
    function (type) {
      if (type === "morning") {
        startSession("morning");

        return;
      }

      if (type === "night") {
        startSession("night");

        return;
      }

      startSession("morning");
    };

  /*
    Existing index.html calls:

      markDone()
  */

  window.markDone =
    function () {
      /*
        The "ဖတ်ပြီးပါပြီ" button should
        complete the current session.
      */

      finishSession();
    };

  /*
    Existing index.html calls:

      continueAfterComplete()
  */

  window.continueAfterComplete =
    function () {
      goHome();
    };

  /* =========================================================
     GLOBAL FUNCTIONS
     ========================================================= */

  window.startMorning =
    function () {
      startSession("morning");
    };

  window.startNight =
    function () {
      startSession("night");
    };

  window.nextAffirmation =
    nextAffirmation;

  window.previousAffirmation =
    previousAffirmation;

  window.finishSession =
    finishSession;

  window.goHome =
    goHome;

  window.selectDay =
    selectDay;

  window.saveJournal =
    saveJournal;

  window.resetAll =
    resetAll;

  window.showCertificate =
    showCertificate;

  window.openImportantVIP =
    openImportantVIP;

  window.editVIPNote =
    editVIPNote;

  window.deleteVIPNote =
    deleteVIPNote;

  window.toggleVIPPin =
    toggleVIPPin;

  window.showVIPToast =
    showVIPToast;

  window.calculateOverallProgress =
    calculateOverallProgress;

  window.countCompletedDays =
    countCompletedDays;

  window.getCompletedDays =
    getCompletedDays;

  window.calculateStreak =
    calculateStreak;

  window.getOverallProgress =
    getOverallProgress;

  /* =========================================================
     INITIALIZATION
     ========================================================= */

  function initApp() {
    if (appInitialized) {
      return;
    }

    appInitialized = true;

    loadData();

    loadVIPNotes();

    updateDate();

    bindButtons();

    setupKeyboard();

    setupJournalAutoSave();

    initImportantVIP();

    updateAllUI();

    /*
      Start on Home screen
    */

    if (
      !$("sessionScreen")?.classList.contains(
        "active"
      )
    ) {
      showScreen("homeScreen");
    }

    /*
      Load today's active day
    */

    loadJournal(
      getActiveDay()
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

})();
