import './App.css';
import Header from "./components/Header";
import Offer from "./components/Offer";
import Features from "./components/Features";
import About from "./components/About";
import AdditionMenu from "./components/AdditionMenu";
import Footer from "./components/Footer";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import LogIn from "./components/LogIn";
import Register from "./components/Register";
import Profile from "./components/Profile";


function App() {
    const token = localStorage.getItem('token');

    return (
      <Router>
          <Routes>
              <Route path="/" element={
                  <>
                      <Header />
                      <Offer  />
                      <Features />
                      <About />
                      <AdditionMenu />
                      <Footer />
                  </>
              }></Route>
              <Route path="/login" element={token ? <Navigate to="/profile" /> : <LogIn />} />
              <Route path="/register" element={token ? <Navigate to="/profile" /> : <Register />}></Route>
              <Route path="/profile" element={!token ? <Navigate to="/login" /> : <><Profile/><Header/></>}></Route>

          </Routes>
      </Router>
  );
}

export default App;
