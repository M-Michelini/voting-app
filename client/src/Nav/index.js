import React from 'react';
import {Link} from "react-router-dom";
import TwitterLogin from 'react-twitter-auth';
import './index.css';

const NavAuth = ({
  handleLogin,
  loginFailure
}) => (
  <TwitterLogin
    requestTokenUrl="/api/auth/twitter/request_token"
    loginUrl="/api/auth/twitter/verification"
    onSuccess={handleLogin}
    onFailure={loginFailure}
    className="btn btn-less-light twitter-auth"
    text='Sign in'
  />
)

const NavUser = ({
  image,
  username,
  handleLogout
}) => (
  <div id="user-badge" className="dropdown">
    <button className="badge-btn dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {image?<img
        id="profile-pic"
        alt="Profile pic"
        src={image}
      />:null}
      {username}
    </button>
    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu2">
      <button className="dropdown-item" type="button" onClick={handleLogout}>Logout</button>
    </div>
  </div>
)

const Nav = ({
  currentUser,
  handleLogin,
  handleLogout
}) => (
  <div id="nav">
    <Link id="nav-header" to=''><h1>ReactVote</h1></Link>
    {
      currentUser ?
        <NavUser handleLogout={handleLogout} {...currentUser}/>:
        <NavAuth
          handleLogin={handleLogin}
          loginFailure={()=>{
            this.props.setAlert('Login failed!')
          }}
        />
    }
  </div>
)

export default Nav
