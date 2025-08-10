"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
const Hero2 = ({ title, description, category, image, id }) => {
  const [del, setdel] = useState(false)

  const handledel=async()=>
  {
    const res=await axios.delete(`api/blogdel/${id}`)
    const data=await res.json()
    console.log(data)
  }
  return (
    <div>
      <div className="w-[280px] sm:w-[300px] rounded-2xl overflow-hidden border border-black bg-white shadow-md hover:shadow-[-8px_8px_0px_#000] transition-all duration-300 ease-in-out mt-14" data-aos="fade-up">
        <Link href={`/blogpost/${id}`}>
          <div className="overflow-hidden">
            <Image
              src={image}
              alt={title}
              width={200}
              height={200}
              className="w-full h-[180px] object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
        <div className="p-4">
          <span className="inline-block bg-black text-white text-xs px-3 py-1 rounded-full mb-2">{category}</span>
          <h3 className="text-lg font-bold mb-1 line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>

          <Link href={`/blogpost/${id}`}>
            <div className="flex items-center text-sm font-semibold text-black hover:underline">
              Read more
              <img src="/arrow.png" alt="arrow" className="ml-2 w-4 h-4" />
            </div>
          </Link>
          <div className='ml-5 mt-4 cursor-pointer' onClick={handledel}> 
              <img src="/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" alt="" />
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Hero2
