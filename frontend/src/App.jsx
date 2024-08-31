import React from 'react'
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Allbooks from './pages/BookStore';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails';
import Agenda from './pages/Agenda'; // 

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Allbooks />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/details/:id" element={<ViewBookDetails />} />
          <Route path="/agenda" element={<Agenda />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App