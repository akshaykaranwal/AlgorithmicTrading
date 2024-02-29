import React from 'react'
import './login.css'
export default function Login() {
  return (
    <div className='login'>
    <span className='loginTitle'>Login</span>
      <form className='loginform'>
        <label>Email</label>
        <input type='text' className='loginInput' placeholder='Enter email'/> 
        <label>Password</label>
        <input type='text' className='loginInput' placeholder='Password'/> 
        <button className='loginButton'>Login</button>
      </form>
      <button className='regButton'>Register</button>
    </div>
  )
}
