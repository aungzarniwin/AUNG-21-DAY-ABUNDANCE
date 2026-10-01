/* =========================================================
   IMPORTANT VIP
   PREMIUM MOBILE NOTE SYSTEM
   ---------------------------------------------------------
   LocalStorage
   Add / Edit / Update / Delete
   Pin / Search / Category
   Mobile App Style
========================================================= */

(function () {

  "use strict";

  const VIP_STORAGE_KEY =
    "aung21_important_vip_v1";

  let importantVIPNotes = [];

  let vipEditingId = null;


  /* =======================================================
     STORAGE
  ======================================================= */

  function loadVIPNotes() {

    try {

      const raw =
        localStorage.getItem(
          VIP_STORAGE_KEY
        );

      if (!raw) {

        return [];

      }

      const parsed =
        JSON.parse(raw);

      if (!Array.isArray(parsed)) {

        return [];

      }

      return parsed.filter(
        item =>
          item &&
          typeof item === "object"
      );

    } catch (error) {

      console.warn(
        "Important VIP load failed",
        error
      );

      return [];

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

      return true;

    } catch (error) {

      console.warn(
        "Important VIP save failed",
        error
      );

      return false;

    }

  }


  /* =======================================================
     ID
  ======================================================= */

  function createVIPId() {

    return (
      Date.now().toString(36) +
      "_" +
      Math.random()
        .toString(36)
        .substring(2, 10)
    );

  }


  /* =======================================================
     HTML SAFETY
  ======================================================= */

  function escapeVIPHTML(value) {

    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =======================================================
     DATE
  ======================================================= */

  function formatVIPDate(value) {

    try {

      return new Date(value)
        .toLocaleString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }
        );

    } catch (error) {

      return "";

    }

  }


  /* =======================================================
     PREMIUM CSS
  ======================================================= */

  function injectVIPStyles() {

    if (
      document.getElementById(
        "importantVIPPremiumStyles"
      )
    ) {

      return;

    }

    const style =
      document.createElement("style");

    style.id =
      "importantVIPPremiumStyles";

    style.textContent = `

      /* ==========================================
         VIP QUICK BUTTON
      ========================================== */

      .vip-quick-button {

        position: relative;

      }


      .vip-quick-button::after {

        content: "VIP";

        position: absolute;

        top: 6px;

        right: 7px;

        font-size: 8px;

        font-weight: 900;

        padding: 3px 5px;

        border-radius: 999px;

        background: #fff2b8;

        color: #755713;

        border: 1px solid #e2c95c;

      }


      /* ==========================================
         VIP SECTION
      ========================================== */

      .vip-section {

        margin-top: 22px;

        position: relative;

        overflow: hidden;

        border-radius: 26px;

        padding: 18px;

        background:
          linear-gradient(
            145deg,
            #ffffff 0%,
            #fcfaff 52%,
            #fffaf0 100%
          );

        border: 1px solid #e8e0f0;

        box-shadow:
          0 16px 45px
          rgba(54,39,105,.10);

      }


      .vip-section::before {

        content: "";

        position: absolute;

        width: 190px;

        height: 190px;

        border-radius: 50%;

        top: -100px;

        right: -70px;

        background:
          radial-gradient(
            circle,
            rgba(222,190,70,.20),
            transparent 68%
          );

        pointer-events: none;

      }


      .vip-section::after {

        content: "";

        position: absolute;

        width: 130px;

        height: 130px;

        border-radius: 50%;

        bottom: -85px;

        left: -70px;

        background:
          radial-gradient(
            circle,
            rgba(109,74,255,.10),
            transparent 68%
          );

        pointer-events: none;

      }


      /* ==========================================
         HEADER
      ========================================== */

      .vip-header {

        position: relative;

        z-index: 2;

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 12px;

        margin-bottom: 16px;

      }


      .vip-brand {

        display: flex;

        align-items: center;

        gap: 12px;

        min-width: 0;

      }


      .vip-icon {

        width: 50px;

        height: 50px;

        flex: 0 0 50px;

        display: flex;

        align-items: center;

        justify-content: center;

        border-radius: 17px;

        font-size: 25px;

        background:
          linear-gradient(
            145deg,
            #fff5bc,
            #e9c94e
          );

        border: 1px solid #dfc14f;

        box-shadow:
          0 9px 25px
          rgba(191,145,25,.20);

      }


      .vip-heading {

        min-width: 0;

      }


      .vip-heading h2 {

        margin: 0;

        color: #241e32;

        font-size: 18px;

        font-weight: 950;

        letter-spacing: -.2px;

      }


      .vip-heading p {

        margin: 3px 0 0;

        color: #817a8b;

        font-size: 11px;

        line-height: 1.5;

      }


      .vip-total {

        min-width: 38px;

        height: 32px;

        padding: 0 10px;

        border-radius: 999px;

        display: flex;

        align-items: center;

        justify-content: center;

        background: #fff6cd;

        border: 1px solid #ead477;

        color: #705517;

        font-size: 12px;

        font-weight: 950;

      }


      /* ==========================================
         ADD BUTTON
      ========================================== */

      .vip-add-button {

        width: 100%;

        border: 0;

        padding: 14px 16px;

        border-radius: 17px;

        display: flex;

        align-items: center;

        justify-content: center;

        gap: 8px;

        color: #ffffff;

        background:
          linear-gradient(
            135deg,
            #7352ff,
            #4f35c9
          );

        box-shadow:
          0 12px 28px
          rgba(79,53,201,.24);

        font-size: 14px;

        font-weight: 900;

        cursor: pointer;

        transition:
          transform .15s ease,
          box-shadow .15s ease;

      }


      .vip-add-button:active {

        transform:
          translateY(1px)
          scale(.985);

        box-shadow:
          0 7px 17px
          rgba(79,53,201,.20);

      }


      /* ==========================================
         SEARCH
      ========================================== */

      .vip-search-wrap {

        position: relative;

        margin-top: 12px;

        margin-bottom: 13px;

      }


      .vip-search-icon {

        position: absolute;

        left: 13px;

        top: 50%;

        transform:
          translateY(-50%);

        font-size: 15px;

        pointer-events: none;

      }


      .vip-search {

        width: 100%;

        box-sizing: border-box;

        height: 46px;

        padding:
          0 13px 0 39px;

        border-radius: 15px;

        border: 1px solid #e7e0ef;

        background: rgba(
          255,
          255,
          255,
          .92
        );

        color: #272130;

        outline: none;

        font-size: 13px;

        font-family: inherit;

        transition:
          border-color .15s ease,
          box-shadow .15s ease;

      }


      .vip-search:focus {

        border-color: #9a88ef;

        box-shadow:
          0 0 0 4px
          rgba(109,74,255,.08);

      }


      /* ==========================================
         NOTE LIST
      ========================================== */

      .vip-list {

        position: relative;

        z-index: 2;

        display: grid;

        gap: 11px;

      }


      .vip-note {

        position: relative;

        overflow: hidden;

        padding: 15px;

        border-radius: 19px;

        background: #ffffff;

        border: 1px solid #ebe5f1;

        box-shadow:
          0 7px 23px
          rgba(47,35,85,.06);

        animation:
          vipNoteIn .2s ease;

      }


      @keyframes vipNoteIn {

        from {

          opacity: 0;

          transform:
            translateY(5px);

        }

        to {

          opacity: 1;

          transform:
            translateY(0);

        }

      }


      .vip-note.pinned {

        border-color: #e0c65e;

        background:
          linear-gradient(
            145deg,
            #fffdf4,
            #ffffff
          );

        box-shadow:
          0 8px 25px
          rgba(186,145,34,.11);

      }


      .vip-note.pinned::before {

        content: "";

        position: absolute;

        left: 0;

        top: 0;

        bottom: 0;

        width: 4px;

        background:
          linear-gradient(
            180deg,
            #e6c84e,
            #b78a17
          );

      }


      .vip-note-header {

        display: flex;

        align-items: flex-start;

        justify-content: space-between;

        gap: 10px;

      }


      .vip-note-title {

        margin: 0;

        color: #272131;

        font-size: 15px;

        font-weight: 950;

        line-height: 1.45;

      }


      .vip-note-pin {

        flex: 0 0 auto;

        font-size: 17px;

      }


      /* ==========================================
         BADGES
      ========================================== */

      .vip-badges {

        display: flex;

        flex-wrap: wrap;

        gap: 6px;

        margin-top: 8px;

      }


      .vip-badge {

        display: inline-flex;

        align-items: center;

        padding: 5px 8px;

        border-radius: 999px;

        font-size: 9px;

        font-weight: 900;

        color: #625b6d;

        background: #f5f2f8;

      }


      .vip-badge.gold {

        color: #725714;

        background: #fff5c9;

        border: 1px solid #efdc86;

      }


      /* ==========================================
         NOTE BODY
      ========================================== */

      .vip-note-body {

        margin-top: 12px;

        color: #4d4659;

        font-size: 13px;

        line-height: 1.75;

        white-space: pre-wrap;

        word-break: break-word;

      }


      .vip-note-date {

        margin-top: 11px;

        color: #99919f;

        font-size: 9px;

      }


      /* ==========================================
         ACTIONS
      ========================================== */

      .vip-actions {

        display: flex;

        gap: 7px;

        margin-top: 12px;

      }


      .vip-action {

        flex: 1;

        min-height: 36px;

        padding: 7px 8px;

        border-radius: 11px;

        border: 1px solid #e7e1ed;

        background: #faf9fc;

        color: #5b5465;

        font-size: 10px;

        font-weight: 900;

        cursor: pointer;

      }


      .vip-action.pin {

        color: #725716;

        background: #fff9e1;

        border-color: #ebd889;

      }


      .vip-action.delete {

        color: #b43f3f;

        background: #fff8f8;

      }


      .vip-action:active {

        transform:
          scale(.97);

      }


      /* ==========================================
         EMPTY
      ========================================== */

      .vip-empty {

        padding: 30px 16px;

        text-align: center;

        border-radius: 19px;

        border: 1px dashed #ddd5e7;

        background:
          rgba(
            255,
            255,
            255,
            .70
          );

      }


      .vip-empty-icon {

        font-size: 32px;

        margin-bottom: 9px;

      }


      .vip-empty-title {

        color: #443c50;

        font-size: 13px;

        font-weight: 900;

      }


      .vip-empty-text {

        margin-top: 6px;

        color: #8b8492;

        font-size: 11px;

        line-height: 1.6;

      }


      /* ==========================================
         MODAL
      ========================================== */

      .vip-modal {

        position: fixed;

        inset: 0;

        z-index: 99999;

        display: none;

        align-items: flex-end;

        justify-content: center;

        background:
          rgba(
            27,
            21,
            42,
            .48
          );

        backdrop-filter:
          blur(6px);

        -webkit-backdrop-filter:
          blur(6px);

        padding: 0;

      }


      .vip-modal.show {

        display: flex;

        animation:
          vipFadeIn .18s ease;

      }


      @keyframes vipFadeIn {

        from {

          opacity: 0;

        }

        to {

          opacity: 1;

        }

      }


      .vip-sheet {

        width: 100%;

        max-width: 620px;

        max-height: 91vh;

        overflow-y: auto;

        background:
          linear-gradient(
            145deg,
            #ffffff,
            #faf8ff
          );

        border-radius:
          28px 28px 0 0;

        padding:
          10px 18px
          calc(
            20px +
            env(safe-area-inset-bottom)
          );

        box-shadow:
          0 -20px 60px
          rgba(20,15,40,.22);

        animation:
          vipSheetUp .22s ease;

      }


      @keyframes vipSheetUp {

        from {

          transform:
            translateY(100%);

        }

        to {

          transform:
            translateY(0);

        }

      }


      .vip-sheet-handle {

        width: 42px;

        height: 4px;

        border-radius: 999px;

        background: #d9d3df;

        margin: 2px auto 17px;

      }


      .vip-sheet-header {

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 10px;

        margin-bottom: 18px;

      }


      .vip-sheet-title {

        margin: 0;

        color: #272131;

        font-size: 18px;

        font-weight: 950;

      }


      .vip-close {

        width: 38px;

        height: 38px;

        border: 0;

        border-radius: 13px;

        background: #f1eef5;

        color: #625a6c;

        font-size: 20px;

        cursor: pointer;

      }


      .vip-field {

        margin-bottom: 14px;

      }


      .vip-field label {

        display: block;

        margin-bottom: 7px;

        color: #5b5365;

        font-size: 11px;

        font-weight: 900;

      }


      .vip-field input,
      .vip-field select,
      .vip-field textarea {

        width: 100%;

        box-sizing: border-box;

        border: 1px solid #e4ddec;

        border-radius: 15px;

        padding: 13px;

        background: #ffffff;

        color: #272131;

        outline: none;

        font-size: 14px;

        font-family: inherit;

      }


      .vip-field textarea {

        min-height: 150px;

        resize: vertical;

        line-height: 1.7;

      }


      .vip-field input:focus,
      .vip-field select:focus,
      .vip-field textarea:focus {

        border-color: #8c77eb;

        box-shadow:
          0 0 0 4px
          rgba(109,74,255,.08);

      }


      .vip-sheet-actions {

        display: flex;

        gap: 9px;

        margin-top: 4px;

      }


      .vip-sheet-save,
      .vip-sheet-cancel {

        flex: 1;

        min-height: 48px;

        border: 0;

        border-radius: 15px;

        font-size: 13px;

        font-weight: 950;

        cursor: pointer;

      }


      .vip-sheet-save {

        color: #ffffff;

        background:
          linear-gradient(
            135deg,
            #7352ff,
            #4f35c9
          );

        box-shadow:
          0 10px 24px
          rgba(79,53,201,.22);

      }


      .vip-sheet-cancel {

        color: #5f5869;

        background: #efecf4;

      }


      /* ==========================================
         DESKTOP
      ========================================== */

      @media (min-width: 700px) {

        .vip-modal {

          align-items: center;

          padding: 20px;

        }


        .vip-sheet {

          border-radius: 26px;

          max-height: 85vh;

          box-shadow:
            0 25px 80px
            rgba(20,15,40,.25);

        }

      }


      /* ==========================================
         SMALL PHONE
      ========================================== */

      @media (max-width: 380px) {

        .vip-section {

          padding: 14px;

        }


        .vip-icon {

          width: 44px;

          height: 44px;

          flex-basis: 44px;

          border-radius: 14px;

          font-size: 22px;

        }


        .vip-heading h2 {

          font-size: 16px;

        }


        .vip-actions {

          gap: 5px;

        }


        .vip-action {

          font-size: 9px;

          padding-left: 5px;

          padding-right: 5px;

        }

      }

    `;

    document.head.appendChild(style);

  }


  /* =======================================================
     CREATE SECTION
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

    section.className =
      "vip-section";

    section.innerHTML = `

      <div class="vip-header">

        <div class="vip-brand">

          <div class="vip-icon">
            👑
          </div>

          <div class="vip-heading">

            <h2>
              Important VIP
            </h2>

            <p>
              Your important notes in one place
            </p>

          </div>

        </div>

        <div
          id="vipTotal"
          class="vip-total"
        >
          0
        </div>

      </div>


      <button
        id="vipAddButton"
        class="vip-add-button"
        type="button"
      >

        <span>＋</span>

        <span>
          Add Important Note
        </span>

      </button>


      <div class="vip-search-wrap">

        <span class="vip-search-icon">
          🔎
        </span>

        <input
          id="vipSearchInput"
          class="vip-search"
          type="search"
          autocomplete="off"
          placeholder="Search your important notes..."
        >

      </div>


      <div
        id="vipNotesList"
        class="vip-list"
      ></div>

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

      /*
        Add Quick Action
      */

      const quickButton =
        document.createElement(
          "button"
        );

      quickButton.type =
        "button";

      quickButton.className =
        "quick-btn vip-quick-button";

      quickButton.innerHTML = `
        <span>👑</span>
        Important VIP
      `;

      quickButton.addEventListener(
        "click",
        openImportantVIP
      );

      quickGrid.appendChild(
        quickButton
      );


      /*
        Insert section
      */

      quickGrid.parentNode.insertBefore(
        section,
        quickGrid.nextSibling
      );

    } else if (homeScreen) {

      homeScreen.appendChild(
        section
      );

    } else {

      document.body.appendChild(
        section
      );

    }

  }


  /* =======================================================
     CREATE MODAL
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

    modal.className =
      "vip-modal";

    modal.innerHTML = `

      <div
        class="vip-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vipSheetTitle"
      >

        <div class="vip-sheet-handle"></div>


        <div class="vip-sheet-header">

          <h3
            id="vipSheetTitle"
            class="vip-sheet-title"
          >
            Add Important Note
          </h3>


          <button
            id="vipCloseButton"
            class="vip-close"
            type="button"
            aria-label="Close"
          >
            ×
          </button>

        </div>


        <div class="vip-field">

          <label>
            Note Title
          </label>

          <input
            id="vipTitleInput"
            type="text"
            maxlength="120"
            autocomplete="off"
            placeholder="ဥပမာ - ဆရာမပြောထားတဲ့ အရေးကြီးအချက်"
          >

        </div>


        <div class="vip-field">

          <label>
            Category
          </label>

          <select
            id="vipCategoryInput"
          >

            <option value="Teacher">
              👩‍🏫 Teacher
            </option>

            <option value="Mindset">
              🧠 Mindset
            </option>

            <option value="Money">
              💰 Money
            </option>

            <option value="Business">
              💼 Business
            </option>

            <option value="Personal">
              ❤️ Personal
            </option>

            <option value="Other">
              📌 Other
            </option>

          </select>

        </div>


        <div class="vip-field">

          <label>
            Important Note
          </label>

          <textarea
            id="vipNoteInput"
            maxlength="10000"
            placeholder="အရေးကြီးတဲ့အကြောင်းအရာကို ဒီနေရာမှာရေးပါ..."
          ></textarea>

        </div>


        <div class="vip-sheet-actions">

          <button
            id="vipSheetCancel"
            class="vip-sheet-cancel"
            type="button"
          >
            Cancel
          </button>


          <button
            id="vipSheetSave"
            class="vip-sheet-save"
            type="button"
          >
            ✓ Save Important
          </button>

        </div>

      </div>

    `;


    document.body.appendChild(
      modal
    );


    /*
      Close button
    */

    document
      .getElementById(
        "vipCloseButton"
      )
      .addEventListener(
        "click",
        closeVIPModal
      );


    /*
      Cancel
    */

    document
      .getElementById(
        "vipSheetCancel"
      )
      .addEventListener(
        "click",
        closeVIPModal
      );


    /*
      Save
    */

    document
      .getElementById(
        "vipSheetSave"
      )
      .addEventListener(
        "click",
        saveVIPNote
      );


    /*
      Background close
    */

    modal.addEventListener(
      "click",
      event => {

        if (
          event.target === modal
        ) {

          closeVIPModal();

        }

      }
    );


    /*
      Escape
    */

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape" &&
          modal.classList.contains(
            "show"
          )
        ) {

          closeVIPModal();

        }

      }
    );

  }


  /* =======================================================
     OPEN MODAL
  ======================================================= */

  function openVIPModal(
    noteId = null
  ) {

    const modal =
      document.getElementById(
        "vipModal"
      );

    if (!modal) {

      return;

    }


    vipEditingId =
      noteId;


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
      document.getElementById(
        "vipSheetTitle"
      );

    const saveButton =
      document.getElementById(
        "vipSheetSave"
      );


    if (noteId) {

      const note =
        importantVIPNotes.find(
          item =>
            item.id === noteId
        );

      if (!note) {

        return;

      }


      title.textContent =
        "Edit Important Note";

      saveButton.textContent =
        "✓ Update Important";

      titleInput.value =
        note.title || "";

      categoryInput.value =
        note.category || "Other";

      noteInput.value =
        note.note || "";

    } else {

      title.textContent =
        "Add Important Note";

      saveButton.textContent =
        "✓ Save Important";

      titleInput.value =
        "";

      categoryInput.value =
        "Teacher";

      noteInput.value =
        "";

    }


    modal.classList.add(
      "show"
    );


    document.body.style.overflow =
      "hidden";


    setTimeout(
      () => {

        if (titleInput) {

          titleInput.focus();

        }

      },
      180
    );

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
      "show"
    );

    document.body.style.overflow =
      "";

    vipEditingId =
      null;

  }


  /* =======================================================
     OPEN VIP SECTION
  ======================================================= */

  function openImportantVIP() {

    const section =
      document.getElementById(
        "importantVIPSection"
      );

    if (!section) {

      return;

    }


    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

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


    if (
      !titleInput ||
      !noteInput
    ) {

      return;

    }


    const title =
      titleInput.value.trim();

    const category =
      categoryInput
        ? categoryInput.value
        : "Other";

    const note =
      noteInput.value.trim();


    if (!note) {

      alert(
        "Important Note ကို ဖြည့်ပေးပါ"
      );

      noteInput.focus();

      return;

    }


    const now =
      new Date().toISOString();


    /* ==========================================
       UPDATE
    ========================================== */

    if (vipEditingId) {

      const index =
        importantVIPNotes.findIndex(
          item =>
            item.id ===
            vipEditingId
        );


      if (index !== -1) {

        importantVIPNotes[index] = {

          ...importantVIPNotes[index],

          title:
            title ||
            "Important Note",

          category,

          note,

          updatedAt:
            now

        };

      }

    }


    /* ==========================================
       NEW
    ========================================== */

    else {

      importantVIPNotes.unshift({

        id:
          createVIPId(),

        title:
          title ||
          "Important Note",

        category,

        note,

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
      vipEditingId
        ? "✓ Important Note updated"
        : "✓ Important Note saved"
    );

    vipEditingId =
      null;

  }


  /* =======================================================
     EDIT
  ======================================================= */

  function editVIPNote(id) {

    openVIPModal(id);

  }


  /* =======================================================
     PIN
  ======================================================= */

  function toggleVIPPin(id) {

    const note =
      importantVIPNotes.find(
        item =>
          item.id === id
      );


    if (!note) {

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
     DELETE
  ======================================================= */

  function deleteVIPNote(id) {

    const note =
      importantVIPNotes.find(
        item =>
          item.id === id
      );


    if (!note) {

      return;

    }


    const confirmed =
      window.confirm(
        `"${note.title}" ကို ဖျက်မလား?`
      );


    if (!confirmed) {

      return;

    }


    importantVIPNotes =
      importantVIPNotes.filter(
        item =>
          item.id !== id
      );


    saveVIPNotes();

    renderVIPNotes();


    showVIPToast(
      "🗑 Important Note deleted"
    );

  }


  /* =======================================================
     SEARCH
  ======================================================= */

  function getVIPSearch() {

    const input =
      document.getElementById(
        "vipSearchInput"
      );

    return (
      input?.value ||
      ""
    )
      .trim()
      .toLowerCase();

  }


  /* =======================================================
     RENDER
  ======================================================= */

  function renderVIPNotes() {

    const list =
      document.getElementById(
        "vipNotesList"
      );

    const total =
      document.getElementById(
        "vipTotal"
      );


    if (!list) {

      return;

    }


    const search =
      getVIPSearch();


    let notes =
      importantVIPNotes.filter(
        item => {

          if (!search) {

            return true;

          }


          return (

            String(
              item.title || ""
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
              item.note || ""
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
              item.category || ""
            )
            .toLowerCase()
            .includes(search)

          );

        }
      );


    /*
      Pinned first
    */

    notes.sort(
      (a, b) => {

        if (
          Boolean(a.pinned) !==
          Boolean(b.pinned)
        ) {

          return a.pinned
            ? -1
            : 1;

        }


        return (
          new Date(
            b.updatedAt ||
            b.createdAt ||
            0
          ) -
          new Date(
            a.updatedAt ||
            a.createdAt ||
            0
          )
        );

      }
    );


    if (total) {

      total.textContent =
        importantVIPNotes.length;

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
                ? "No Important Notes Found"
                : "No Important Notes Yet"
            }
          </div>

          <div class="vip-empty-text">

            ${
              search
                ? "Search keyword ကို ပြန်စစ်ကြည့်ပါ"
                : "ဆရာ/ဆရာမထံမှ အရေးကြီးတဲ့ Note တွေကို ဒီနေရာမှာ သိမ်းထားနိုင်ပါတယ်"
            }

          </div>

        </div>

      `;

      return;

    }


    list.innerHTML =
      notes
        .map(
          item => {

            const safeId =
              escapeVIPHTML(
                item.id
              );

            return `

              <article
                class="
                  vip-note
                  ${
                    item.pinned
                      ? "pinned"
                      : ""
                  }
                "
              >

                <div
                  class="vip-note-header"
                >

                  <h3
                    class="vip-note-title"
                  >
                    ${
                      escapeVIPHTML(
                        item.title ||
                        "Important Note"
                      )
                    }
                  </h3>

                  ${
                    item.pinned
                      ? `
                        <div
                          class="vip-note-pin"
                        >
                          📌
                        </div>
                      `
                      : ""
                  }

                </div>


                <div
                  class="vip-badges"
                >

                  <span
                    class="vip-badge gold"
                  >
                    👑 VIP
                  </span>

                  <span
                    class="vip-badge"
                  >
                    ${
                      escapeVIPHTML(
                        item.category ||
                        "Other"
                      )
                    }
                  </span>

                  ${
                    item.pinned
                      ? `
                        <span
                          class="vip-badge gold"
                        >
                          📌 Pinned
                        </span>
                      `
                      : ""
                  }

                </div>


                <div
                  class="vip-note-body"
                >
                  ${
                    escapeVIPHTML(
                      item.note
                    )
                  }
                </div>


                <div
                  class="vip-note-date"
                >
                  Last updated:
                  ${
                    formatVIPDate(
                      item.updatedAt ||
                      item.createdAt
                    )
                  }
                </div>


                <div
                  class="vip-actions"
                >

                  <button
                    type="button"
                    class="vip-action pin"
                    onclick="
                      window.toggleVIPPin(
                        '${safeId}'
                      )
                    "
                  >
                    ${
                      item.pinned
                        ? "📌 Unpin"
                        : "📌 Pin"
                    }
                  </button>


                  <button
                    type="button"
                    class="vip-action"
                    onclick="
                      window.editVIPNote(
                        '${safeId}'
                      )
                    "
                  >
                    ✏️ Edit
                  </button>


                  <button
                    type="button"
                    class="
                      vip-action
                      delete
                    "
                    onclick="
                      window.deleteVIPNote(
                        '${safeId}'
                      )
                    "
                  >
                    🗑 Delete
                  </button>

                </div>

              </article>

            `;

          }
        )
        .join("");

  }


  /* =======================================================
     TOAST
  ======================================================= */

  function showVIPToast(
    message
  ) {

    let toast =
      document.getElementById(
        "vipToast"
      );


    if (!toast) {

      toast =
        document.createElement(
          "div"
        );

      toast.id =
        "vipToast";

      toast.style.cssText = `

        position:fixed;
        left:50%;
        bottom:
          calc(
            22px +
            env(safe-area-inset-bottom)
          );
        transform:
          translateX(-50%)
          translateY(12px);
        z-index:100000;
        max-width:calc(100% - 36px);
        padding:11px 16px;
        border-radius:999px;
        background:#262032;
        color:#ffffff;
        font-size:12px;
        font-weight:800;
        box-shadow:
          0 12px 35px
          rgba(0,0,0,.22);
        opacity:0;
        pointer-events:none;
        transition:
          opacity .2s ease,
          transform .2s ease;

      `;

      document.body.appendChild(
        toast
      );

    }


    toast.textContent =
      message;


    toast.style.opacity =
      "1";

    toast.style.transform =
      "translateX(-50%) translateY(0)";


    clearTimeout(
      toast._timer
    );


    toast._timer =
      setTimeout(
        () => {

          toast.style.opacity =
            "0";

          toast.style.transform =
            "translateX(-50%) translateY(12px)";

        },
        1800
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
     INIT
  ======================================================= */

  function initImportantVIP() {

    importantVIPNotes =
      loadVIPNotes();

    injectVIPStyles();

    createVIPSection();

    createVIPModal();

    renderVIPNotes();

  }


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
