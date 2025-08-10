import React from 'react'
import Link from 'next/link'
const Navbar = () => {
    return (
        <div>
            <div className="navbar font-title">
                <div className="navbardetails">
                    <div className="navbarflex flex justify-between items-center px-24 m-5 max-sm:flex-col max-sm:items-center max-sm:justify-center">
                        <div className="img">
                            <img src="/icon-trans.png" alt="" className='w-20' />
                        </div>
                        <ul className='flex gap-5'>
                            
                        </ul>
                        <div className="getstartedflex flex items-center gap-3 cursor-pointer hover:py-2 hover:px-3 hover:bg-black hover:rounded-full hover:text-white py-2 px-3">
                            <Link href="/admin/addProduct" className='flex items-center gap-3 max-sm:flex max-sm:items-center '>
                                <div className="getstarted">
                                    <button className='max-sm:text-xs'>Get Started</button>
                                </div>
                                <div className="arrow">
                                    <img src="/arrow.png" alt=""className=' max-sm:w-3' />
                                </div>
                            </Link>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Navbar
