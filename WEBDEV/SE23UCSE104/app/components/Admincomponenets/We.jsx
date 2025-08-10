import React from 'react'

const We = () => {
  return (
    <div>
      <di className="section4 font-title">
        <div className="section4details" id="whatweare">
            <div className="wedetails mt-48">
                <div className='text-center text-3xl font-bold'>What We Do</div>
                <p className='text-center mt-5'>Here's what to look for when you join Enigma or attend an event</p>
            </div>
            <div className="fourflexboxes flex items-center justify-between gap-5 mt-5 px-10 max-lg:flex max-lg:flex-col max-lg:items-center max-lg:justify-center">
                <div className="box1 w-[30%] flex flex-col justify-center items-center border border-solid border-black p-2 max-lg:w-[80vw]">
                    <div className='text-center'>Events</div>
                    <p className='w-[100%] ml-5 mt-3'>We organize hackathons and workshops throughout the year, as well as socials for networking.</p>
                </div>
                <div className="box2 w-[30%] flex flex-col justify-center items-center border border-solid border-black p-2 max-lg:w-[80vw] ">
                    <div className='text-center'>Sub-committees</div>
                    <p className='w-[100%] ml-5 max-lg:ml-10 mt-3 max-lg:w-[100%]'>Enigma has several subcommittees, for SysTems, WebDev, GameDev, AI/ML, Comp Coding and more</p>
                </div>
                <div className="box3 w-[30%] flex flex-col justify-center items-center border border-solid border-black p-2 max-lg:w-[80vw]">
                    <div className='text-center'>Collaborations</div>
                    <p className='w-[100%] ml-5 mt-3'>We organize hackathons and workshops throughout the year, as well as socials for networking.</p>
                </div>
                <div className="box4 w-[30%] flex flex-col justify-center items-center border border-solid border-black p-2 max-lg:w-[80vw]">
                    <div className='text-center'>Prizes</div>
                    <p className='w-[100%] ml-5 mt-3'>We organize hackathons and workshops throughout the year, as well as socials for networking.</p>
                </div>
            </div>
        </div>
      </di>
    </div>
  )
}

export default We
