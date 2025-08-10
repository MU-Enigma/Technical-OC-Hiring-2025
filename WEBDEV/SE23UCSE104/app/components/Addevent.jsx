import React from 'react'
import Link from 'next/link'
const Addevent = () => {
  return (
    <div>
        <Link href="/admin/subscription">
         <div className='text-center mt-10'>
            <button className=' bg-black py-2 px-3 text-white rounded-full'>Add an event</button>
         </div>
        </Link>
     
    </div>
  )
}

export default Addevent
