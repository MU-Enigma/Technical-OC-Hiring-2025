"use client"
import SIdebar from "../components/Admincomponenets/SIdebar"
import { ToastContainer } from 'react-toastify';
import React, { useState } from 'react';
import Link from "next/link";
export default function Layout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>

            <div className="flex relative font-title">
                <ToastContainer theme="dark" />

                {/* Desktop Sidebar */}
                <div className="hidden sm:block">
                    <SIdebar />
                </div>

                {/* Mobile Sidebar */}
                <div
                    className={`sm:hidden fixed top-0 left-0 h-full z-50 bg-white shadow-lg transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <SIdebar />
                </div>

                <div className="flex flex-col w-full">

                    {/* Top Navbar */}
                    <div className="flex justify-between items-center max-h-[60px] py-2 w-full border border-black px-6">
                        <div
                            className="image2 sm:hidden cursor-pointer"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <img src="/menu.png" alt="menu" />
                        </div>

                        <div className="adminpanel font-semibold">Admin Panel</div>
                        <img src="/profile_icon.png" alt="profile" className="w-9" />
                    </div>

                    {/* Children content */}
                    {children}
                    {mobileMenuOpen && (
                        <div className="absolute top-14 ml-1 w-[200px] h-64 bg-gray-200 sm:hidden">
                            <div className="mt-5">
                                <div className="addblogs ">
                                    <div className="w-[180px] active:bg-black">
                                        <Link href="/">
                                            <div className="m-3 mr-9 ">
                                                Home
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                    <div className="w-[180px] active:bg-black">
                                        <Link href="/admin/addProduct">
                                            <div className="addblog m-3 mr-9" onClick={() => setMobileMenuOpen(false)}>
                                                Add Blogs
                                            </div>
                                        </Link>
                                    </div>
                                <div className="w-[180px] active:bg-black">
                                    <div className="bloglists ">
                                        <Link href='/admin/blogList' className=''>

                                            <div className="addblog m-3 mr-8" onClick={() => setMobileMenuOpen(false)}>
                                                Blog lists
                                            </div>
                                        </Link>

                                    </div>
                                </div>
                                <div className="w-[180px] active:bg-black">
                                    <div className="subscriptions">
                                        <Link href="/admin/subscription" className=''>

                                            <div className="addblog m-3" onClick={() => setMobileMenuOpen(false)}>
                                                Add Events
                                            </div>
                                        </Link>

                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay to close sidebar */}

        </>
    );
}
