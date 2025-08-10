"use client"
import React, { useState } from 'react'
import { assets } from '@/public/assets'
import { ToastContainer, toast } from 'react-toastify'
import Image from 'next/image'
import axios from 'axios'

const Page = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Startup",
    author: "Alex Bennet",
    authorImg: "/author_img.png"
  })

  const [image, setImage] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleFileChange = (e) => {
    setImage(e.target.files[0])
  }

  const onSubmitChange = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('category', form.category)
    formData.append('author', form.author)
    formData.append('authorImg', form.authorImg)
    formData.append("image", image) // ✅ matched with backend

    try {
      const response = await axios.post('/api/blog', formData)

      console.log(response.data)
      if (response.data.success) {
        toast.success(response.data.msg)
        // Optionally clear form after success:
        setForm({
          title: "",
          description: "",
          category: "Startup",
          author: "Alex Bennet",
          authorImg: "/author_img.png"
        })
        setImage(null)
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
        <div className='m-10 ml-10 text-3xl font-bold'>Add Blogs:</div>
        <form
          onSubmit={onSubmitChange}
          className='ml-10 mt-10 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:ml-0'
        >
          <div className='font-semibold'>Upload Thumbnail</div>
          <label htmlFor="image">
            <Image
              src={image ? URL.createObjectURL(image) : assets.upload_area}
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

          <div className='mt-5'>Blog Title</div>
          <input
            type="text"
            placeholder='Type Here'
            className='w-[34%] p-2 mt-5 border border-solid max-sm:w-32'
            name="title"
            value={form.title}
            onChange={handleChange}
          />

          <div className='mt-5'>Blog Description</div>
          <textarea
            name="description"
            placeholder='Write content here'
            className='w-[34%] h-44 p-2 border border-solid max-sm:w-44'
            value={form.description}
            onChange={handleChange}
          />

          <div className='mt-3'>Blog Category</div>
          <select
            name="category"
            className='mt-3 p-2 border border-solid px-10 max-sm:px-2'
            value={form.category}
            onChange={handleChange}
          >
            <option value="Startup">Startup</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Technology">Technology</option>
          </select>

          <br />

          <button
            type='submit'
            className='mt-7 px-7 p-2 w-40 bg-black text-white max-sm:px-3 max-sm:w-32'
          >
            Add
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  )
}

export default Page
