"use client"
import React, { useEffect, useState } from 'react'
import { Link } from 'react-scroll'
const Hero = () => {
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
        <div>
            <div className="hero font-title" data-aos="fade-up">
                <div className="herosection">
                    <div className="main flex justify-between items-center px-24 mt-[140px]  p-3 max-md:flex max-lg:flex-col max-lg:gap-3">
                        <div className="mainheading flex flex-col justify-center gap-3 max-md:flex max-lg:gap-3">
                            <div className="welcome text-6xl font-bold max-lg:text-2xl">
                                Welcome to ENIGMA
                            </div>
                            <div className="journal text-6xl font-bold max-lg:text-2xl">
                                Journal & Events
                            </div>
                            <div>
                                Enigma, the official Computer Science club of Mahindra University.
                            </div>
                            <div className="subcaptions flex items-center gap-5 mt-3">
                                <div className='cursor-pointer hover:py-2 hover:px-3 hover:bg-black hover:rounded-full hover:text-white py-2 px-3 max-md:px-0'>
                                    <Link to="aboutus"
                                        smooth={true}
                                        offset={30}
                                        duration={800} >About Us</Link>
                                </div>
                                <div className='cursor-pointer hover:py-2 hover:px-3 hover:bg-black hover:rounded-full hover:text-white py-2 px-3 max-md:px-0'>
                                    <Link to="whatweare"
                                        smooth={true}
                                        offset={10}
                                        duration={800}>What We Do</Link>
                                </div>
                            </div>
                        </div>
                        <img src="/party.jpg" alt="" className='w-96 max-lg:mr-[10px] max-md:w-[200px] max-md:hidden' />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Hero
