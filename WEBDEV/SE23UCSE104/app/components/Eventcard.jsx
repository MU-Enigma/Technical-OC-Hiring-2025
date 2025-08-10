import React from 'react'
import Image from 'next/image'
import axios from 'axios'
const Eventcard = ({title,description,image,date,id}) => {
  const handledel=async()=>
  {
    const res=await axios.delete(`api/eventdel/${id}`)
    const data=await res.json()
    console.log(data)
  }
  return (
    <div>
      <div className="w-[280px] sm:w-[300px] rounded-2xl overflow-hidden border border-black bg-white shadow-md hover:shadow-[-8px_8px_0px_#000] transition-all duration-300 ease-in-out mt-14" data-aos="fade-up">
        <div className="overflow-hidden">
          <Image
            src={image}
            alt={title}
            width={200}
            height={200}
            className="w-full h-[180px] object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{new Date(date).toDateString()}</p>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>
         <div className='ml-5 mt-4 cursor-pointer' onClick={handledel}> 
              <img src="/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" alt="" />
          </div>
      </div>
    </div>
    </div>
  )
}

export default Eventcard
