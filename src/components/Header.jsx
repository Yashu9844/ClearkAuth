import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className='flex items-center justify-between m-5 md:m-10'>
      
      <div className="">
      <Link href='/' className='text-2xl font-extrabold group cursor-pointer'>
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 drop-shadow-md group-hover:from-blue-400 group-hover:to-blue-600'>
            Auth
          </span>
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700 drop-shadow-md group-hover:from-purple-400 group-hover:to-purple-600'>
            App
          </span>
        </Link>
      </div>
      <div className="flex  gap-4">
         <Link href={"/"}>Home</Link>
         <Link href={"/about"}>about</Link>
         <Link href={"/sign-in"}>Sign in</Link>
      </div>
    </div>
  )
}

export default Header
