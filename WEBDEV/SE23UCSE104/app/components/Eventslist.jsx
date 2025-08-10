"use client"
import React, { useEffect, useState } from 'react'
import eventing from '@/data/EventsData'
import Eventcard from './Eventcard'
import axios from 'axios'
const Eventslist = () => {
    const [events, setevents] = useState([])
    const fetchevents=async()=>
    {
        const response=await axios.get("api/email")
        setevents(response.data.event)
        console.log(response.data)
    }
    const handleDelete=(id)=>
    {
        setevents(events.filter(item=>item._id!=id))
    }
    useEffect(() => {
      fetchevents()
    }, [])
    
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4">
        {events.map((item)=>(
            <Eventcard key={item._id} title={item.title} description={item.description} date={item.date} image={item.image} id={item._id}  onDelete={()=>{handleDelete(item._id)}}/>
        ))}
      </div>
    </div>
  )
}

export default Eventslist
