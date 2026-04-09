import React from 'react'
import './PageNotFound.css'
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {
    const navigate = useNavigate();
    return (
        <div className='container section error-container'>
            <h1>404</h1>
            <h3>Sorry Page Was Not Found!</h3>
            <p>Household shameless incommode at no objection behaviour. Especially do at he possession insensible sympathize boisterous it. Songs he on an widen me event truth.</p>
            <button className='error-btn' onClick={() => navigate('/')}>Back To Home</button>
        </div>
    )
}

export default PageNotFound