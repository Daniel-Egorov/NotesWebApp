import { MdcList, MdcTextarea, MdcTextField } from '@angular-mdc/web';
import { Component, ViewChild } from '@angular/core';

import { HttpClient } from "@angular/common/http";

export class Note {
  title: string | undefined;
  date: Date | undefined;
  text: string | undefined;

  constructor(title: string, date: Date, text: string) {
    this.title = title;
    this.text = text;
    this.date = date;
  }

  toJSON() {
    return {
      "title": this.title,
      "date": this.date,
      "text": this.text
    }
  }

  fromJSON(json: any) {
    return new Note(json.title, json.date, json.text)
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
  public noteTitle = '';
  public noteText = '';
  public filteredNotes = this.notes;
  public data: any = [];

  constructor(private httpClient: HttpClient){}
  ngOnInit() {
    this.httpClient.get("assets/data.json").subscribe(data =>{
      console.log(data);
      this.data = data;
    })
  }

  clearTextFields() {
    this.noteTextInput?.writeValue(null);
    this.noteTitleInput?.writeValue(null);
  }

  noteArrayToJSON(array: Array<Note>) {
    let jsonObject = [];
    for (let i = 0; i < array.length; i++) {
      jsonObject[i] = (array[i].toJSON());
    }
    return jsonObject;
  }

  onAdd() {
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
  }

  onDelete(note: Note) {
    if (this.notes.indexOf(note) === this.noteList?.getSelectedIndex()) {
      this.clearTextFields();
    }

    this.notes.splice(this.notes.indexOf(note), 1);
    this.filteredNotes.splice(this.filteredNotes.indexOf(note), 1);
  }

  onSave() {
    if (this.noteList?.getSelectedIndex() !== -1) {
      let note = this.notes[this.noteList!.getSelectedIndex()];

      note.title = this.noteTitleInput?.value;
      note.text = this.noteTextInput?.value;

      this.noteList?.reset();
      this.clearTextFields();
      this.saveDisabled = true;
    }
  }

  onSelectionChange(_: any) {
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

  onTextFieldChange(event: any) {
    this.noteTitle = event;
  }

  onTextAreaChange(event: any) {
    this.noteText = event;
  }

  onSearchFieldInput(event: any) {
    this.filteredNotes = this.notes.filter(note => note.title?.toLowerCase()?.includes(event.toLowerCase()));
  }
}
