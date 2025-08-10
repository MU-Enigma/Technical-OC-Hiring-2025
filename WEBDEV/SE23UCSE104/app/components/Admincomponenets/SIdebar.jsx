import React from 'react'
import Link from 'next/link'
const SIdebar = () => {
  return (
    <div>
      <div className="sidebar w-80 h-[150vh] border border-solid border-gray-300 rounded-xl font-title relative shadow-md max-sm:w-44 max-sm:hidden">
        <div className="sidebardetails">
          <div className="sidebarcontent">
            <div className="bloggerimg px-14 p-2 border border-solid border-black max-sm:h-[53px] max-sm:pl-8 max-sm:p-3">
              <Link href="/" className='flex items-center gap-1 font-title'>
                <img src="/icon-trans.png" alt="" className='w-[70px] max-sm:w-24' />
                <div className='text-lg font-semibold'>
                  Enigma
                </div>
              </Link>
            </div>
            <div className="addblogsflex items-center justify-center border border-solid border-black mt-5 p-2 ml-20 pr-10 gap-2 w-[75%] text-md md:shadow-[-7px_7px_0px_#000000] pl-5 max-sm:w-[30%]  max-sm:rounded-full max-sm:p-2">
              <Link href="/admin/addProduct" className='flex gap-2 max-sm:justify-center'>
                <img src="/add_icon.png" alt="" className='w-6' />
                <div className="addblog max-sm:hidden">
                  Add Blogs
                </div>
              </Link>

            </div>
            <div className="subscriptions  flex items-center justify-center border border-solid border-black mt-5 p-2 ml-20 pr-10 gap-2 w-[75%] text-md md:shadow-[-7px_7px_0px_#000000] max-sm:w-[30%]  max-sm:rounded-full max-sm:border-1 max-sm:p-2">
              <Link href="/admin/subscription" className='flex gap-2'>
                <img src="/add_icon.png" alt="" className='w-6' />
                <div className="addblog max-sm:hidden">
                  Add Events
                </div>
              </Link>

            </div>
            <div className="bloglists flex items-center justify-center border border-solid border-black mt-5 p-2 ml-20 pr-10 gap-2 w-[75%] text-md md:shadow-[-7px_7px_0px_#000000] max-sm:w-[30%]  max-sm:rounded-full max-sm:border-1 max-sm:p-2">
              <Link href='/admin/blogList' className='flex gap-2 '>
                <img src="/blog_icon.png" alt="" className='w-6' />
                <div className="addblog max-sm:hidden">
                  Blog lists
                </div>
              </Link>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SIdebar
