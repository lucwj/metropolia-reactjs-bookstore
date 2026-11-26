import { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { FIREBASE_URL } from './firebase'
import './App.css'

ModuleRegistry.registerModules([AllCommunityModule])

const emptyBook = { title: '', author: '', year: '', isbn: '', price: '' }

function App() {
  const [books, setBooks] = useState([])
  const [book, setBook] = useState(emptyBook)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = () => {
    fetch(FIREBASE_URL + '.json')
      .then((response) => response.json())
      .then((data) => addKeys(data))
      .catch((err) => console.error(err))
  }

  const addKeys = (data) => {
    if (!data) {
      setBooks([])
      return
    }
    const keys = Object.keys(data)
    const valueKeys = Object.values(data).map((item, index) =>
      Object.defineProperty(item, 'id', { value: keys[index] })
    )
    setBooks(valueKeys)
  }

  const inputChanged = (event) => {
    setBook({ ...book, [event.target.name]: event.target.value })
  }

  const addBook = () => {
    fetch(FIREBASE_URL + '.json', {
      method: 'POST',
      body: JSON.stringify(book),
    })
      .then(() => {
        setBook(emptyBook)
        fetchBooks()
      })
      .catch((err) => console.error(err))
  }

  const deleteBook = (id) => {
    fetch(FIREBASE_URL + '/' + id + '.json', { method: 'DELETE' })
      .then(() => fetchBooks())
      .catch((err) => console.error(err))
  }

  const colDefs = [
    { field: 'title', sortable: true, filter: true },
    { field: 'author', sortable: true, filter: true },
    { field: 'year', sortable: true, filter: true },
    { field: 'isbn', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true },
    {
      headerName: '',
      field: 'id',
      sortable: false,
      filter: false,
      cellRenderer: (params) => (
        <button onClick={() => deleteBook(params.value)}>Delete</button>
      ),
    },
  ]

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">Bookstore</Typography>
        </Toolbar>
      </AppBar>
      <div style={{ marginTop: 16 }}>
        <input placeholder="Title" name="title" value={book.title} onChange={inputChanged} />
        <input placeholder="Author" name="author" value={book.author} onChange={inputChanged} />
        <input placeholder="Year" name="year" value={book.year} onChange={inputChanged} />
        <input placeholder="ISBN" name="isbn" value={book.isbn} onChange={inputChanged} />
        <input placeholder="Price" name="price" value={book.price} onChange={inputChanged} />
        <button onClick={addBook}>Add</button>
      </div>
      <div style={{ height: 500, width: '100%', marginTop: 16 }}>
        <AgGridReact rowData={books} columnDefs={colDefs} />
      </div>
    </>
  )
}

export default App
