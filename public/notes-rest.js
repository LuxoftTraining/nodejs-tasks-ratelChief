const SERVER = axios.create({
  baseURL: "http://localhost:4000",
});

async function loadNotes() {
  let res = await SERVER.get("/notes");
  console.log("res.data", res.data);
  let notes = res.data
    .map(
      (note) => `
        <li>
            ${note.text}
            <a onclick="deleteNote('${note._id}')" style="cursor: pointer;font-size:small">&#128686;</a>
            <button onclick="editNote('${note._id}')">edit</button>
            <input type="textarea" id="edit${note._id}" />
        </li>
    `,
    )
    .join("");

  document.getElementById("placeholder").innerHTML = `
        <ul>${notes}</ul>
    `;
}

async function addNote() {
  let noteInput = document.getElementById("noteText");
  let noteText = noteInput.value;
  await SERVER.post("/notes", { text: noteText });
  noteInput.value = "";
  await loadNotes();
}

async function deleteNote(id) {
  await SERVER.delete(`/notes/${id}`);
  await loadNotes();
}

async function editNote(id) {
  let noteInput = document.getElementById(`edit${id}`);
  let noteText = noteInput.value;
  await SERVER.put(`/notes/${id}`, { value: noteText });
  noteInput.value = "";
  await loadNotes();
}

loadNotes();
