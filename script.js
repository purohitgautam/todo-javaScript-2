const add = document.querySelector("#add"),
  remove = document.getElementById("remove"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const NOTES = "notes", DISABLE = "disable", SHOW = "show"
const notes = JSON.parse(localStorage.getItem(NOTES) || "[]");
let isUpdate = false, updateId;

document.addEventListener("DOMContentLoaded", () => {
  if (!notes || notes.length === 0) {
    remove.classList.add(DISABLE)
  }
})

add.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Task";
  addBtn.innerText = "Add Task";
  popupBox.classList.add(SHOW);
  document.querySelector("body").style.overflow = "hidden";
  // if (window.innerWidth > 660) titleTag.focus();
});
remove.addEventListener("click", () => {
  if (!notes || notes.length === 0) return
  const confirmDel = confirm("Are you sure you want to delete all note?");
  if (!confirmDel) return;
  localStorage.removeItem(NOTES);
  location.reload()
});

closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove(SHOW);
  document.querySelector("body").style.overflow = "auto";
});

function showNotes() {
  if (!notes) return;
  document.querySelectorAll(".note").forEach((li) => li.remove());
  notes.forEach((note, id) => {
    const filterDesc = note.description.replaceAll("\n", "<br/>");
    const liTag = `<li class="note">
                  <div class="details">
                    <p>${note.title}</p>
                    <span>${filterDesc}</span>
                  </div>
                  <div class="bottom-content">
                    <span>${note.date}</span>
                    <div class="settings">
                      <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                      <ul class="menu">
                        <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                        <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                      </ul>
                    </div>
                  </div>
                </li>`;
    add.insertAdjacentHTML("afterend", liTag);
  });
}
showNotes();

function showMenu(elem) {
  elem.parentElement.classList.add(SHOW);
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove(SHOW);
    }
  });
}

function deleteNote(noteId) {
  const confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem(NOTES, JSON.stringify(notes));
  // location.reload()
  showNotes();
  if (!notes || notes.length === 0) {
    remove.classList.add(DISABLE)
  }
}

function updateNote(noteId, title, filterDesc) {
  const description = filterDesc.replaceAll("<br/>", "\r\n");
  updateId = noteId;
  isUpdate = true;
  add.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const title = titleTag.value.trim(),
    description = descTag.value.trim();

  if (title || description) {
    const currentDate = new Date(),
      month = months[currentDate.getMonth()],
      day = currentDate.getDate(),
      year = currentDate.getFullYear();

    const noteInfo = { title, description, date: `${month} ${day}, ${year}` };
    if (!isUpdate) {
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
    }
    localStorage.setItem(NOTES, JSON.stringify(notes));
    remove.classList.remove(DISABLE)
    showNotes();
    closeIcon.click();
  }
});

