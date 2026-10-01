/* =========================================================
   AUNG 21-DAY ABUNDANCE
   IMPORTANT VIP
   PREMIUM MOBILE NOTE SYSTEM
   ---------------------------------------------------------
   Features:
   - Add Important Notes
   - Edit / Update
   - Delete
   - Pin / Unpin
   - Search
   - Category
   - Teacher Notes
   - LocalStorage
   - Mobile Bottom Sheet
   - Premium UI
   - Safe HTML Rendering
   - Duplicate Script Protection
========================================================= */

(function () {
  "use strict";

  /* =======================================================
     CONFIG
  ======================================================= */

  const VIP_STORAGE_KEY = "aung21_important_vip_v1";

  const VIP_CATEGORIES = [
    "Teacher",
    "Mindset",
    "Money",
    "Business",
    "Personal",
    "Other"
  ];

  let importantVIPNotes = [];
  let vipEditingId = null;
  let previousBodyOverflow = "";


  /* =======================================================
     STORAGE
  ======================================================= */

  function createVIPId() {
    return (
      "vip_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 9)
    );
  }


  function isValidDate(value) {
    if (!value) return false;

    const date = new Date(value);

    return !Number.isNaN(date.getTime());
  }


  function normalizeVIPNote(item) {
    if (!item || typeof item !== "object") {
      return null;
    }

    const title =
      typeof item.title === "string"
        ? item.title.trim()
        : "";

    const note =
      typeof item.note === "string"
        ? item.note.trim()
        : "";

    if (!note) {
      return null;
    }

    const category =
      VIP_CATEGORIES.includes(item.category)
        ? item.category
        : "Other";

    const createdAt =
      isValidDate(item.createdAt)
        ? item.createdAt
        : new Date().toISOString();

    const updatedAt =
      isValidDate(item.updatedAt)
        ? item.updatedAt
        : createdAt;

    return {
      id:
        typeof item.id === "string" && item.id
          ? item.id
          : createVIPId(),

      title:
        title || "Important Note",

      category,

      note,

      pinned:
        Boolean(item.pinned),

      createdAt,

      updatedAt
    };
  }


  function loadVIPNotes() {
    try {
      const raw =
        localStorage.getItem(VIP_STORAGE_KEY);

      if (!raw) {
        importantVIPNotes = [];
        return;
      }

      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        importantVIPNotes = [];
        return;
      }

      importantVIPNotes = parsed
        .map(normalizeVIPNote)
        .filter(Boolean);

    } catch (error) {
      console.warn(
        "IMPORTANT VIP load error:",
        error
      );

      importantVIPNotes = [];
    }
  }


  function saveVIPNotes() {
    try {
      localStorage.setItem(
        VIP_STORAGE_KEY,
        JSON.stringify(importantVIPNotes)
      );

      return true;

    } catch (error) {
      console.warn(
        "IMPORTANT VIP save error:",
        error
      );

      showVIPToast(
        "Unable to save note"
      );

      return false;
    }
  }


  /* =======================================================
     HELPERS
  ======================================================= */

  function escapeVIPHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function formatVIPDate(value) {
    try {
      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
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

    } catch (error) {
      return "";
    }
  }


  function getCategoryIcon(category) {
    const icons = {
      Teacher: "🎓",
      Mindset: "🧠",
      Money: "💰",
      Business: "💼",
      Personal: "❤️",
      Other: "📌"
    };

    return icons[category] || "📌";
  }


  function getCategoryColorClass(category) {
    return (
      "vip-category-" +
      String(category || "Other")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
    );
  }


  /* =======================================================
     CSS
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

      /* ================================================
         IMPORTANT VIP
      ================================================ */

      #importantVIPSection {
        width: 100%;
        margin: 18px 0 24px;
        box-sizing: border-box;
      }

      .vip-main-card {
        position: relative;
        overflow: hidden;
        border-radius: 24px;
        padding: 18px;
        background:
          linear-gradient(
            145deg,
            rgba(38, 25, 61, 0.98),
            rgba(19, 16, 31, 0.98)
          );
        border: 1px solid rgba(255, 215, 100, 0.20);
        box-shadow:
          0 16px 45px rgba(0,0,0,.20),
          inset 0 1px 0 rgba(255,255,255,.04);
      }

      .vip-main-card::before {
        content: "";
        position: absolute;
        width: 180px;
        height: 180px;
        right: -90px;
        top: -90px;
        border-radius: 50%;
        background:
          radial-gradient(
            circle,
            rgba(255, 206, 84, .22),
            transparent 68%
          );
        pointer-events: none;
      }

      .vip-header {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
      }

      .vip-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .vip-crown {
        width: 46px;
        height: 46px;
        flex: 0 0 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 15px;
        font-size: 23px;
        background:
          linear-gradient(
            145deg,
            #ffd76a,
            #b87b12
          );
        box-shadow:
          0 8px 20px rgba(231, 172, 45, .24);
      }

      .vip-heading {
        min-width: 0;
      }

      .vip-heading-title {
        margin: 0;
        color: #fff;
        font-size: 17px;
        font-weight: 800;
        letter-spacing: .3px;
      }

      .vip-heading-subtitle {
        margin-top: 4px;
        color: rgba(255,255,255,.58);
        font-size: 11px;
        line-height: 1.4;
      }

      .vip-add-top {
        border: 0;
        min-width: 42px;
        height: 42px;
        padding: 0 13px;
        border-radius: 14px;
        cursor: pointer;
        color: #1d1405;
        font-size: 19px;
        font-weight: 900;
        background:
          linear-gradient(
            135deg,
            #ffe59a,
            #e8b53d
          );
        box-shadow:
          0 7px 18px rgba(222,171,55,.20);
      }

      .vip-search-wrap {
        position: relative;
        z-index: 2;
        margin-bottom: 14px;
      }

      .vip-search-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 15px;
        opacity: .55;
        pointer-events: none;
      }

      #vipSearchInput {
        width: 100%;
        height: 46px;
        box-sizing: border-box;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,.08);
        outline: none;
        padding: 0 14px 0 40px;
        color: #fff;
        background: rgba(255,255,255,.055);
        font-size: 13px;
      }

      #vipSearchInput::placeholder {
        color: rgba(255,255,255,.38);
      }

      #vipSearchInput:focus {
        border-color: rgba(255,214,102,.45);
        background: rgba(255,255,255,.075);
      }

      .vip-notes-list {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
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
            rgba(255,255,255,.065),
            rgba(255,255,255,.025)
          );
        border: 1px solid rgba(255,255,255,.075);
      }

      .vip-note-card.is-pinned {
        border-color:
          rgba(255,211,89,.32);
        box-shadow:
          0 8px 25px rgba(231,178,49,.08);
      }

      .vip-note-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
      }

      .vip-note-title-wrap {
        min-width: 0;
        flex: 1;
      }

      .vip-note-title {
        margin: 0;
        color: #fff;
        font-size: 14px;
        font-weight: 800;
        line-height: 1.35;
        word-break: break-word;
      }

      .vip-note-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        margin-top: 7px;
      }

      .vip-category {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 5px 8px;
        border-radius: 999px;
        color: #f6e5b0;
        background: rgba(255,207,83,.09);
        border: 1px solid rgba(255,207,83,.15);
        font-size: 10px;
        font-weight: 700;
      }

      .vip-date {
        color: rgba(255,255,255,.38);
        font-size: 10px;
      }

      .vip-pin-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
        border-radius: 9px;
        background: rgba(255,211,89,.10);
        font-size: 12px;
      }

      .vip-note-body {
        margin-top: 12px;
        color: rgba(255,255,255,.82);
        font-size: 13px;
        line-height: 1.65;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .vip-note-actions {
        display: flex;
        gap: 7px;
        margin-top: 13px;
      }

      .vip-action-btn {
        min-height: 34px;
        padding: 0 11px;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 10px;
        cursor: pointer;
        color: rgba(255,255,255,.78);
        background: rgba(255,255,255,.045);
        font-size: 11px;
        font-weight: 700;
      }

      .vip-action-btn:hover {
        background: rgba(255,255,255,.08);
      }

      .vip-action-btn.vip-pin-active {
        color: #f8d77a;
        border-color: rgba(255,215,100,.20);
      }

      .vip-action-btn.vip-delete {
        color: #ff9c9c;
      }

      .vip-empty {
        padding: 26px 16px;
        text-align: center;
        border-radius: 17px;
        border: 1px dashed rgba(255,255,255,.10);
        background: rgba(255,255,255,.025);
      }

      .vip-empty-icon {
        font-size: 31px;
        margin-bottom: 8px;
      }

      .vip-empty-title {
        color: rgba(255,255,255,.82);
        font-size: 13px;
        font-weight: 800;
      }

      .vip-empty-text {
        margin-top: 5px;
        color: rgba(255,255,255,.40);
        font-size: 11px;
        line-height: 1.5;
      }

      .vip-add-main {
        position: relative;
        z-index: 2;
        width: 100%;
        height: 46px;
        margin-top: 14px;
        border: 0;
        border-radius: 14px;
        cursor: pointer;
        color: #211604;
        font-size: 13px;
        font-weight: 900;
        background:
          linear-gradient(
            135deg,
            #ffe79c,
            #d9a62f
          );
      }

      /* ================================================
         QUICK ACTION
      ================================================ */

      .vip-quick-action {
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        min-height: 66px;
        margin-top: 12px;
        padding: 12px 14px;
        border: 1px solid rgba(255,211,83,.17);
        border-radius: 18px;
        cursor: pointer;
        text-align: left;
        color: #fff;
        background:
          linear-gradient(
            135deg,
            rgba(81,50,122,.70),
            rgba(42,29,63,.82)
          );
      }

      .vip-quick-icon {
        width: 42px;
        height: 42px;
        flex: 0 0 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 13px;
        font-size: 20px;
        background:
          linear-gradient(
            135deg,
            #ffe69b,
            #bd831b
          );
      }

      .vip-quick-text {
        min-width: 0;
        flex: 1;
      }

      .vip-quick-title {
        font-size: 13px;
        font-weight: 800;
      }

      .vip-quick-sub {
        margin-top: 3px;
        color: rgba(255,255,255,.47);
        font-size: 10px;
      }

      .vip-quick-arrow {
        font-size: 19px;
        opacity: .55;
      }

      /* ================================================
         MODAL / BOTTOM SHEET
      ================================================ */

      #vipModal {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: none;
        align-items: flex-end;
        justify-content: center;
        padding: 0;
        background: rgba(0,0,0,.64);
        backdrop-filter: blur(7px);
        -webkit-backdrop-filter: blur(7px);
      }

      #vipModal.vip-modal-open {
        display: flex;
      }

      .vip-sheet {
        width: 100%;
        max-width: 620px;
        max-height: 92vh;
        overflow-y: auto;
        box-sizing: border-box;
        padding:
          10px
          18px
          calc(20px + env(safe-area-inset-bottom));
        border-radius: 28px 28px 0 0;
        background:
          linear-gradient(
            180deg,
            #21172d,
            #120f18
          );
        border-top: 1px solid rgba(255,215,100,.18);
        box-shadow:
          0 -20px 60px rgba(0,0,0,.38);
        animation:
          vipSheetUp .22s ease-out;
      }

      @keyframes vipSheetUp {
        from {
          transform: translateY(35px);
          opacity: .5;
        }

        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .vip-sheet-handle {
        width: 44px;
        height: 4px;
        margin: 0 auto 17px;
        border-radius: 999px;
        background: rgba(255,255,255,.18);
      }

      .vip-modal-title {
        color: #fff;
        font-size: 18px;
        font-weight: 900;
        margin-bottom: 5px;
      }

      .vip-modal-subtitle {
        color: rgba(255,255,255,.43);
        font-size: 11px;
        margin-bottom: 18px;
      }

      .vip-field {
        margin-bottom: 13px;
      }

      .vip-field-label {
        display: block;
        margin-bottom: 7px;
        color: rgba(255,255,255,.68);
        font-size: 11px;
        font-weight: 800;
      }

      .vip-field input,
      .vip-field select,
      .vip-field textarea {
        width: 100%;
        box-sizing: border-box;
        color: #fff;
        background: rgba(255,255,255,.055);
        border: 1px solid rgba(255,255,255,.09);
        border-radius: 14px;
        outline: none;
        font-size: 13px;
        font-family: inherit;
      }

      .vip-field input,
      .vip-field select {
        height: 46px;
        padding: 0 13px;
      }

      .vip-field textarea {
        min-height: 150px;
        resize: vertical;
        padding: 12px 13px;
        line-height: 1.6;
      }

      .vip-field input:focus,
      .vip-field select:focus,
      .vip-field textarea:focus {
        border-color: rgba(255,215,100,.40);
        background: rgba(255,255,255,.075);
      }

      .vip-field select option {
        background: #1e1728;
        color: #fff;
      }

      .vip-modal-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 9px;
        margin-top: 17px;
      }

      .vip-modal-btn {
        height: 48px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,.08);
        cursor: pointer;
        font-size: 13px;
        font-weight: 900;
      }

      .vip-cancel-btn {
        color: rgba(255,255,255,.68);
        background: rgba(255,255,255,.055);
      }

      .vip-save-btn {
        color: #211604;
        border: 0;
        background:
          linear-gradient(
            135deg,
            #ffe79c,
            #dca932
          );
      }

      /* ================================================
         TOAST
      ================================================ */

      #vipToast {
        position: fixed;
        left: 50%;
        bottom:
          calc(
            24px +
            env(safe-area-inset-bottom)
          );
        z-index: 100000;
        transform:
          translate(-50%, 20px);
        opacity: 0;
        pointer-events: none;
        padding: 11px 15px;
        border-radius: 13px;
        color: #fff;
        background: rgba(24,19,31,.94);
        border: 1px solid rgba(255,215,100,.20);
        box-shadow:
          0 12px 30px rgba(0,0,0,.30);
        font-size: 12px;
        font-weight: 700;
        transition:
          opacity .2s ease,
          transform .2s ease;
        white-space: nowrap;
      }

      #vipToast.vip-toast-show {
        opacity: 1;
        transform:
          translate(-50%, 0);
      }

      /* ================================================
         DESKTOP
      ================================================ */

      @media (min-width: 700px) {

        #vipModal {
          align-items: center;
          padding: 20px;
        }

        .vip-sheet {
          border-radius: 28px;
          max-height: 88vh;
          border: 1px solid rgba(255,215,100,.16);
        }

      }

    `;

    document.head.appendChild(style);
  }


  /* =======================================================
     SECTION
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

      <div class="vip-main-card">

        <div class="vip-header">

          <div class="vip-header-left">

            <div class="vip-crown">
              👑
            </div>

            <div class="vip-heading">

              <h2 class="vip-heading-title">
                IMPORTANT VIP
              </h2>

              <div class="vip-heading-subtitle">
                Your most important notes, lessons & reminders
              </div>

            </div>

          </div>

          <button
            type="button"
            class="vip-add-top"
            id="vipTopAddButton"
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
            type="search"
            placeholder="Search important notes..."
            autocomplete="off"
          />

        </div>


        <div
          id="vipNotesList"
          class="vip-notes-list"
        ></div>


        <button
          type="button"
          class="vip-add-main"
          id="vipMainAddButton"
        >
          ＋ Add Important Note
        </button>

      </div>

    `;


    const quickGrid =
      document.querySelector(
        ".quick-grid"
      );


    if (quickGrid) {

      quickGrid.insertAdjacentElement(
        "afterend",
        section
      );

      createVIPQuickAction(
        quickGrid
      );

    } else {

      const homeScreen =
        document.getElementById(
          "homeScreen"
        );

      if (homeScreen) {

        homeScreen.appendChild(
          section
        );

      } else {

        document.body.appendChild(
          section
        );

      }

    }


    document
      .getElementById(
        "vipTopAddButton"
      )
      ?.addEventListener(
        "click",
        function () {
          openImportantVIP();
        }
      );


    document
      .getElementById(
        "vipMainAddButton"
      )
      ?.addEventListener(
        "click",
        function () {
          openImportantVIP();
        }
      );


    document
      .getElementById(
        "vipSearchInput"
      )
      ?.addEventListener(
        "input",
        function () {
          renderVIPNotes();
        }
      );


    renderVIPNotes();
  }


  /* =======================================================
     QUICK ACTION
  ======================================================= */

  function createVIPQuickAction(
    quickGrid
  ) {

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

      <div class="vip-quick-icon">
        👑
      </div>

      <div class="vip-quick-text">

        <div class="vip-quick-title">
          Important VIP
        </div>

        <div class="vip-quick-sub">
          Save important lessons, ideas & reminders
        </div>

      </div>

      <div class="vip-quick-arrow">
        ›
      </div>

    `;


    button.addEventListener(
      "click",
      function () {
        openImportantVIP();
      }
    );


    quickGrid.appendChild(
      button
    );
  }


  /* =======================================================
     MODAL
  ======================================================= */

  function createVIPModal() {

    if (
      document.getElementById(
        "vipModal"
      )
    ) {
      return;
    }


    const modal =
      document.createElement("div");

    modal.id =
      "vipModal";

    modal.innerHTML = `

      <div
        class="vip-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vipModalTitle"
      >

        <div class="vip-sheet-handle"></div>

        <div
          id="vipModalTitle"
          class="vip-modal-title"
        >
          Add Important Note
        </div>

        <div class="vip-modal-subtitle">
          Keep the lessons and ideas that matter most
        </div>


        <div class="vip-field">

          <label
            class="vip-field-label"
            for="vipTitleInput"
          >
            NOTE TITLE
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

          <label
            class="vip-field-label"
            for="vipCategoryInput"
          >
            CATEGORY
          </label>

          <select
            id="vipCategoryInput"
          >

            ${VIP_CATEGORIES.map(function (category) {

              return `
                <option value="${escapeVIPHTML(category)}">
                  ${getCategoryIcon(category)}
                  ${escapeVIPHTML(category)}
                </option>
              `;

            }).join("")}

          </select>

        </div>


        <div class="vip-field">

          <label
            class="vip-field-label"
            for="vipNoteInput"
          >
            IMPORTANT NOTE
          </label>

          <textarea
            id="vipNoteInput"
            maxlength="5000"
            placeholder="Write your important lesson, idea, reminder or message here..."
          ></textarea>

        </div>


        <div class="vip-modal-actions">

          <button
            type="button"
            class="vip-modal-btn vip-cancel-btn"
            id="vipCancelButton"
          >
            Cancel
          </button>

          <button
            type="button"
            class="vip-modal-btn vip-save-btn"
            id="vipSaveButton"
          >
            Save Note
          </button>

        </div>

      </div>

    `;


    document.body.appendChild(
      modal
    );


    document
      .getElementById(
        "vipCancelButton"
      )
      ?.addEventListener(
        "click",
        function () {
          closeVIPModal();
        }
      );


    document
      .getElementById(
        "vipSaveButton"
      )
      ?.addEventListener(
        "click",
        function () {
          saveVIPNote();
        }
      );


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
          modal.classList.contains(
            "vip-modal-open"
          )
        ) {
          closeVIPModal();
        }

      }
    );
  }


  /* =======================================================
     OPEN
  ======================================================= */

  function openImportantVIP() {

    createVIPModal();

    const modal =
      document.getElementById(
        "vipModal"
      );

    if (!modal) {
      return;
    }


    vipEditingId = null;


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

    const modalTitle =
      document.getElementById(
        "vipModalTitle"
      );

    const saveButton =
      document.getElementById(
        "vipSaveButton"
      );


    if (modalTitle) {
      modalTitle.textContent =
        "Add Important Note";
    }


    if (saveButton) {
      saveButton.textContent =
        "Save Note";
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


    modal.classList.add(
      "vip-modal-open"
    );


    previousBodyOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";


    setTimeout(function () {

      titleInput?.focus();

    }, 120);
  }


  /* =======================================================
     EDIT
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


    const modal =
      document.getElementById(
        "vipModal"
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

    const modalTitle =
      document.getElementById(
        "vipModalTitle"
      );

    const saveButton =
      document.getElementById(
        "vipSaveButton"
      );


    vipEditingId = id;


    if (modalTitle) {
      modalTitle.textContent =
        "Edit Important Note";
    }


    if (saveButton) {
      saveButton.textContent =
        "Update Note";
    }


    if (titleInput) {
      titleInput.value =
        note.title || "";
    }


    if (categoryInput) {
      categoryInput.value =
        VIP_CATEGORIES.includes(
          note.category
        )
          ? note.category
          : "Other";
    }


    if (noteInput) {
      noteInput.value =
        note.note || "";
    }


    modal?.classList.add(
      "vip-modal-open"
    );


    previousBodyOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";


    setTimeout(function () {

      noteInput?.focus();

    }, 120);
  }


  /* =======================================================
     SAVE / UPDATE
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
      titleInput?.value.trim() || "";

    const category =
      categoryInput?.value || "Other";

    const noteText =
      noteInput?.value.trim() || "";


    if (!noteText) {

      showVIPToast(
        "Please write your important note"
      );

      noteInput?.focus();

      return;
    }


    const wasEditing =
      Boolean(vipEditingId);


    const now =
      new Date().toISOString();


    if (wasEditing) {

      const index =
        importantVIPNotes.findIndex(
          function (item) {
            return item.id === vipEditingId;
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
          title || "Important Note",

        category:
          VIP_CATEGORIES.includes(category)
            ? category
            : "Other",

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
          title || "Important Note",

        category:
          VIP_CATEGORIES.includes(category)
            ? category
            : "Other",

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


    const saved =
      saveVIPNotes();


    if (!saved) {
      return;
    }


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
     CLOSE MODAL
  ======================================================= */

  function closeVIPModal() {

    const modal =
      document.getElementById(
        "vipModal"
      );

    if (!modal) {
      return;
    }


    modal.classList.remove(
      "vip-modal-open"
    );


    document.body.style.overflow =
      previousBodyOverflow;


    vipEditingId = null;
  }


  /* =======================================================
     DELETE
  ======================================================= */

  function deleteVIPNote(id) {

    const note =
      importantVIPNotes.find(
        function (item) {
          return item.id === id;
        }
      );

    if (!note) {
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
      "✓ Important Note deleted"
    );
  }


  /* =======================================================
     PIN
  ======================================================= */

  function toggleVIPPin(id) {

    const index =
      importantVIPNotes.findIndex(
        function (item) {
          return item.id === id;
        }
      );


    if (index === -1) {
      return;
    }


    importantVIPNotes[index].pinned =
      !importantVIPNotes[index].pinned;


    importantVIPNotes[index].updatedAt =
      new Date().toISOString();


    saveVIPNotes();

    renderVIPNotes();


    showVIPToast(
      importantVIPNotes[index].pinned
        ? "📌 Note pinned"
        : "Note unpinned"
    );
  }


  /* =======================================================
     SORT
  ======================================================= */

  function sortVIPNotes(notes) {

    return [...notes].sort(
      function (a, b) {

        if (
          Boolean(a.pinned) !==
          Boolean(b.pinned)
        ) {

          return a.pinned
            ? -1
            : 1;
        }


        const dateA =
          new Date(
            a.updatedAt || a.createdAt
          ).getTime();


        const dateB =
          new Date(
            b.updatedAt || b.createdAt
          ).getTime();


        return dateB - dateA;
      }
    );
  }


  /* =======================================================
     RENDER
  ======================================================= */

  function renderVIPNotes() {

    const list =
      document.getElementById(
        "vipNotesList"
      );

    if (!list) {
      return;
    }


    const searchInput =
      document.getElementById(
        "vipSearchInput"
      );


    const search =
      searchInput?.value
        .trim()
        .toLowerCase() || "";


    let notes =
      importantVIPNotes.filter(
        function (item) {

          if (!search) {
            return true;
          }


          const searchableText =
            [
              item.title,
              item.note,
              item.category
            ]
              .join(" ")
              .toLowerCase();


          return searchableText.includes(
            search
          );
        }
      );


    notes =
      sortVIPNotes(notes);


    if (!notes.length) {

      if (search) {

        list.innerHTML = `

          <div class="vip-empty">

            <div class="vip-empty-icon">
              🔎
            </div>

            <div class="vip-empty-title">
              No matching notes
            </div>

            <div class="vip-empty-text">
              Try another search word
            </div>

          </div>

        `;

      } else {

        list.innerHTML = `

          <div class="vip-empty">

            <div class="vip-empty-icon">
              👑
            </div>

            <div class="vip-empty-title">
              No Important VIP notes yet
            </div>

            <div class="vip-empty-text">
              Save the lessons, ideas and reminders
              that are important to you
            </div>

          </div>

        `;
      }

      return;
    }


    list.innerHTML =
      notes.map(
        function (item) {

          const category =
            escapeVIPHTML(
              item.category
            );


          const title =
            escapeVIPHTML(
              item.title
            );


          const body =
            escapeVIPHTML(
              item.note
            );


          const date =
            formatVIPDate(
              item.updatedAt ||
              item.createdAt
            );


          const pinText =
            item.pinned
              ? "📌 Pinned"
              : "📌 Pin";


          return `

            <article
              class="vip-note-card ${
                item.pinned
                  ? "is-pinned"
                  : ""
              }"
              data-vip-id="${escapeVIPHTML(item.id)}"
            >

              <div class="vip-note-top">

                <div class="vip-note-title-wrap">

                  <h3 class="vip-note-title">
                    ${title}
                  </h3>

                  <div class="vip-note-meta">

                    <span class="vip-category">
                      ${getCategoryIcon(item.category)}
                      ${category}
                    </span>

                    ${
                      date
                        ? `
                          <span class="vip-date">
                            ${escapeVIPHTML(date)}
                          </span>
                        `
                        : ""
                    }

                  </div>

                </div>


                ${
                  item.pinned
                    ? `
                      <div
                        class="vip-pin-badge"
                        title="Pinned"
                      >
                        📌
                      </div>
                    `
                    : ""
                }

              </div>


              <div class="vip-note-body">
                ${body}
              </div>


              <div class="vip-note-actions">

                <button
                  type="button"
                  class="
                    vip-action-btn
                    ${
                      item.pinned
                        ? "vip-pin-active"
                        : ""
                    }
                  "
                  data-action="pin"
                  data-id="${escapeVIPHTML(item.id)}"
                >
                  ${pinText}
                </button>


                <button
                  type="button"
                  class="vip-action-btn"
                  data-action="edit"
                  data-id="${escapeVIPHTML(item.id)}"
                >
                  ✏️ Edit
                </button>


                <button
                  type="button"
                  class="
                    vip-action-btn
                    vip-delete
                  "
                  data-action="delete"
                  data-id="${escapeVIPHTML(item.id)}"
                >
                  🗑 Delete
                </button>

              </div>

            </article>

          `;

        }
      ).join("");


    bindVIPNoteActions();
  }


  /* =======================================================
     EVENT DELEGATION
  ======================================================= */

  function bindVIPNoteActions() {

    const list =
      document.getElementById(
        "vipNotesList"
      );

    if (!list) {
      return;
    }


    list.onclick =
      function (event) {

        const button =
          event.target.closest(
            "button[data-action]"
          );


        if (!button) {
          return;
        }


        const action =
          button.dataset.action;


        const id =
          button.dataset.id;


        if (!id) {
          return;
        }


        if (action === "pin") {

          toggleVIPPin(id);

        } else if (action === "edit") {

          editVIPNote(id);

        } else if (action === "delete") {

          deleteVIPNote(id);

        }

      };
  }


  /* =======================================================
     TOAST
  ======================================================= */

  let vipToastTimer = null;


  function createVIPToast() {

    if (
      document.getElementById(
        "vipToast"
      )
    ) {
      return;
    }


    const toast =
      document.createElement("div");

    toast.id =
      "vipToast";


    document.body.appendChild(
      toast
    );
  }


  function showVIPToast(message) {

    createVIPToast();


    const toast =
      document.getElementById(
        "vipToast"
      );


    if (!toast) {
      return;
    }


    toast.textContent =
      message;


    toast.classList.add(
      "vip-toast-show"
    );


    clearTimeout(
      vipToastTimer
    );


    vipToastTimer =
      setTimeout(
        function () {

          toast.classList.remove(
            "vip-toast-show"
          );

        },
        2200
      );
  }


  /* =======================================================
     PUBLIC FUNCTIONS
  ======================================================= */

  window.openImportantVIP =
    openImportantVIP;


  window.editVIPNote =
    editVIPNote;


  window.deleteVIPNote =
    deleteVIPNote;


  window.toggleVIPPin =
    toggleVIPPin;


  /* =======================================================
     INITIALIZE
  ======================================================= */

  function initImportantVIP() {

    try {

      injectVIPStyles();

      loadVIPNotes();

      createVIPSection();

      createVIPModal();

      createVIPToast();

      renderVIPNotes();

    } catch (error) {

      console.error(
        "IMPORTANT VIP initialization error:",
        error
      );

    }
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
      initImportantVIP,
      {
        once: true
      }
    );

  } else {

    initImportantVIP();

  }

})();
