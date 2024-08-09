const noteTitle = document.getElementById("title");
const noteBody = document.getElementById("body");
const addNoteButton = document.getElementById("addNoteButton");

addNoteButton.addEventListener("click", async () => {
  const response = await fetch(urlMaker("/note"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken(),
    },
    body: JSON.stringify({
      title: noteTitle.value,
      body: noteBody.value,
    }),
  });

  const data = await response.json();

  console.log(data);

  if (response.status == 201) {
    alert("note created successfully!");
    location.assign("/frontend/dashboard.html");
  }
});
