import React from 'react'
import './register.css'
export default function Register() {
  return (
    <div className='register'>
    <span className='registerTitle'>Register</span>
      <form className='registerform'>
        <label>Username</label>
        <input type='text' className='registerInput' placeholder='Enter Username'/> 
        <label>Email</label>
        <input type='text' className='registerInput' placeholder='Enter email'/> 
        <label>Password</label>
        <input type='text' className='registerInput' placeholder='Password'/> 
        <button className='registerButton'>Login</button>
      </form>
      <button className='logButton'>Login</button>
    </div>
  )
}
