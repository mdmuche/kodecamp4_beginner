const mainArea = document.querySelector("main");

async function loadNotes() {
  try {
    const token = getToken();
    const url = urlMaker("/note");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!data.notes || data.notes.length === 0) {
      mainArea.innerHTML = `
         <div class='no-note'>No notes, kindly add one</div>
      `;
    } else {
      mainArea.innerHTML = "";

      for (let note of data.notes) {
        mainArea.style.display = "grid";
        mainArea.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
        mainArea.style.margin = "40px 80px 0 80px";
        mainArea.style.gap = "20px";

        mainArea.innerHTML += `
          <div class='single-note'>
              <h3>${
                note.title.length <= 20
                  ? note.title
                  : note.title.slice(0, 20) + "..."
              }</h3>
              <div>${
                note.body.length <= 30
                  ? note.body
                  : note.body.slice(0, 30) + "..."
              }</</div>
              <div class="view-edit-delete-button">
              <button id="view-button" onclick='viewNote("${
                note._id
              }")'>view</button>
              <button id="edit-button" onclick="location.assign('/frontend/edit-note.html?id=' + '${
                note._id
              }')">edit</button>
              <button id="delete-button" onclick="location.assign('/frontend/delete-note.html?id=' + '${
                note._id
              }')">delete</button>
              </div>
          </div>
          `;
      }
    }
  } catch (err) {
    console.error("err:", err);
  }
}

loadNotes();

function viewNote(id) {
  location.assign(`/frontend/view-note.html?id=${id}`);
}
