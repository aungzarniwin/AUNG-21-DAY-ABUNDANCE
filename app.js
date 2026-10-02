/* =========================================================
   21-DAY ABUNDANCE V2.2
   PROFESSIONAL JOURNEY APP
   + IMPORTANT VIP PREMIUM NOTES
   ---------------------------------------------------------
   21 Days
   Morning / Night
   17 Affirmations
   Intention
   Action
   Gratitude
   Reflection
   Journal
   Streak
   Certificate
   IMPORTANT VIP
   LocalStorage
========================================================= */

(function () {
  "use strict";

  /* =======================================================
     CONFIG
  ======================================================= */

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

  /* =======================================================
     17 AFFIRMATIONS
  ======================================================= */

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

  /* =======================================================
     DEFAULT JOURNAL
  ======================================================= */

  function createEmptyJournal() {
    return {
      intention: "",
      action: "",
      gratitude1: "",
      gratitude2: "",
      gratitude3: "",
      reflection: "",
      savedAt: null
    };
  }

  /* =======================================================
     DEFAULT DATA
  ======================================================= */

  function createDefaultData() {
    const completed = {};

    for (let day = 1; day <= TOTAL_DAYS; day++) {
      completed[day] = {
        morning: false,
        night: false
      };
    }

    const journal = {};

    for (let day = 1; day <= TOTAL_DAYS; day++) {
      journal[day] = createEmptyJournal();
    }

    return {
      version: 2.2,
      currentDay: 1,
      completed: completed,
      journal: journal,
      startedAt: new Date().toISOString(),
      completedAt: null
    };
  }

  /* =======================================================
     NORMALIZE JOURNEY DATA
  ======================================================= */

  function normalizeData(data) {
    const defaults = createDefaultData();

    if (!data || typeof data !== "object") {
      return defaults;
    }

    const normalized = {
      version: 2.2,
      currentDay: Number(data.currentDay) || 1,
      completed: {},
      journal: {},
      startedAt: data.startedAt || defaults.startedAt,
      completedAt: data.completedAt || null
    };

    if (
      normalized.currentDay < 1 ||
      normalized.currentDay > TOTAL_DAYS
    ) {
      normalized.currentDay = 1;
    }

    for (let day = 1; day <= TOTAL_DAYS; day++) {
      const oldCompleted =
        data.completed &&
        data.completed[day]
          ? data.completed[day]
          : {};

      normalized.completed[day] = {
        morning: Boolean(oldCompleted.morning),
        night: Boolean(oldCompleted.night)
      };

      const oldJournal =
        data.journal &&
        data.journal[day]
          ? data.journal[day]
          : {};

      normalized.journal[day] = {
        intention: String(oldJournal.intention || ""),
        action: String(oldJournal.action || ""),
        gratitude1: String(oldJournal.gratitude1 || ""),
        gratitude2: String(oldJournal.gratitude2 || ""),
        gratitude3: String(oldJournal.gratitude3 || ""),
        reflection: String(oldJournal.reflection || ""),
        savedAt: oldJournal.savedAt || null
      };
    }

    return normalized;
  }

  /* =======================================================
     LOAD JOURNEY DATA
  ======================================================= */

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        return normalizeData(JSON.parse(saved));
      }

      const oldCompleted = localStorage.getItem(OLD_COMPLETED_KEY);

      if (oldCompleted) {
        const fresh = createDefaultData();

        try {
          const old = JSON.parse(oldCompleted);

          if (old && typeof old === "object") {
            Object.keys(old).forEach(function (key) {
              const day = Number(key);

              if (day >= 1 && day <= TOTAL_DAYS) {
                if (typeof old[key] === "boolean") {
                  fresh.completed[day].morning = old[key];
                }
              }
            });
          }
        } catch (error) {
          console.warn("Old completion migration failed", error);
        }

        saveData(fresh);

        return fresh;
      }

      const fresh = createDefaultData();

      saveData(fresh);

      return fresh;
    } catch (error) {
      console.error("Unable to load app data", error);

      return createDefaultData();
    }
  }

  /* =======================================================
     SAVE JOURNEY DATA
  ======================================================= */

  function saveData(data) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );

      return true;
    } catch (error) {
      console.error("Unable to save app data", error);

      return false;
    }
  }

  /* =======================================================
     DATE
  ======================================================= */

  function updateDate() {
    const el = document.getElementById("todayDate");

    if (!el) return;

    const now = new Date();

    el.textContent = now.toLocaleDateString(
      undefined,
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );
  }

  /* =======================================================
     SESSION HELPERS
  ======================================================= */

  function isSessionCompleted(day, type) {
    return Boolean(
      appData &&
      appData.completed &&
      appData.completed[day] &&
      appData.completed[day][type]
    );
  }

  function completeSession(day, type) {
    if (!appData.completed[day]) {
      appData.completed[day] = {
        morning: false,
        night: false
      };
    }

    appData.completed[day][type] = true;

    saveData(appData);

    updateAllUI();
  }

  function isDayCompleted(day) {
    return (
      isSessionCompleted(day, "morning") &&
      isSessionCompleted(day, "night")
    );
  }

  function getCompletedDays() {
    let count = 0;

    for (let day = 1; day <= TOTAL_DAYS; day++) {
      if (isDayCompleted(day)) {
        count++;
      }
    }

    return count;
  }

  function getTotalCompletedSessions() {
    let count = 0;

    for (let day = 1; day <= TOTAL_DAYS; day++) {
      if (isSessionCompleted(day, "morning")) {
        count++;
      }

      if (isSessionCompleted(day, "night")) {
        count++;
      }
    }

    return count;
  }

  /* =======================================================
     STREAK
  ======================================================= */

  function calculateStreak() {
    let streak = 0;

    for (let day = 1; day <= TOTAL_DAYS; day++) {
      if (isDayCompleted(day)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /* =======================================================
     CURRENT DAY
  ======================================================= */

  function getActiveDay() {
    const completedDays = getCompletedDays();

    if (completedDays >= TOTAL_DAYS) {
      return TOTAL_DAYS;
    }

    return Math.min(
      Math.max(
        Number(appData.currentDay) || 1,
        1
      ),
      TOTAL_DAYS
    );
  }

  /* =======================================================
     PROGRESS
  ======================================================= */

  function getOverallProgress() {
    const total = TOTAL_DAYS * 2;
    const completed = getTotalCompletedSessions();

    if (!total) return 0;

    return Math.round(
      (completed / total) * 100
    );
  }

  /* =======================================================
     HOME UI
  ======================================================= */

  function updateHome() {
    const completedDays = getCompletedDays();
    const totalCompleted = getTotalCompletedSessions();
    const progress = getOverallProgress();
    const activeDay = getActiveDay();
    const streak = calculateStreak();

    const overallProgress =
      document.getElementById("overallProgress");

    const overallText =
      document.getElementById("overallText");

    const completedDaysText =
      document.getElementById("completedDaysText");

    const totalCompletedText =
      document.getElementById("totalCompletedText");

    const todayPercent =
      document.getElementById("todayPercent");

    const streakNumber =
      document.getElementById("streakNumber");

    const morningStatus =
      document.getElementById("morningStatus");

    const nightStatus =
      document.getElementById("nightStatus");

    const morningProgress =
      document.getElementById("morningProgress");

    const nightProgress =
      document.getElementById("nightProgress");

    if (overallProgress) {
      overallProgress.style.width =
        progress + "%";
    }

    if (overallText) {
      overallText.textContent =
        progress + "%";
    }

    if (completedDaysText) {
      completedDaysText.textContent =
        completedDays + " / " + TOTAL_DAYS;
    }

    if (totalCompletedText) {
      totalCompletedText.textContent =
        totalCompleted + " / " +
        (TOTAL_DAYS * 2);
    }

    if (todayPercent) {
      const morning =
        isSessionCompleted(
          activeDay,
          "morning"
        )
          ? 50
          : 0;

      const night =
        isSessionCompleted(
          activeDay,
          "night"
        )
          ? 50
          : 0;

      todayPercent.textContent =
        (morning + night) + "%";
    }

    if (streakNumber) {
      streakNumber.textContent =
        streak;
    }

    const morningDone =
      isSessionCompleted(
        activeDay,
        "morning"
      );

    const nightDone =
      isSessionCompleted(
        activeDay,
        "night"
      );

    if (morningStatus) {
      morningStatus.textContent =
        morningDone
          ? "Completed"
          : "Not completed";
    }

    if (nightStatus) {
      nightStatus.textContent =
        nightDone
          ? "Completed"
          : "Not completed";
    }

    if (morningProgress) {
      morningProgress.style.width =
        morningDone ? "100%" : "0%";
    }

    if (nightProgress) {
      nightProgress.style.width =
        nightDone ? "100%" : "0%";
    }

    const dayTitle =
      document.getElementById("dayTitle");

    if (dayTitle) {
      dayTitle.textContent =
        "Day " + activeDay;
    }

    updateSessionButtons(
      activeDay
    );
  }

  /* =======================================================
     SESSION BUTTONS
  ======================================================= */

  function updateSessionButtons(day) {
    const morningButton =
      document.getElementById("morningButton");

    const nightButton =
      document.getElementById("nightButton");

    if (morningButton) {
      const done =
        isSessionCompleted(
          day,
          "morning"
        );

      morningButton.classList.toggle(
        "completed",
        done
      );

      morningButton.setAttribute(
        "aria-label",
        done
          ? "Morning completed"
          : "Start Morning"
      );
    }

    if (nightButton) {
      const done =
        isSessionCompleted(
          day,
          "night"
        );

      nightButton.classList.toggle(
        "completed",
        done
      );

      nightButton.setAttribute(
        "aria-label",
        done
          ? "Night completed"
          : "Start Night"
      );
    }
  }

  /* =======================================================
     DAYS GRID
  ======================================================= */

  function renderDays() {
    const grid =
      document.getElementById("daysGrid");

    if (!grid) return;

    grid.innerHTML = "";

    for (
      let day = 1;
      day <= TOTAL_DAYS;
      day++
    ) {
      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "day-card";

      if (day === getActiveDay()) {
        button.classList.add("active");
      }

      if (isDayCompleted(day)) {
        button.classList.add("completed");
      }

      button.innerHTML = `
        <span class="day-number">
          ${day}
        </span>
        <span class="day-label">
          ${
            isDayCompleted(day)
              ? "Completed"
              : "Day " + day
          }
        </span>
      `;

      button.addEventListener(
        "click",
        function () {
          selectDay(day);
        }
      );

      grid.appendChild(button);
    }
  }

  /* =======================================================
     SELECT DAY
  ======================================================= */

  function selectDay(day) {
    day = Number(day);

    if (
      !Number.isFinite(day) ||
      day < 1 ||
      day > TOTAL_DAYS
    ) {
      return;
    }

    appData.currentDay = day;

    saveData(appData);

    loadJournal(day);

    renderDays();

    updateHome();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /* =======================================================
     JOURNAL
  ======================================================= */

  function ensureJournal(day) {
    if (!appData.journal[day]) {
      appData.journal[day] =
        createEmptyJournal();
    }

    return appData.journal[day];
  }

  function loadJournal(day) {
    const journal =
      ensureJournal(day);

    const intentionInput =
      document.getElementById(
        "intentionInput"
      );

    const actionInput =
      document.getElementById(
        "actionInput"
      );

    const gratitude1 =
      document.getElementById(
        "gratitude1"
      );

    const gratitude2 =
      document.getElementById(
        "gratitude2"
      );

    const gratitude3 =
      document.getElementById(
        "gratitude3"
      );

    const reflectionInput =
      document.getElementById(
        "reflectionInput"
      );

    if (intentionInput) {
      intentionInput.value =
        journal.intention;
    }

    if (actionInput) {
      actionInput.value =
        journal.action;
    }

    if (gratitude1) {
      gratitude1.value =
        journal.gratitude1;
    }

    if (gratitude2) {
      gratitude2.value =
        journal.gratitude2;
    }

    if (gratitude3) {
      gratitude3.value =
        journal.gratitude3;
    }

    if (reflectionInput) {
      reflectionInput.value =
        journal.reflection;
    }

    const status =
      document.getElementById(
        "journalSaveStatus"
      );

    if (status) {
      status.textContent =
        journal.savedAt
          ? "Saved"
          : "";
    }
  }

  function saveJournal() {
    const day = getActiveDay();

    const journal =
      ensureJournal(day);

    const intentionInput =
      document.getElementById(
        "intentionInput"
      );

    const actionInput =
      document.getElementById(
        "actionInput"
      );

    const gratitude1 =
      document.getElementById(
        "gratitude1"
      );

    const gratitude2 =
      document.getElementById(
        "gratitude2"
      );

    const gratitude3 =
      document.getElementById(
        "gratitude3"
      );

    const reflectionInput =
      document.getElementById(
        "reflectionInput"
      );

    if (intentionInput) {
      journal.intention =
        intentionInput.value;
    }

    if (actionInput) {
      journal.action =
        actionInput.value;
    }

    if (gratitude1) {
      journal.gratitude1 =
        gratitude1.value;
    }

    if (gratitude2) {
      journal.gratitude2 =
        gratitude2.value;
    }

    if (gratitude3) {
      journal.gratitude3 =
        gratitude3.value;
    }

    if (reflectionInput) {
      journal.reflection =
        reflectionInput.value;
    }

    journal.savedAt =
      new Date().toISOString();

    saveData(appData);

    const status =
      document.getElementById(
        "journalSaveStatus"
      );

    if (status) {
      status.textContent =
        "Saved ✓";

      clearTimeout(
        status._saveTimer
      );

      status._saveTimer =
        setTimeout(
          function () {
            status.textContent =
              "Saved";
          },
          1800
        );
    }
  }

  /* =======================================================
     JOURNAL AUTO SAVE
  ======================================================= */

  function setupJournalAutoSave() {
    const ids = [
      "intentionInput",
      "actionInput",
      "gratitude1",
      "gratitude2",
      "gratitude3",
      "reflectionInput"
    ];

    ids.forEach(function (id) {
      const element =
        document.getElementById(id);

      if (!element) return;

      element.addEventListener(
        "input",
        function () {
          saveJournal();
        }
      );
    });
  }

  /* =======================================================
     START SESSION
  ======================================================= */

  function startSession(type) {
    const day = getActiveDay();

    if (
      !SESSION_TYPES.includes(type)
    ) {
      type = "morning";
    }

    currentSession = {
      day: day,
      type: type,
      affirmationIndex:
        type === "morning"
          ? 0
          : Math.min(
              TOTAL_AFFIRMATIONS - 1,
              8
            )
    };

    const sessionScreen =
      document.getElementById(
        "sessionScreen"
      );

    const homeScreen =
      document.getElementById(
        "homeScreen"
      );

    if (homeScreen) {
      homeScreen.style.display =
        "none";
    }

    if (sessionScreen) {
      sessionScreen.style.display =
        "block";
    }

    renderSession();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /* =======================================================
     SESSION RENDER
  ======================================================= */

  function renderSession() {
    const index =
      Math.max(
        0,
        Math.min(
          TOTAL_AFFIRMATIONS - 1,
          currentSession.affirmationIndex
        )
      );

    const affirmationText =
      document.getElementById(
        "affirmationText"
      );

    const affirmationNumber =
      document.getElementById(
        "affirmationNumber"
      );

    const sessionDay =
      document.getElementById(
        "sessionDay"
      );

    const sessionType =
      document.getElementById(
        "sessionType"
      );

    const sessionCounter =
      document.getElementById(
        "sessionCounter"
      );

    const sessionProgress =
      document.getElementById(
        "sessionProgress"
      );

    const sessionProgressText =
      document.getElementById(
        "sessionProgressText"
      );

    if (affirmationText) {
      affirmationText.textContent =
        affirmations[index];
    }

    if (affirmationNumber) {
      affirmationNumber.textContent =
        index + 1;
    }

    if (sessionDay) {
      sessionDay.textContent =
        "Day " +
        currentSession.day;
    }

    if (sessionType) {
      sessionType.textContent =
        currentSession.type ===
        "morning"
          ? "Morning"
          : "Night";
    }

    if (sessionCounter) {
      sessionCounter.textContent =
        (index + 1) +
        " / " +
        TOTAL_AFFIRMATIONS;
    }

    const percent =
      Math.round(
        ((index + 1) /
          TOTAL_AFFIRMATIONS) *
          100
      );

    if (sessionProgress) {
      sessionProgress.style.width =
        percent + "%";
    }

    if (sessionProgressText) {
      sessionProgressText.textContent =
        percent + "%";
    }

    const previousButton =
      document.getElementById(
        "previousButton"
      );

    const nextButton =
      document.getElementById(
        "nextButton"
      );

    if (previousButton) {
      previousButton.disabled =
        index === 0;
    }

    if (nextButton) {
      nextButton.disabled =
        index >=
        TOTAL_AFFIRMATIONS - 1;
    }
  }

  /* =======================================================
     NEXT AFFIRMATION
  ======================================================= */

  function nextAffirmation() {
    if (
      currentSession.affirmationIndex <
      TOTAL_AFFIRMATIONS - 1
    ) {
      currentSession.affirmationIndex++;

      renderSession();
    }
  }

  /* =======================================================
     PREVIOUS AFFIRMATION
  ======================================================= */

  function previousAffirmation() {
    if (
      currentSession.affirmationIndex >
      0
    ) {
      currentSession.affirmationIndex--;

      renderSession();
    }
  }

  /* =======================================================
     COMPLETE SESSION
  ======================================================= */

  function finishSession() {
    const day =
      currentSession.day;

    const type =
      currentSession.type;

    completeSession(
      day,
      type
    );

    showCompleteScreen(
      day,
      type
    );
  }

  /* =======================================================
     COMPLETE SCREEN
  ======================================================= */

  function showCompleteScreen(
    day,
    type
  ) {
    const sessionScreen =
      document.getElementById(
        "sessionScreen"
      );

    const completeScreen =
      document.getElementById(
        "completeScreen"
      );

    if (sessionScreen) {
      sessionScreen.style.display =
        "none";
    }

    if (completeScreen) {
      completeScreen.style.display =
        "block";
    }

    const completeTitle =
      document.getElementById(
        "completeTitle"
      );

    const completeMessage =
      document.getElementById(
        "completeMessage"
      );

    const completeDayNumber =
      document.getElementById(
        "completeDayNumber"
      );

    const completeStreak =
      document.getElementById(
        "completeStreak"
      );

    if (completeTitle) {
      completeTitle.textContent =
        type === "morning"
          ? "Morning Complete"
          : "Night Complete";
    }

    if (completeMessage) {
      completeMessage.textContent =
        "You completed Day " +
        day +
        " " +
        type +
        " session";
    }

    if (completeDayNumber) {
      completeDayNumber.textContent =
        day;
    }

    if (completeStreak) {
      completeStreak.textContent =
        calculateStreak();
    }
  }

  /* =======================================================
     BACK HOME
  ======================================================= */

  function goHome() {
    const screens = [
      "sessionScreen",
      "completeScreen",
      "certificateScreen"
    ];

    screens.forEach(function (id) {
      const element =
        document.getElementById(id);

      if (element) {
        element.style.display =
          "none";
      }
    });

    const home =
      document.getElementById(
        "homeScreen"
      );

    if (home) {
      home.style.display =
        "block";
    }

    updateAllUI();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /* =======================================================
     CERTIFICATE
  ======================================================= */

  function showCertificate() {
    const completedDays =
      getCompletedDays();

    if (completedDays <
        TOTAL_DAYS) {
      showVIPToast(
        "Complete all 21 days first"
      );

      return;
    }

    const home =
      document.getElementById(
        "homeScreen"
      );

    const certificate =
      document.getElementById(
        "certificateScreen"
      );

    if (home) {
      home.style.display =
        "none";
    }

    if (certificate) {
      certificate.style.display =
        "block";
    }

    const certificateDate =
      document.getElementById(
        "certificateDate"
      );

    if (certificateDate) {
      certificateDate.textContent =
        new Date().toLocaleDateString(
          undefined,
          {
            year: "numeric",
            month: "long",
            day: "numeric"
          }
        );
    }
  }

  /* =======================================================
     RESET JOURNEY
     -------------------------------------------------------
     IMPORTANT:
     VIP NOTES ARE NOT DELETED
  ======================================================= */

  function resetAll() {
    const confirmed =
      window.confirm(
        "Reset your 21-Day Abundance journey?"
      );

    if (!confirmed) return;

    appData =
      createDefaultData();

    saveData(appData);

    loadJournal(
      appData.currentDay
    );

    goHome();

    renderDays();

    updateHome();

    showVIPToast(
      "Journey reset. Important VIP notes are safe"
    );
  }

  /* =======================================================
     UPDATE ALL UI
  ======================================================= */

  function updateAllUI() {
    updateDate();
    updateHome();
    renderDays();

    const activeDay =
      getActiveDay();

    loadJournal(activeDay);

    updateCertificateAvailability();
  }

  function updateCertificateAvailability() {
    const completed =
      getCompletedDays();

    const button =
      document.querySelector(
        "[data-certificate]"
      );

    if (!button) return;

    button.disabled =
      completed < TOTAL_DAYS;
  }

  /* =======================================================
     IMPORTANT VIP
     PREMIUM MOBILE NOTE SYSTEM
  ======================================================= */

  function createVIPId() {
    return (
      "vip_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2, 9)
    );
  }

  /* =======================================================
     ESCAPE HTML
  ======================================================= */

  function escapeVIPHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =======================================================
     FORMAT VIP DATE
  ======================================================= */

  function formatVIPDate(value) {
    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }
    );
  }

  /* =======================================================
     VALID CATEGORY
  ======================================================= */

  function normalizeVIPCategory(
    category
  ) {
    const value =
      String(category || "")
        .trim();

    return VIP_CATEGORIES.includes(
      value
    )
      ? value
      : "Other";
  }

  /* =======================================================
     LOAD VIP NOTES
  ======================================================= */

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
          .map(function (item) {
            const now =
              new Date().toISOString();

            const createdAt =
              item.createdAt &&
              !Number.isNaN(
                new Date(
                  item.createdAt
                ).getTime()
              )
                ? item.createdAt
                : now;

            const updatedAt =
              item.updatedAt &&
              !Number.isNaN(
                new Date(
                  item.updatedAt
                ).getTime()
              )
                ? item.updatedAt
                : createdAt;

            return {
              id:
                String(
                  item.id ||
                  createVIPId()
                ),

              title:
                String(
                  item.title ||
                  "Important Note"
                ),

              category:
                normalizeVIPCategory(
                  item.category
                ),

              note:
                String(
                  item.note || ""
                ),

              pinned:
                Boolean(
                  item.pinned
                ),

              createdAt:
                createdAt,

              updatedAt:
                updatedAt
            };
          })
          .filter(function (item) {
            return (
              item.note.trim() ||
              item.title.trim()
            );
          });
    } catch (error) {
      console.error(
        "Unable to load Important VIP notes",
        error
      );

      importantVIPNotes = [];
    }
  }

  /* =======================================================
     SAVE VIP NOTES
  ======================================================= */

  function saveVIPNotes() {
    try {
      localStorage.setItem(
        VIP_STORAGE_KEY,
        JSON.stringify(
          importantVIPNotes
        )
      );

      return true;
    } catch (error) {
      console.error(
        "Unable to save Important VIP notes",
        error
      );

      showVIPToast(
        "Unable to save note"
      );

      return false;
    }
  }

  /* =======================================================
     VIP CSS
  ======================================================= */

  function injectVIPStyles() {
    if (
      document.getElementById(
        "importantVIPStyles"
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "importantVIPStyles";

    style.textContent = `
      #importantVIPSection {
        margin: 22px 0 30px;
        position: relative;
      }

      .vip-premium-card {
        position: relative;
        overflow: hidden;
        border-radius: 24px;
        padding: 18px;
        background:
          linear-gradient(
            145deg,
            rgba(43, 24, 71, .98),
            rgba(19, 15, 31, .98)
          );
        border: 1px solid rgba(232, 190, 84, .28);
        box-shadow:
          0 18px 50px rgba(0,0,0,.22),
          inset 0 1px 0 rgba(255,255,255,.06);
      }

      .vip-premium-card::before {
        content: "";
        position: absolute;
        width: 180px;
        height: 180px;
        border-radius: 50%;
        right: -90px;
        top: -90px;
        background:
          radial-gradient(
            circle,
            rgba(240,197,77,.22),
            transparent 68%
          );
        pointer-events: none;
      }

      .vip-header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 15px;
      }

      .vip-title-wrap {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .vip-crown {
        width: 46px;
        height: 46px;
        flex: 0 0 46px;
        border-radius: 15px;
        display: grid;
        place-items: center;
        font-size: 23px;
        background:
          linear-gradient(
            135deg,
            #f6d365,
            #c89116
          );
        box-shadow:
          0 8px 22px rgba(212,163,42,.24);
      }

      .vip-heading {
        min-width: 0;
      }

      .vip-heading h3 {
        margin: 0;
        color: #f7df8b;
        font-size: 16px;
        font-weight: 800;
        letter-spacing: .5px;
      }

      .vip-heading p {
        margin: 4px 0 0;
        color: rgba(255,255,255,.65);
        font-size: 12px;
      }

      .vip-add-btn {
        border: 0;
        min-width: 44px;
        height: 44px;
        padding: 0 14px;
        border-radius: 14px;
        cursor: pointer;
        color: #24170a;
        font-size: 20px;
        font-weight: 900;
        background:
          linear-gradient(
            135deg,
            #ffe69a,
            #d9a92e
          );
        box-shadow:
          0 8px 20px rgba(219,170,43,.2);
      }

      .vip-add-btn:active {
        transform: scale(.97);
      }

      .vip-search-wrap {
        position: relative;
        margin-bottom: 15px;
      }

      .vip-search {
        width: 100%;
        box-sizing: border-box;
        height: 46px;
        padding: 0 16px 0 42px;
        border-radius: 15px;
        border: 1px solid rgba(255,255,255,.09);
        outline: none;
        color: #fff;
        background: rgba(255,255,255,.06);
        font-size: 14px;
      }

      .vip-search::placeholder {
        color: rgba(255,255,255,.42);
      }

      .vip-search:focus {
        border-color: rgba(240,197,77,.5);
        box-shadow:
          0 0 0 3px rgba(240,197,77,.08);
      }

      .vip-search-icon {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        opacity: .6;
        pointer-events: none;
      }

      .vip-count {
        color: rgba(255,255,255,.55);
        font-size: 11px;
        margin-bottom: 11px;
      }

      .vip-list {
        display: grid;
        gap: 11px;
      }

      .vip-note-card {
        position: relative;
        overflow: hidden;
        padding: 15px;
        border-radius: 18px;
        background:
          linear-gradient(
            145deg,
            rgba(255,255,255,.075),
            rgba(255,255,255,.035)
          );
        border: 1px solid rgba(255,255,255,.075);
      }

      .vip-note-card.is-pinned {
        border-color:
          rgba(240,197,77,.34);
        box-shadow:
          inset 3px 0 0 #e4b93d;
      }

      .vip-note-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 10px;
      }

      .vip-note-main {
        min-width: 0;
      }

      .vip-note-title {
        color: #fff;
        font-size: 15px;
        font-weight: 800;
        line-height: 1.35;
        word-break: break-word;
      }

      .vip-note-category {
        display: inline-flex;
        margin-top: 7px;
        padding: 4px 8px;
        border-radius: 999px;
        color: #f5dc83;
        background: rgba(240,197,77,.09);
        border: 1px solid rgba(240,197,77,.16);
        font-size: 10px;
        font-weight: 700;
      }

      .vip-note-body {
        margin-top: 11px;
        color: rgba(255,255,255,.78);
        font-size: 13px;
        line-height: 1.65;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .vip-note-date {
        margin-top: 11px;
        color: rgba(255,255,255,.36);
        font-size: 10px;
      }

      .vip-note-actions {
        display: flex;
        gap: 6px;
        flex: 0 0 auto;
      }

      .vip-icon-btn {
        width: 34px;
        height: 34px;
        border: 0;
        border-radius: 11px;
        cursor: pointer;
        color: rgba(255,255,255,.78);
        background: rgba(255,255,255,.07);
      }

      .vip-icon-btn:hover {
        background: rgba(255,255,255,.12);
      }

      .vip-icon-btn.pinned {
        color: #f5d267;
        background: rgba(240,197,77,.11);
      }

      .vip-empty {
        padding: 25px 14px;
        text-align: center;
        border-radius: 18px;
        border: 1px dashed rgba(255,255,255,.12);
        color: rgba(255,255,255,.48);
      }

      .vip-empty-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }

      .vip-empty-title {
        color: rgba(255,255,255,.8);
        font-size: 14px;
        font-weight: 700;
      }

      .vip-empty-text {
        margin-top: 5px;
        font-size: 11px;
      }

      .vip-quick-action {
        position: relative;
        width: 100%;
        margin-top: 13px;
        padding: 14px 15px;
        border: 1px solid rgba(240,197,77,.2);
        border-radius: 17px;
        cursor: pointer;
        text-align: left;
        color: #fff;
        background:
          linear-gradient(
            135deg,
            rgba(240,197,77,.12),
            rgba(137,82,203,.12)
          );
      }

      .vip-quick-action strong {
        display: block;
        color: #f6dc84;
        font-size: 13px;
      }

      .vip-quick-action span {
        display: block;
        margin-top: 3px;
        color: rgba(255,255,255,.48);
        font-size: 10px;
      }

      #importantVIPModal {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: none;
        align-items: flex-end;
        justify-content: center;
        background: rgba(0,0,0,.68);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }

      .vip-modal-sheet {
        width: 100%;
        max-width: 560px;
        max-height: 88vh;
        overflow-y: auto;
        border-radius: 28px 28px 0 0;
        padding: 20px;
        box-sizing: border-box;
        background:
          linear-gradient(
            145deg,
            #21152e,
            #111018
          );
        border-top: 1px solid rgba(240,197,77,.2);
        box-shadow:
          0 -20px 60px rgba(0,0,0,.35);
      }

      .vip-modal-handle {
        width: 42px;
        height: 4px;
        margin: 0 auto 17px;
        border-radius: 999px;
        background: rgba(255,255,255,.18);
      }

      .vip-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 18px;
      }

      .vip-modal-title {
        color: #f6dc84;
        font-size: 18px;
        font-weight: 900;
      }

      .vip-modal-close {
        width: 38px;
        height: 38px;
        border: 0;
        border-radius: 12px;
        cursor: pointer;
        color: #fff;
        background: rgba(255,255,255,.07);
        font-size: 18px;
      }

      .vip-field {
        margin-bottom: 14px;
      }

      .vip-field label {
        display: block;
        margin-bottom: 7px;
        color: rgba(255,255,255,.7);
        font-size: 11px;
        font-weight: 700;
      }

      .vip-field input,
      .vip-field textarea,
      .vip-field select {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 14px;
        outline: none;
        color: #fff;
        background: rgba(255,255,255,.06);
        font-size: 14px;
      }

      .vip-field input,
      .vip-field select {
        height: 48px;
        padding: 0 14px;
      }

      .vip-field textarea {
        min-height: 150px;
        padding: 13px 14px;
        resize: vertical;
        line-height: 1.6;
        font-family: inherit;
      }

      .vip-field select option {
        color: #111;
        background: #fff;
      }

      .vip-field input:focus,
      .vip-field textarea:focus,
      .vip-field select:focus {
        border-color: rgba(240,197,77,.5);
        box-shadow:
          0 0 0 3px rgba(240,197,77,.08);
      }

      .vip-save-main {
        width: 100%;
        min-height: 50px;
        margin-top: 3px;
        border: 0;
        border-radius: 15px;
        cursor: pointer;
        color: #24170a;
        font-weight: 900;
        font-size: 14px;
        background:
          linear-gradient(
            135deg,
            #ffe69a,
            #d5a52c
          );
      }

      .vip-save-main:active {
        transform: scale(.99);
      }

      .vip-cancel-main {
        width: 100%;
        min-height: 46px;
        margin-top: 8px;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 14px;
        cursor: pointer;
        color: rgba(255,255,255,.72);
        background: rgba(255,255,255,.04);
      }

      #importantVIPToast {
        position: fixed;
        left: 50%;
        bottom: 24px;
        z-index: 100001;
        transform:
          translate(-50%, 20px);
        opacity: 0;
        pointer-events: none;
        padding: 11px 15px;
        border-radius: 999px;
        color: #fff;
        background: rgba(22,18,28,.96);
        border: 1px solid rgba(240,197,77,.22);
        box-shadow:
          0 12px 35px rgba(0,0,0,.3);
        font-size: 12px;
        transition:
          opacity .2s ease,
          transform .2s ease;
        white-space: nowrap;
      }

      #importantVIPToast.show {
        opacity: 1;
        transform:
          translate(-50%, 0);
      }

      @media (min-width: 700px) {
        #importantVIPModal {
          align-items: center;
          padding: 20px;
          box-sizing: border-box;
        }

        .vip-modal-sheet {
          border-radius: 26px;
          border: 1px solid rgba(240,197,77,.18);
          max-height: 80vh;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =======================================================
     VIP SECTION
  ======================================================= */

  function createVIPSection() {
    if (
      document.getElementById(
        "importantVIPSection"
      )
    ) {
      return;
    }

    const section =
      document.createElement("section");

    section.id =
      "importantVIPSection";

    section.innerHTML = `
      <div class="vip-premium-card">

        <div class="vip-header">

          <div class="vip-title-wrap">

            <div class="vip-crown">
              👑
            </div>

            <div class="vip-heading">
              <h3>IMPORTANT VIP</h3>
              <p>Your private important notes</p>
            </div>

          </div>

          <button
            type="button"
            class="vip-add-btn"
            id="vipAddButton"
            aria-label="Add Important Note"
          >
            +
          </button>

        </div>

        <div class="vip-search-wrap">

          <span class="vip-search-icon">
            🔎
          </span>

          <input
            id="vipSearchInput"
            class="vip-search"
            type="search"
            placeholder="Search important notes..."
            autocomplete="off"
          />

        </div>

        <div
          id="vipCount"
          class="vip-count"
        >
          0 notes
        </div>

        <div
          id="vipNotesList"
          class="vip-list"
        ></div>

      </div>
    `;

    const quickGrid =
      document.querySelector(
        ".quick-grid"
      );

    const homeScreen =
      document.getElementById(
        "homeScreen"
      );

    if (quickGrid) {
      quickGrid.insertAdjacentElement(
        "afterend",
        section
      );
    } else if (homeScreen) {
      homeScreen.appendChild(section);
    } else {
      document.body.appendChild(section);
    }

    createVIPQuickAction();
  }

  /* =======================================================
     QUICK ACTION
  ======================================================= */

  function createVIPQuickAction() {
    if (
      document.getElementById(
        "vipQuickAction"
      )
    ) {
      return;
    }

    const button =
      document.createElement("button");

    button.type = "button";

    button.id =
      "vipQuickAction";

    button.className =
      "vip-quick-action";

    button.innerHTML = `
      <strong>
        👑 Important VIP Notes
      </strong>
      <span>
        Save important lessons, teacher notes and ideas
      </span>
    `;

    button.addEventListener(
      "click",
      function () {
        openImportantVIP();
      }
    );

    const quickGrid =
      document.querySelector(
        ".quick-grid"
      );

    if (quickGrid) {
      quickGrid.appendChild(button);
    }
  }

  /* =======================================================
     VIP MODAL
  ======================================================= */

  function createVIPModal() {
    if (
      document.getElementById(
        "importantVIPModal"
      )
    ) {
      return;
    }

    const modal =
      document.createElement("div");

    modal.id =
      "importantVIPModal";

    modal.innerHTML = `
      <div
        class="vip-modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vipModalTitle"
      >

        <div class="vip-modal-handle"></div>

        <div class="vip-modal-header">

          <div
            id="vipModalTitle"
            class="vip-modal-title"
          >
            Add Important Note
          </div>

          <button
            type="button"
            id="vipModalClose"
            class="vip-modal-close"
            aria-label="Close"
          >
            ×
          </button>

        </div>

        <div class="vip-field">

          <label for="vipTitleInput">
            Note Title
          </label>

          <input
            id="vipTitleInput"
            type="text"
            maxlength="100"
            placeholder="Example: Teacher's Important Lesson"
            autocomplete="off"
          />

        </div>

        <div class="vip-field">

          <label for="vipCategoryInput">
            Category
          </label>

          <select
            id="vipCategoryInput"
          >
            ${VIP_CATEGORIES.map(function (category) {
              return `
                <option value="${escapeVIPHTML(category)}">
                  ${escapeVIPHTML(category)}
                </option>
              `;
            }).join("")}
          </select>

        </div>

        <div class="vip-field">

          <label for="vipNoteInput">
            Important Note
          </label>

          <textarea
            id="vipNoteInput"
            maxlength="5000"
            placeholder="Write your important note here..."
          ></textarea>

        </div>

        <button
          type="button"
          id="vipSaveButton"
          class="vip-save-main"
        >
          Save Important Note
        </button>

        <button
          type="button"
          id="vipCancelButton"
          class="vip-cancel-main"
        >
          Cancel
        </button>

      </div>
    `;

    document.body.appendChild(modal);

    const close =
      document.getElementById(
        "vipModalClose"
      );

    const cancel =
      document.getElementById(
        "vipCancelButton"
      );

    const save =
      document.getElementById(
        "vipSaveButton"
      );

    const add =
      document.getElementById(
        "vipAddButton"
      );

    if (close) {
      close.addEventListener(
        "click",
        closeVIPModal
      );
    }

    if (cancel) {
      cancel.addEventListener(
        "click",
        closeVIPModal
      );
    }

    if (save) {
      save.addEventListener(
        "click",
        saveVIPNote
      );
    }

    if (add) {
      add.addEventListener(
        "click",
        function () {
          openImportantVIP();
        }
      );
    }

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

    document.addEventListener(
      "keydown",
      function (event) {
        if (
          event.key === "Escape" &&
          modal.style.display === "flex"
        ) {
          closeVIPModal();
        }
      }
    );
  }

  /* =======================================================
     OPEN VIP MODAL
  ======================================================= */

  function openImportantVIP() {
    createVIPModal();

    vipEditingId = null;

    const modal =
      document.getElementById(
        "importantVIPModal"
      );

    const title =
      document.getElementById(
        "vipModalTitle"
      );

    const titleInput =
      document.getElementById(
        "vipTitleInput"
      );

    const categoryInput =
      document.getElementById(
        "vipCategoryInput"
      );

    const noteInput =
      document.getElementById(
        "vipNoteInput"
      );

    const saveButton =
      document.getElementById(
        "vipSaveButton"
      );

    if (title) {
      title.textContent =
        "Add Important Note";
    }

    if (titleInput) {
      titleInput.value = "";
    }

    if (categoryInput) {
      categoryInput.value =
        "Teacher";
    }

    if (noteInput) {
      noteInput.value = "";
    }

    if (saveButton) {
      saveButton.textContent =
        "Save Important Note";
    }

    if (!modal) return;

    previousBodyOverflow =
      document.body.style.overflow;

    modal.style.display =
      "flex";

    document.body.style.overflow =
      "hidden";

    setTimeout(function () {
      if (titleInput) {
        titleInput.focus();
      }
    }, 100);
  }

  /* =======================================================
     EDIT VIP
  ======================================================= */

  function editVIPNote(id) {
    const note =
      importantVIPNotes.find(
        function (item) {
          return item.id === id;
        }
      );

    if (!note) {
      showVIPToast(
        "Note not found"
      );

      return;
    }

    createVIPModal();

    vipEditingId = id;

    const modal =
      document.getElementById(
        "importantVIPModal"
      );

    const title =
      document.getElementById(
        "vipModalTitle"
      );

    const titleInput =
      document.getElementById(
        "vipTitleInput"
      );

    const categoryInput =
      document.getElementById(
        "vipCategoryInput"
      );

    const noteInput =
      document.getElementById(
        "vipNoteInput"
      );

    const saveButton =
      document.getElementById(
        "vipSaveButton"
      );

    if (title) {
      title.textContent =
        "Edit Important Note";
    }

    if (titleInput) {
      titleInput.value =
        note.title;
    }

    if (categoryInput) {
      categoryInput.value =
        normalizeVIPCategory(
          note.category
        );
    }

    if (noteInput) {
      noteInput.value =
        note.note;
    }

    if (saveButton) {
      saveButton.textContent =
        "Update Important Note";
    }

    if (!modal) return;

    previousBodyOverflow =
      document.body.style.overflow;

    modal.style.display =
      "flex";

    document.body.style.overflow =
      "hidden";

    setTimeout(function () {
      if (titleInput) {
        titleInput.focus();
      }
    }, 100);
  }

  /* =======================================================
     CLOSE VIP MODAL
  ======================================================= */

  function closeVIPModal() {
    const modal =
      document.getElementById(
        "importantVIPModal"
      );

    if (modal) {
      modal.style.display =
        "none";
    }

    document.body.style.overflow =
      previousBodyOverflow;

    vipEditingId = null;
  }

  /* =======================================================
     SAVE / UPDATE VIP
  ======================================================= */

  function saveVIPNote() {
    const titleInput =
      document.getElementById(
        "vipTitleInput"
      );

    const categoryInput =
      document.getElementById(
        "vipCategoryInput"
      );

    const noteInput =
      document.getElementById(
        "vipNoteInput"
      );

    const title =
      titleInput
        ? titleInput.value.trim()
        : "";

    const category =
      categoryInput
        ? normalizeVIPCategory(
            categoryInput.value
          )
        : "Other";

    const noteText =
      noteInput
        ? noteInput.value.trim()
        : "";

    if (!title && !noteText) {
      showVIPToast(
        "Please enter a note"
      );

      if (noteInput) {
        noteInput.focus();
      }

      return;
    }

    const now =
      new Date().toISOString();

    const wasEditing =
      Boolean(vipEditingId);

    if (wasEditing) {
      const index =
        importantVIPNotes.findIndex(
          function (item) {
            return (
              item.id ===
              vipEditingId
            );
          }
        );

      if (index === -1) {
        showVIPToast(
          "Note not found"
        );

        closeVIPModal();

        return;
      }

      importantVIPNotes[index] = {
        ...importantVIPNotes[index],
        title:
          title ||
          "Important Note",
        category:
          category,
        note:
          noteText,
        updatedAt:
          now
      };
    } else {
      importantVIPNotes.unshift({
        id:
          createVIPId(),

        title:
          title ||
          "Important Note",

        category:
          category,

        note:
          noteText,

        pinned:
          false,

        createdAt:
          now,

        updatedAt:
          now
      });
    }

    saveVIPNotes();

    closeVIPModal();

    renderVIPNotes();

    showVIPToast(
      wasEditing
        ? "✓ Important Note updated"
        : "✓ Important Note saved"
    );

    vipEditingId = null;
  }

  /* =======================================================
     DELETE VIP
  ======================================================= */

  function deleteVIPNote(id) {
    const note =
      importantVIPNotes.find(
        function (item) {
          return item.id === id;
        }
      );

    if (!note) {
      showVIPToast(
        "Note not found"
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Delete this important note?"
      );

    if (!confirmed) {
      return;
    }

    importantVIPNotes =
      importantVIPNotes.filter(
        function (item) {
          return item.id !== id;
        }
      );

    saveVIPNotes();

    renderVIPNotes();

    showVIPToast(
      "Important Note deleted"
    );
  }

  /* =======================================================
     PIN VIP
  ======================================================= */

  function toggleVIPPin(id) {
    const note =
      importantVIPNotes.find(
        function (item) {
          return item.id === id;
        }
      );

    if (!note) {
      showVIPToast(
        "Note not found"
      );

      return;
    }

    note.pinned =
      !note.pinned;

    note.updatedAt =
      new Date().toISOString();

    saveVIPNotes();

    renderVIPNotes();

    showVIPToast(
      note.pinned
        ? "📌 Note pinned"
        : "Note unpinned"
    );
  }

  /* =======================================================
     SEARCH VIP
  ======================================================= */

  function getVIPSearchValue() {
    const search =
      document.getElementById(
        "vipSearchInput"
      );

    if (!search) {
      return "";
    }

    return search.value
      .trim()
      .toLowerCase();
  }

  /* =======================================================
     RENDER VIP
  ======================================================= */

  function renderVIPNotes() {
    const list =
      document.getElementById(
        "vipNotesList"
      );

    const count =
      document.getElementById(
        "vipCount"
      );

    if (!list) return;

    const search =
      getVIPSearchValue();

    let notes =
      importantVIPNotes.filter(
        function (item) {
          if (!search) {
            return true;
          }

          const combined =
            (
              item.title +
              " " +
              item.note +
              " " +
              item.category
            ).toLowerCase();

          return combined.includes(
            search
          );
        }
      );

    notes.sort(function (a, b) {
      if (
        Boolean(a.pinned) !==
        Boolean(b.pinned)
      ) {
        return a.pinned ? -1 : 1;
      }

      const aDate =
        new Date(
          a.updatedAt ||
          a.createdAt
        ).getTime();

      const bDate =
        new Date(
          b.updatedAt ||
          b.createdAt
        ).getTime();

      return bDate - aDate;
    });

    if (count) {
      count.textContent =
        notes.length +
        (
          notes.length === 1
            ? " note"
            : " notes"
        );
    }

    if (!notes.length) {
      list.innerHTML = `
        <div class="vip-empty">

          <div class="vip-empty-icon">
            👑
          </div>

          <div class="vip-empty-title">
            ${
              search
                ? "No notes found"
                : "No Important VIP notes yet"
            }
          </div>

          <div class="vip-empty-text">
            ${
              search
                ? "Try another search"
                : "Save important lessons, ideas or notes here"
            }
          </div>

        </div>
      `;

      return;
    }

    list.innerHTML =
      notes.map(function (item) {
        const safeId =
          escapeVIPHTML(
            item.id
          );

        return `
          <article
            class="vip-note-card ${
              item.pinned
                ? "is-pinned"
                : ""
            }"
          >

            <div class="vip-note-top">

              <div class="vip-note-main">

                <div class="vip-note-title">
                  ${escapeVIPHTML(
                    item.title
                  )}
                </div>

                <span class="vip-note-category">
                  ${escapeVIPHTML(
                    item.category
                  )}
                </span>

              </div>

              <div class="vip-note-actions">

                <button
                  type="button"
                  class="vip-icon-btn ${
                    item.pinned
                      ? "pinned"
                      : ""
                  }"
                  data-vip-action="pin"
                  data-vip-id="${safeId}"
                  aria-label="Pin"
                >
                  ${
                    item.pinned
                      ? "📌"
                      : "📍"
                  }
                </button>

                <button
                  type="button"
                  class="vip-icon-btn"
                  data-vip-action="edit"
                  data-vip-id="${safeId}"
                  aria-label="Edit"
                >
                  ✏️
                </button>

                <button
                  type="button"
                  class="vip-icon-btn"
                  data-vip-action="delete"
                  data-vip-id="${safeId}"
                  aria-label="Delete"
                >
                  🗑️
                </button>

              </div>

            </div>

            <div class="vip-note-body">
              ${escapeVIPHTML(
                item.note
              )}
            </div>

            <div class="vip-note-date">
              ${
                item.pinned
                  ? "📌 Pinned • "
                  : ""
              }
              Updated
              ${escapeVIPHTML(
                formatVIPDate(
                  item.updatedAt
                )
              )}
            </div>

          </article>
        `;
      }).join("");
  }

  /* =======================================================
     VIP EVENT DELEGATION
  ======================================================= */

  function setupVIPEvents() {
    const list =
      document.getElementById(
        "vipNotesList"
      );

    if (list) {
      list.addEventListener(
        "click",
        function (event) {
          const button =
            event.target.closest(
              "[data-vip-action]"
            );

          if (!button) return;

          const action =
            button.getAttribute(
              "data-vip-action"
            );

          const id =
            button.getAttribute(
              "data-vip-id"
            );

          if (!id) return;

          if (action === "pin") {
            toggleVIPPin(id);
          }

          if (action === "edit") {
            editVIPNote(id);
          }

          if (action === "delete") {
            deleteVIPNote(id);
          }
        }
      );
    }

    const search =
      document.getElementById(
        "vipSearchInput"
      );

    if (search) {
      search.addEventListener(
        "input",
        function () {
          renderVIPNotes();
        }
      );
    }
  }

  /* =======================================================
     VIP TOAST
  ======================================================= */

  function showVIPToast(message) {
    let toast =
      document.getElementById(
        "importantVIPToast"
      );

    if (!toast) {
      toast =
        document.createElement(
          "div"
        );

      toast.id =
        "importantVIPToast";

      document.body.appendChild(
        toast
      );
    }

    toast.textContent =
      String(message || "");

    toast.classList.add("show");

    clearTimeout(
      toast._timer
    );

    toast._timer =
      setTimeout(
        function () {
          toast.classList.remove(
            "show"
          );
        },
        2200
      );
  }

  /* =======================================================
     INIT IMPORTANT VIP
  ======================================================= */

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

  /* =======================================================
     KEYBOARD
  ======================================================= */

  function setupKeyboard() {
    document.addEventListener(
      "keydown",
      function (event) {
        const target =
          event.target;

        const tag =
          target &&
          target.tagName
            ? target.tagName.toLowerCase()
            : "";

        if (
          tag === "input" ||
          tag === "textarea" ||
          tag === "select"
        ) {
          return;
        }

        const session =
          document.getElementById(
            "sessionScreen"
          );

        if (
          session &&
          session.style.display !==
            "none"
        ) {
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
        }
      }
    );
  }

  /* =======================================================
     BUTTON BINDING
  ======================================================= */

  function bindButtons() {
    const morningButton =
      document.getElementById(
        "morningButton"
      );

    const nightButton =
      document.getElementById(
        "nightButton"
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

    if (morningButton) {
      morningButton.addEventListener(
        "click",
        function () {
          startSession(
            "morning"
          );
        }
      );
    }

    if (nightButton) {
      nightButton.addEventListener(
        "click",
        function () {
          startSession(
            "night"
          );
        }
      );
    }

    if (doneButton) {
      doneButton.addEventListener(
        "click",
        function () {
          finishSession();
        }
      );
    }

    if (previousButton) {
      previousButton.addEventListener(
        "click",
        function () {
          previousAffirmation();
        }
      );
    }

    if (nextButton) {
      nextButton.addEventListener(
        "click",
        function () {
          nextAffirmation();
        }
      );
    }

    document
      .querySelectorAll(
        "[data-home]"
      )
      .forEach(function (button) {
        button.addEventListener(
          "click",
          goHome
        );
      });

    document
      .querySelectorAll(
        "[data-reset]"
      )
      .forEach(function (button) {
        button.addEventListener(
          "click",
          resetAll
        );
      });

    document
      .querySelectorAll(
        "[data-certificate]"
      )
      .forEach(function (button) {
        button.addEventListener(
          "click",
          showCertificate
        );
      });

    document
      .querySelectorAll(
        "[data-save-journal]"
      )
      .forEach(function (button) {
        button.addEventListener(
          "click",
          saveJournal
        );
      });
  }

  /* =======================================================
     GLOBAL FUNCTIONS
     -------------------------------------------------------
     Compatible with existing HTML onclick handlers
  ======================================================= */

  window.startMorning =
    function () {
      startSession(
        "morning"
      );
    };

  window.startNight =
    function () {
      startSession(
        "night"
      );
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

  /* =======================================================
     INIT APP
  ======================================================= */

  function initApp() {
    if (appInitialized) {
      return;
    }

    appInitialized = true;

    appData =
      loadData();

    bindButtons();

    setupJournalAutoSave();

    setupKeyboard();

    updateAllUI();

    initImportantVIP();
  }

  /* =======================================================
     DOM READY
  ======================================================= */

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

})();
