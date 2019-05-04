import React,{Component} from 'react';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Nav from './Nav';
import Alert from './Alert';
import Paginator from './Paginator';
import PollForm from './PollForm';
import Poll from './Poll'
import Footer from './Footer'

import './App.css';

class App extends Component{
  constructor(){
    super();
    this.state = {
      currentUser:null,
      alert:null,
      initing:localStorage.getItem('user')//if the user is logged in and needs to be fetched on refresh
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.setAlert = this.setAlert.bind(this);
  }
  componentDidMount(){
    if(!this.state.initing) return;
    this.handleInit.bind(this)();
  }
  handleInit(){
    fetch(`/api/auth/twitter/login`,{
      method:'POST',
      headers:{
        authorization:`Bearer ${this.state.initing}`,
      }
    })
    .then(r=>r.ok ? r.json():null)
    .then(user=>{
      if(!user) throw Error('Something went wrong')
      this.setState({currentUser:user,initing:false})
    }).catch(e=>{
      this.setState({initing:false})
    })
  }
  handleLogout() {
    this.setAlert(`Logout successful.`);
    this.setState({currentUser:null});
    localStorage.removeItem('user');
  }
  handleLogin(resp) {
    resp.json().then(currentUser=>{
      this.setAlert(`Welcome ${currentUser.username}! You can now create your own polls, and vote on other currentUsers polls.`,'success')
      localStorage.setItem('user',currentUser.token)
      this.setState({currentUser});
    })
  }
  setAlert(message,type='danger',time=5000){
    this.setState({
      alert:message===null?null:{
        message,
        type,
        time
      }
    })
  }
  render(){
    const {currentUser,alert,initing}=this.state;
    if(initing) return <div/>
    return (
      <Router>
        <Nav
          currentUser={currentUser}
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
          setAlert={this.setAlert}
        />
        <div id="main">
          {!alert?null:<Alert closeAlert={()=>{this.setAlert(null)}} {...alert} />}
          <Switch>
            <Route
              exact
              path="/"
              render={({location})=>
                <Paginator
                  setAlert={this.setAlert}
                  currentUser={currentUser}
                />
              }
            />
            <Route
              exact
              path="/new"
              render={()=><PollForm setAlert={this.setAlert} currentUser={currentUser}
              />}
            />
            <Route
              path='/:_id'
              render={({match})=><Poll
                setAlert={this.setAlert}
                id={match.params._id}
                currentUser={currentUser}
              />}
            />
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
