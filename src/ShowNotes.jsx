import React, { Component } from 'react';
import axios from 'axios';
import { Markdown } from 'react-showdown';
import Header from './Header';

class ShowNotes extends Component {
	state = {
		currentClickedNoteText: '',
		allNotesOfUser: [],
		activeNoteId: 0,
		reloadPage: false,
		activeNoteColor: '',
		toggleEdit: true,
	};

	componentWillMount() {
		this.checkLogin();
		// this.fetchNotes();
	}

	checkLogin = () => {
		axios
			.get('http://localhost:3030/checklogin')
			.then(response => {
				if (response.data.loggedin) {
					this.fetchNotes();
				} else {
					window.location.href = 'http://localhost:3000';
				}
			})
			.catch(error => {
				console.error('axios error', error);
			});
	};

	fetchNotes = () => {
		axios
			.get('http://localhost:3030/usernotes/')
			.then(response => {
				this.setState({
					allNotesOfUser: response.data.notes,
					activeNoteId: `${
						this.state.activeNoteId === 0
							? response.data.notes[0].noteid
							: Number(this.state.activeNoteId)
					}`,
					currentClickedNoteText: `${this.slashNconverter(
						this.state.currentClickedNoteText === ''
							? response.data.notes[0].note
							: this.state.currentClickedNoteText,
					)}`,
				});
			})
			.catch(error => {
				console.error('axios error', error);
			});
	};

	changeStateWith = event => {
		this.setState({ currentClickedNoteText: event.target.value });
	};

	alertSomething = () => {
		alert(this.state.allNotesOfUser[0].note);
	};

	slashNconverter = textToChange => {
		let newText = textToChange.replace(/\\n/g, '\n');
		return newText;
	};

	saveNote = () => {
		axios
			.post('http://localhost:3030/savenote', {
				id: `${this.state.activeNoteId}`,
				noteText: `${this.state.currentClickedNoteText}`,
			})
			.then(response => {
				if (response.data.noteSaved) {
					alert('Note Saved!');
					this.fetchNotes();
					// this.setState({
					// 	reloadPage: !this.state.reloadPage,
					// });
				} else {
					alert("Couldn't save, please try again!");
				}
			})
			.catch(error => {
				console.error('axios error', error);
			});
	};

	createNewNote = () => {
		axios
			.post('http://localhost:3030/createnewnote')
			.then(response => {
				if (response.data.newNoteCreated) {
					this.fetchNotes();
				} else {
					alert("Couldn't save, please try again!");
				}
			})
			.catch(error => {
				console.error('axios error', error);
			});
	};

	alertSomething = param => {
		alert(param);
	};

	deleteNote = noteid => {
		axios
			.post('http://localhost:3030/deletenote', {
				noteid: noteid,
			})
			.then(response => {
				if (response.data.deletionSuccess) {
					alert('Note deleted Successfully');
					this.fetchNotes();
				} else {
					alert("Couldn't delete the note, please try again!");
				}
			})
			.catch(error => {
				console.error('axios error', error);
			});
	};

	askForDeletion = noteId => {
		const response = window.confirm('Are you sure you want to  delete this note?');
		if (response) {
			this.deleteNote(noteId);
		}
	};

	toggleEdit = () => {
		this.setState({ toggleEdit: !this.state.toggleEdit });
	};

	updateStateOnNoteClick = thisNote => {
		this.setState({
			currentClickedNoteText: `${this.slashNconverter(thisNote.note)}`,
			activeNoteId: thisNote.noteid,
			reloadPage: false,
		});
	};

	render() {
		return (
			<div>
				<Header />
				<div className="notesContainer">
					<div className="notesEditorHeader">
						<div className="notesListHeader">
							<p>Notes</p>
							<button
								type="button"
								className="btn btn-primary create-button"
								onClick={this.createNewNote}
							>
								<i className="icon icon-plus" />
							</button>
						</div>
						<div
							className={`${
								this.state.toggleEdit ? 'noDisplay' : ''
							} notesWriterHeader`}
						>
							<p>Note Editor</p>
						</div>
						<div className="notesViewerHeader">
							<p>Note Preview</p>
							<button className="btn btn-primary" onClick={this.toggleEdit}>
								<i className="icon icon-edit" />
							</button>
						</div>
						<div className="notesEditorHeader" />
					</div>
					<div className="notesEditorBody">
						<div className="notesListWrap">
							<ul className="notesList">
								{this.state.allNotesOfUser.map(singleNote => (
									<li key={singleNote.noteid}>
										<button
											className={`viewNoteAct ${
												this.state.activeNoteId === singleNote.noteid
													? 'active'
													: ''
											}`}
											key={singleNote.noteid}
											onClick={() => this.updateStateOnNoteClick(singleNote)}
										>
											{singleNote.note.substr(0, 20).trim()}
										</button>
										<i
											className="deleteNoteAct icon icon-delete"
											onClick={() => this.askForDeletion(singleNote.noteid)}
										/>
									</li>
								))}
							</ul>
						</div>
						<div className="notesWrapper">
							<div
								className={`${
									this.state.toggleEdit ? 'noDisplay' : ''
								} notesCol notesEditor `}
							>
								<textarea
									onChange={this.changeStateWith}
									value={this.slashNconverter(this.state.currentClickedNoteText)}
									className="textarea"
								/>
								<div className="editorActWrap">
									<button
										className="btn btn-primary"
										type="button"
										onClick={this.saveNote}
									>
										<img src="save_icon.png" alt="save_icon" />
									</button>
								</div>
							</div>
							<div className="notesCol notesViewer">
								<Markdown markup={this.state.currentClickedNoteText} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ShowNotes;
