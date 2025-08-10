import React from 'react'

const Hero3 = () => {
  return (
    <div>
        <div className="hero3 font-title" data-aos="fade-up">
            <div className="hero3details">
                <div className="eventssection">
                    <div className="events text-center mt-36 text-4xl font-bold">
                        Events
                    </div>
                    <div className="selections flex gap-5 justify-center items-center mt-10">
                        <div className="Completed cursor-pointer hover:py-2 hover:px-3 hover:bg-black hover:rounded-full hover:text-white py-2 px-3">
                            Completed Events
                        </div>
                        <div className="upcomingevents cursor-pointer hover:py-2 hover:px-3 hover:bg-black hover:rounded-full hover:text-white py-2 px-3">
                            Upcoming Events
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero3
