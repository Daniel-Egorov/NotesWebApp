import { MdcList, MdcTextarea, MdcTextField } from '@angular-mdc/web';
import { Component, ViewChild } from '@angular/core';

export class Note {
  title: string | undefined;
  date: string | undefined;
  text: string | undefined;
  dateFormatted: string | undefined;

  constructor(title: string, date: Date, text: string) {
    this.title = title;
    this.text = text;
    this.date = date ? date.toLocaleString() : "";
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('noteTextInput') noteTextInput: MdcTextarea | undefined;
  @ViewChild('noteTitleInput') noteTitleInput: MdcTextField | undefined;
  @ViewChild('noteList') noteList: MdcList | undefined;
  @ViewChild('searchFieldInput') searchFieldInput: MdcTextField | undefined;

  title = 'NotesWebApp';
  public counter = 0;
  public notes = new Array<Note>();
  public saveDisabled = true;
  public inputDisabled = true;
  public filteredNotes = this.notes;
  public data: any = [];
  public body = document.body;

  constructor() { }
  ngOnInit() {
    this.data = JSON.parse(localStorage.getItem('notesJSON')!);
    if (this.data) {
      this.notes = this.data;
      this.filteredNotes = this.notes;
    }
  }

  clearTextFields() {
    this.noteTextInput?.writeValue(null);
    this.noteTitleInput?.writeValue(null);
    this.saveDisabled = true;
  }

  onAdd() {
    this.inputDisabled = false;
    let newNote = new Note(
      "New Note",
      new Date(Date.now()),
      ""
    );

    this.notes.unshift(newNote);
    this.filteredNotes = this.notes.filter(note => {
      if (!this.searchFieldInput?.value) {
        return this.notes;
      }
      return note?.title?.includes(this.searchFieldInput?.value.toLowerCase());
    });

    setTimeout(() => {
      this.noteList?.setSelectedIndex(0);
      this.clearTextFields();
      this.noteTitleInput?.focus();
    }, 1);
    localStorage.setItem('notesJSON', JSON.stringify(this.notes));
  }

  onDelete(note: Note) {
    if (this.notes.indexOf(note) === this.noteList?.getSelectedIndex()) {
      this.clearTextFields();
    }

    this.inputDisabled = true;

    this.notes.splice(this.notes.indexOf(note), 1);
    this.filteredNotes = this.notes;
    localStorage.setItem('notesJSON', JSON.stringify(this.notes))
  }

  onSave() {
    if (this.noteList?.getSelectedIndex() !== -1) {
      let note = this.notes[this.noteList!.getSelectedIndex()];

      note.title = this.noteTitleInput?.value;
      note.text = this.noteTextInput?.value;

      this.noteList?.reset();
      this.clearTextFields();
      this.saveDisabled = true;

      localStorage.setItem('notesJSON', JSON.stringify(this.notes));

    }
  }

  onThemeClick() {
    if (this.body.classList[0] === 'dark-theme') this.body.classList.replace('dark-theme', 'light-theme');
    else if (this.body.classList[0] === 'light-theme') this.body.classList.replace('light-theme', 'dark-theme');
  }

  onSelectionChange(_: any) {
    this.inputDisabled = false;
    this.noteTitleInput?.writeValue(this.notes[this.noteList!.getSelectedIndex()].title);
    this.noteTextInput?.writeValue(this.notes[this.noteList!.getSelectedIndex()].text);
    this.noteTextInput?.focus();
  }

  onTextFieldInput(event: any) {
    if (
      event
      && this.noteList?.getSelectedIndex() !== -1
    ) {
      this.saveDisabled = false;
    }
    else {
      this.saveDisabled = true;
    }
  }

  onTextAreaInput(event: any) {

    if (
      event
      && this.noteList?.getSelectedIndex() !== -1
    ) {
      this.saveDisabled = false;
    }
    else if (
      !event
      && this.noteTitleInput?.value
      && this.noteList?.getSelectedIndex() !== -1
    ) {
      this.saveDisabled = false;
    }
    else {
      this.saveDisabled = true;
    }
  }

  onSearchFieldInput(event: any) {
    this.filteredNotes = this.notes.filter(note => note.title?.toLowerCase()?.includes(event.toLowerCase()));
    this.noteList?.reset();
    this.clearTextFields();
  }
}
