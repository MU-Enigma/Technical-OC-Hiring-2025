import React from 'react'
import Link from 'next/link'
const Addblog = () => {
  return (
    <div>
      <Link href="/admin/addProduct" id="aboutus">
        <div className='text-center mt-12 mr-10'>
          <button className='p-2 py-2 px-3 bg-black rounded-full text-white max-md:ml-10'>Add Your Own Blog</button>
        </div>
      </Link>
    </div>
  )
}

export default Addblog
