import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from '../../components/navigation/Navigation'

const Public = () => {
  return (
    <div className='container'>
      <Navigation/>
      <Outlet/>
    </div>
  )
}

export default Public
