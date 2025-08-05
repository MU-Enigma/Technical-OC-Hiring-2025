import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { About } from "./pages/About";
import { FAQ } from "./pages/FAQ";
import { Features } from "./pages/Features";
import { Footer } from "./pages/Footer";
import { Hero } from "./pages/Hero";
import { Navbar } from "./pages/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import { Services } from "./pages/Services";
import { Sponsors } from "./pages/Sponsors";
import { Team } from "./pages/Team";
// import { Testimonials } from "./components/Testimonials";
import "./App.css";
import EventsPage from "./pages/EventsPage";
import BlogPage from "./pages/BlogPage";
import BlogEditPage from "./pages/BlogEditPage";
import BlogViewPage from "./pages/BlogViewPage";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Hero />
              <Sponsors />
              <About />
              <Features />
              <Services />
              <Team />
              <FAQ />
              <Footer />
            </>
          }
        />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blogs/edit" element={<BlogEditPage />} />
        <Route path="/blogs/edit/:id" element={<BlogEditPage />} />
        <Route path="/blogs/:id" element={<BlogViewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
