import React from 'react'
import Image from 'next/image'
import { assets } from '@/public/assets'
const Footer = () => {
    return (
        <div>
            <div className="footer font-title">
                <div className="footerdetails">
                    <div className="flex justify-around items-center bg-black text-white mt-36 p-2 max-md:flex-col max-md:gap-3">
                        <div className="img">
                            <img src="icon-trans.png" alt="" className='w-14'/>
                        </div>
                        <div className='max-sm:text-sm'>All right reserved. Copyright @mu-enigma</div>
                        <div className="flex items-center gap-3">
                            <Image src={assets.facebook_icon} alt="" width={40}></Image>
                            <Image src={assets.twitter_icon} alt="" width={40}></Image>
                            <Image src={assets.googleplus_icon} alt="" width={40}></Image>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
