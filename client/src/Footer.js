import React from 'react';
import './Footer.css'

const Footer = ({
  openAbout
})=>(
  <div
    id='footer'
    className='w-100 d-flex justify-content-end'
  >
    <a
      className='footer-link d-flex h-100 mr-3 align-items-center'
      href="https://github.com/M-Michelini/voting-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="fab fa-github"></i>
    </a>
    <button
      className='footer-link d-flex h-100 mr-3 align-items-center'
      onClick={openAbout}
    >
      <i className="fas fa-info-circle"></i>
    </button>
  </div>
)
export default Footer;
