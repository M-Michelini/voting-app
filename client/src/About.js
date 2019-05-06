import React from 'react';
import './About.css'


const About = ({close}) => (
  <div id="about-container" className="w-100 h-100 position-absolute d-flex justify-content-center">
    <div id="about-opaque-background" className="w-100 h-100 position-absolute" onClick={close}/>
    <section id="about-panel">
      <i onClick={close} id='about-close' className="fa fa-times-circle"></i>
      <h3 id="about-title">Description</h3>
      <p>
        A voting application that lets users sign in with twitter using Oauth 1.0a authentication.
        The app was built with a Node.js and Express backend, a MongoDB database and React.js on the client side.
        For any other developer info, you can head over
        to my <a
          href="https://github.com/M-Michelini/voting-app"
          target="_blank"
          rel="noopener noreferrer"
        >github</a>.
      </p>
      <h3 id="about-usage">Features</h3>
      <ul>
        <li>Twitter authentication</li>
        <li>Pagination with sort, filters and limit</li>
        <li>Create your own polls and vote on others polls.</li>
        <li>Polls can last as long as a year, or as little as an hour.</li>
        <li>Polls end at midnight in your location.</li>
      </ul>
    </section>
  </div>
)
export default About
