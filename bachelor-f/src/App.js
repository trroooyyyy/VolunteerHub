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
import Users from "./components/Users";
import EditUser from "./components/EditUser";
import Associations from "./components/Associations";
import Events from "./components/Events";
import EventOne from "./components/EventOne";
import Review from "./components/Review";
import AboutService from "./components/AboutService";


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
              <Route path="/profile" element={!token ? <Navigate to="/login" /> : <><Profile/><Header/><Footer/></>}></Route>
              <Route path="/profile/:userId" element={!token ? <Navigate to="/login" /> : <><Profile/><Header/><Footer/></>}></Route>
              <Route path="/users" element={!token ? <Navigate to="/login" /> : <><Header/><Users/><Footer/></>}></Route>
              <Route path="/edit/:userId" element={!token ? <Navigate to="/login" /> : <EditUser/>}></Route>
              <Route path="/associations/" element={!token ? <Navigate to="/login" /> : <><Header/><Associations/><Footer/></>}></Route>
              <Route path="/association/:associationId/users" element={!token ? <Navigate to="/login" /> : <><Header/><Users/><Footer/></>}></Route>
              <Route path="/all-events" element={!token ? <Navigate to="/login" /> : <><Header/><Events/><Footer/></>}></Route>
              <Route path="/all-events/:associationId" element={!token ? <Navigate to="/login" /> : <><Header/><Events/><Footer/></>}></Route>
              <Route path="/event/:eventId" element={!token ? <Navigate to="/login" /> : <><Header/><EventOne/><Footer/></>}></Route>
              <Route path="/review/event/:eventId" element={!token ? <Navigate to="/login" /> : <><Header/><Review/><Footer/></>}></Route>
              <Route path="/about-service" element={<><Header/><AboutService/><Footer/></>}></Route>
          </Routes>
      </Router>
  );
}

export default App;
