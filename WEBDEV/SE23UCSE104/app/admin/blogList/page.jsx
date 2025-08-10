"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
const page = () => {
    const [posts, setposts] = useState([])

    const fetchdata = async () => {
        const response = await axios.get("/api/blog")
        setposts(response.data.blogs)
        console.log(response.data.blogs)
    }
    useEffect(() => {
        fetchdata()
    }, [])


    return (
        <div className='flex flex-wrap ml-16'>
            {posts.map((item) => {
                return <div className="card w-[250px] relative mt-20 border border-solid border-black hover:border hover:border-solid hover:border-black text-md hover:shadow-[-7px_7px_0px_#000000]">
                    <Link href={`/blogpost/${item._id}`}>
                    <div className="blogpic">
                        <Image src={item.image} alt="" className='w-56 p-3 cursor-pointer' width={440} height={440}/>
                    </div>
                    </Link>
                    <p className='mt-4  ml-5 inline-block bg-black text-white text-sm'>{item.category}</p>
                    <div>
                        <h5 className='text-sm font-semibold mt-3 p-2 '>{item.title}</h5>
                        <p className='mt-1 text-sm/[17px] p-2 font-light'>{item.description}</p>
                        <div className='flex items-center py-2 font-semibold justify-center cursor-pointer'>
                            Read more
                            <img src="/arrow.png" alt="" className='ml-2' />
                        </div>
                    </div>
                </div>
            })}
        </div>
    )
}

export default page
