import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NavSide } from './components'
import './index.css'
import App from './App'
import Books from './pages/books'
import Users from './pages/users'
import UserDetails from './pages/users/user-details'
import BookDetails from 'pages/books/book-details'
import { store } from './redux/store'
import { Provider } from 'react-redux'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <Provider store={store}>
    <Router>
      <NavSide>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />
        </Routes>
      </NavSide>
    </Router>
  </Provider>,
)
