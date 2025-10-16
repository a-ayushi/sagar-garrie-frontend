import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar';
import Home from './component/Home';
import Menu from './component/Menu';
import BookingForm from './component/BookingForm';
import Contact from './component/Contact';
import Login from './component/Login';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/book-table" element={<BookingForm />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/menu-card" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminPage />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;