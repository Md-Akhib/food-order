import React from 'react'
import './Banner.css'
import { Link } from 'react-router-dom'

const Banner = (props) => {
  return (
    <div className='banner-area'>
      <div className='banner-container container section'>
        <h1 className='banner-title'>{props.title}</h1>
        <p className='banner-breadcrumbs'><Link to='/' className='banner-link'>Home </Link> / {props.title}</p>
      </div>
    </div>
  )
}

export default Banner
