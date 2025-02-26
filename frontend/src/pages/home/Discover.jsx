import React from 'react'
import Events from '../../components/common/Events'
import Organizations from '../../components/common/Organizations'
import { Link } from 'react-router-dom'

const Discover = () => {
  return (
    <>
      <div className="container mx-auto px-6">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="sm:text-3xl text-xl text-white font-semibold">Discover Events</h1>
          <Link to='/allevents' className="p-2 bg-black text-sm rounded-lg text-white hover:bg-white hover:text-black transition-all duration-300 ease-in-out font-semibold">View all</Link>
        </div>
      </div>

      <div className='mb-16'><Events feedType="active" limit={8} /></div>

      <div className="container mx-auto px-6">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="sm:text-3xl text-xl text-white font-semibold">Discover Organizations</h1>
          <Link to='/allorganizations' className="p-2 bg-black text-sm rounded-lg text-white hover:bg-white hover:text-black transition-all duration-300 ease-in-out font-semibold">View all</Link>
        </div>
      </div>

      <div><Organizations /></div>
    </>
  )
}

export default Discover