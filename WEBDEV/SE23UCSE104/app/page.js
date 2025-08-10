"use client"
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Bloglist from "./components/Bloglist";
import Hero3 from "./components/Hero3";
import Eventslist from "./components/Eventslist";
import { ToastContainer,toast } from "react-toastify";
import AOS from "aos";
import Addblog from "./components/Addblog";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import Aboutus from "./components/Aboutus";
import We from "./components/Admincomponenets/We";
import { Link, Element } from 'react-scroll';
import Addevent from "./components/Addevent";
export default function Home() {
  useEffect(() => {
  AOS.init({ duration: 1000, once: true });
}, []);
 const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-[100%] h-[100%] object-cover z-0 dark:bg-black"
      >
        <source src="/istockphoto-1365468767-640_adpp_is.mp4" type="video/mp4" className="dark:bg-black"/>
        Your browser does not support the video tag.
      </video>
      
      <div className="relative z-10">
        <Navbar className="fixed top-0 z-10"/>
        <Hero />
        <Hero3/>
        <Eventslist/>
        <Addevent/>
        <Bloglist />
        <Addblog/>
        <Aboutus/>
        <We/>
        <Footer />
      </div>
    </div>
  );
}
