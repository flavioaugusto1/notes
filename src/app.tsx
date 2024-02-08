import { ChangeEvent, useState } from "react";
import Logo from "./assets/logo-nlw-experts.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    return [];
  });

  function onCreatedNote(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const newNotesArray = notes.filter((note) => {
      return note.id !== id;
    });

    setNotes(newNotesArray);
    localStorage.setItem("notes", JSON.stringify(newNotesArray));
  }

  function handleSearchNote(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearch(query);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={Logo} alt="NLW experts" />

      <form className="w-full">
        <input
          type="text"
          placeholder="busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearchNote}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px] ">
        <NewNoteCard onNoteCreated={onCreatedNote} />
        {filteredNotes.map((note) => {
          return (
            <NoteCard onNoteDeleted={onNoteDeleted} key={note.id} note={note} />
          );
        })}
      </div>
    </div>
  );
}
