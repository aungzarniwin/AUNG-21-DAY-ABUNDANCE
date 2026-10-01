/* =========================================================
   IMPORTANT VIP 21 SYSTEM
   ---------------------------------------------------------
   21 Fixed Important VIP Items
   No LocalStorage
   No Cloud Database
   System Data Only
========================================================= */

const IMPORTANT_VIP_TOTAL = 21;

const importantVIP = [

  {
    id: 1,
    title: "VIP 01",
    note: "",
    completed: false
  },

  {
    id: 2,
    title: "VIP 02",
    note: "",
    completed: false
  },

  {
    id: 3,
    title: "VIP 03",
    note: "",
    completed: false
  },

  {
    id: 4,
    title: "VIP 04",
    note: "",
    completed: false
  },

  {
    id: 5,
    title: "VIP 05",
    note: "",
    completed: false
  },

  {
    id: 6,
    title: "VIP 06",
    note: "",
    completed: false
  },

  {
    id: 7,
    title: "VIP 07",
    note: "",
    completed: false
  },

  {
    id: 8,
    title: "VIP 08",
    note: "",
    completed: false
  },

  {
    id: 9,
    title: "VIP 09",
    note: "",
    completed: false
  },

  {
    id: 10,
    title: "VIP 10",
    note: "",
    completed: false
  },

  {
    id: 11,
    title: "VIP 11",
    note: "",
    completed: false
  },

  {
    id: 12,
    title: "VIP 12",
    note: "",
    completed: false
  },

  {
    id: 13,
    title: "VIP 13",
    note: "",
    completed: false
  },

  {
    id: 14,
    title: "VIP 14",
    note: "",
    completed: false
  },

  {
    id: 15,
    title: "VIP 15",
    note: "",
    completed: false
  },

  {
    id: 16,
    title: "VIP 16",
    note: "",
    completed: false
  },

  {
    id: 17,
    title: "VIP 17",
    note: "",
    completed: false
  },

  {
    id: 18,
    title: "VIP 18",
    note: "",
    completed: false
  },

  {
    id: 19,
    title: "VIP 19",
    note: "",
    completed: false
  },

  {
    id: 20,
    title: "VIP 20",
    note: "",
    completed: false
  },

  {
    id: 21,
    title: "VIP 21",
    note: "",
    completed: false
  }

];


/* =========================================================
   IMPORTANT VIP - GET ITEM
========================================================= */

function getImportantVIP(id) {

  const vipId = Number(id);

  return importantVIP.find(
    item => item.id === vipId
  ) || null;

}


/* =========================================================
   IMPORTANT VIP - UPDATE ITEM
========================================================= */

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

  return true;

}


/* =========================================================
   IMPORTANT VIP - MARK COMPLETE
========================================================= */

function completeImportantVIP(id) {

  const item =
    getImportantVIP(id);

  if (!item) {

    return false;

  }

  item.completed = true;

  return true;

}


/* =========================================================
   IMPORTANT VIP - MARK INCOMPLETE
========================================================= */

function uncompleteImportantVIP(id) {

  const item =
    getImportantVIP(id);

  if (!item) {

    return false;

  }

  item.completed = false;

  return true;

}


/* =========================================================
   IMPORTANT VIP - PROGRESS
========================================================= */

function getImportantVIPProgress() {

  const completed =
    importantVIP.filter(
      item => item.completed
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

    percentage

  };

}


/* =========================================================
   IMPORTANT VIP - GET ALL
========================================================= */

function getAllImportantVIP() {

  return importantVIP.map(
    item => ({
      ...item
    })
  );

}


/* =========================================================
   IMPORTANT VIP - OPEN
========================================================= */

function openImportantVIP(id) {

  const item =
    getImportantVIP(id);

  if (!item) {

    return null;

  }

  return item;

}


/* =========================================================
   IMPORTANT VIP - CONSOLE HELPER
   ---------------------------------------------------------
   Useful while adding Teacher's 21 points
========================================================= */

function showImportantVIP() {

  console.table(
    importantVIP.map(
      item => ({
        ID: item.id,
        Title: item.title,
        Note: item.note,
        Completed: item.completed
      })
    )
  );

}


/* =========================================================
   IMPORTANT VIP - SYSTEM STATUS
========================================================= */

function getImportantVIPStatus() {

  const progress =
    getImportantVIPProgress();

  return {

    name:
      "Important VIP 21",

    completed:
      progress.completed,

    total:
      progress.total,

    percentage:
      progress.percentage,

    remaining:
      progress.total -
      progress.completed

  };

}


/* =========================================================
   IMPORTANT VIP - RESET
   ---------------------------------------------------------
   Resets only runtime VIP data.
   Does NOT touch 21-Day Journey data.
========================================================= */

function resetImportantVIP() {

  importantVIP.forEach(
    item => {

      item.note = "";

      item.completed = false;

    }
  );

}


/* =========================================================
   IMPORTANT VIP - DEVELOPMENT TEST
========================================================= */

window.ImportantVIP = {

  items:
    importantVIP,

  total:
    IMPORTANT_VIP_TOTAL,

  get:
    getImportantVIP,

  getAll:
    getAllImportantVIP,

  update:
    updateImportantVIP,

  complete:
    completeImportantVIP,

  uncomplete:
    uncompleteImportantVIP,

  progress:
    getImportantVIPProgress,

  status:
    getImportantVIPStatus,

  open:
    openImportantVIP,

  reset:
    resetImportantVIP,

  show:
    showImportantVIP

};
