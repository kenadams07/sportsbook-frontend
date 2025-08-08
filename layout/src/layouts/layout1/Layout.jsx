import React from 'react'
import MainNavbar from '../../components/MainNavbar'
import { Outlet } from 'react-router-dom'
import MobileNavbar from '../../components/MobileNavbar'
import { Toaster } from '../../components/ui/sonner'

const Layout = () => {
  return (
    <div className='w-full'>
        <MainNavbar />
        <Outlet/>
        <Toaster />
        <div className=" mx-auto px-6 lg:hidden ">
            <MobileNavbar />
          </div>
    </div>
  )
}

export default Layout