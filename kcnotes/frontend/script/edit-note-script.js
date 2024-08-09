const mainArea = document.querySelector("main");
const title = document.getElementById("title");
const body = document.getElementById("body");
const editNoteButton = document.getElementById("editNoteButton");

const id = location.search.slice(4);
console.log(id);

async function showNote() {
  const response = await fetch(urlMaker("/note/" + id), {
    method: "GET",
    headers: {
      Authorization: getToken(),
    },
  });

  const data = await response.json();

  console.log(data);

  title.value = data.note.title;
  body.value = data.note.body;

  editNoteButton.addEventListener("click", async () => {
    try {
      const response = await fetch(urlMaker("/note/" + id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        body: JSON.stringify({
          title: title.value,
          body: title.value,
        }),
      });

      if (response.status == 200) {
        alert("note updated successfully!");
        location.assign("/frontend/dashboard.html");
      }
    } catch (err) {
      console.log(err);
      alert("an error occured while trying to update your note");
    }
  });
}

showNote();
