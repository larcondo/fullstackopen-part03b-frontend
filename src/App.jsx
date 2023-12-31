import { useState, useEffect } from "react"
// import axios from 'axios'
import noteService from './services/notes'
import Note from "./components/Note"
import Notification from "./components/Notification"

function App(props) {
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  // const [errorMessage, setErrorMessage] = useState('some error happened...')
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    noteService.getAll()
    .then( initialNotes => {
      setNotes(initialNotes)
    })
  }

  useEffect(hook, [])
  // console.log('render', notes.length, 'notes');

  const addNote = (event) => {
    event.preventDefault()
    // console.log('button clicked', event.target)
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }

    // axios
    //   .post('http://localhost:3001/notes', noteObject)
    //   .then( response => {
    //     // console.log(response)
    //     setNotes(notes.concat(response.data))
    //     setNewNote('')
    //   })
    noteService.create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }

  const toggleImportanceOf = (id) => {
    // console.log('importance of ' + id + ' needs to be toggled')
    // console.log(`importance of ${id} needs to be toggled`)
    // const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    // axios.put(url, changedNote)
    //   .then(response => {
    //     setNotes(notes.map(n => n.id !== id ? n : response.data))
    //   })
    noteService.update(id, changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      setErrorMessage(`the note '${note.content}' was already deleted from server`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  const handleNoteChange = (event) => {
    // console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  if (!notes) return null

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
      </div>
      <ul>
        { notesToShow.map( note => 
          <Note key={note.id} 
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} />)
        }
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  
  return(
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2023</em>
    </div>
  )
}

export default App