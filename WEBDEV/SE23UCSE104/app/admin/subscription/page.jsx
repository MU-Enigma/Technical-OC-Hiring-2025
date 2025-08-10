"use client"
import React, { useState } from 'react'
import { assets } from '@/public/assets'
import { ToastContainer, toast } from 'react-toastify'
import Image from 'next/image'
import axios from 'axios'
const Page = () => {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    category: "Startup",
    author: "Alex Bennet",
    authorImg: "/author_img.png"
  })

  const [img, setImg] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setEvent({ ...event, [name]: value })
  }

  const handleFileChange = (e) => {
    setImg(e.target.files[0])
  }

  const onSubmitChange = async (e) => {
    e.preventDefault()
    const eventdata = new FormData()
    eventdata.append('title', event.title)
    eventdata.append('description', event.description)
    eventdata.append('category', event.category)
    eventdata.append('author', event.author)
    eventdata.append('authorImg', event.authorImg)
    eventdata.append("image", img) // ✅ matched with backend

    try {
      const response = await axios.post('/api/email', eventdata)

      console.log(response.data)
      if (response.data.success) {
        toast.success(response.data.msg)
        setEvent({
          title: "",
          description: "",
          category: "Startup",
          author: "Alex Bennet",
          authorImg: "/author_img.png"
        })
        setImg(null)
      } else {
        toast.error("Blog creation failed")
      }
    } catch (error) {
      console.error("Error uploading blog:", error)
      toast.error("Something went wrong. Try again.")
    }
  }

  return (
    <div>
      <div className="addblogs">
         <div className='m-10 ml-10 text-3xl font-bold'>Add an Event:</div>
        <form
          onSubmit={onSubmitChange}
          className='ml-10 mt-10 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:ml-0'
        >
          <div className='font-semibold'>Upload Thumbnail</div>
          <label htmlFor="image">
            <Image
              src={img ? URL.createObjectURL(img) : assets.upload_area}
              alt="upload"
              className='w-36 mt-5'
              width={50}
              height={30}
            />
          </label>

          <input
            type="file"
            id="image"
            name="image" // ✅ IMPORTANT: add name for FormData
            hidden
            required
            onChange={handleFileChange}
          />

          <div className='mt-5'>Event Title</div>
          <input
            type="text"
            placeholder='Type Here'
            className='w-[34%] p-2 mt-5 border border-solid max-sm:w-32'
            name="title"
            value={event.title}
            onChange={handleChange}
          />

          <div className='mt-5'>Event Description</div>
          <textarea
            name="description"
            placeholder='Write content here'
            className='w-[34%] h-44 p-2 border border-solid max-sm:w-44'
            value={event.description}
            onChange={handleChange}
          />
          <div>
            <button
            type='submit'
            className='mt-7 px-7 p-2 w-40 bg-black text-white max-sm:px-3 max-sm:w-32'>
            Add
          </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  )
}

export default Page
