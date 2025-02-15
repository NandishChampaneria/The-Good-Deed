import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <div className='flex justify-center items-center md:mt-24 flex-col gap-10'>
            <div className='flex justify-center text-white flex-col'>
                <h1 className='sm:text-6xl text-4xl font-bold flex justify-center'>Come,</h1>
                <h1 className='sm:text-6xl text-4xl font-bold flex justify-center'>help us bring a </h1>
                <h1 className='sm:text-8xl text-6xl font-bold gradient-text flex justify-center'>Smile</h1>
                <h1 className='sm:text-6xl text-4xl font-bold flex justify-center'>to someones face.</h1>
            </div>
            <p className='text-lg text-center text-gray-600'>Create events and invite your friends<br/>to join you in a good deed.</p>
            <Link to="/login" className="btn-ceh bg-white text-black hover:bg-blue-500 hover:text-white w-56">Create Event</Link>
        </div>
    </div>
  )
}

export default Home