import React, {Component} from 'react';
import './index.css';

const FADE_TIME = 500;

const AlertComponent = ({
  type,
  message,
  time,
  leaving,
  handleClose
}) => {
  return(
    <div id="alert" className={`alert container alert-${type}${leaving?' closing':' opening'}`} role="alert">
      {message}
      <button type="button" className="close" aria-label="Close" onClick={handleClose}>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  )
}

class Alert extends Component{
  constructor(){
    super();
    this.state = {leaving:false};
    this.timeout = null;

    this.startClosing = this.startClosing.bind(this);
    this.reset = this.reset.bind(this);
  }
  reset(){
    const closeTime = (this.props.time) - FADE_TIME;
    clearInterval(this.timeout);
    this.timeout = setTimeout(this.startClosing,closeTime);
    this.setState({leaving:false})
  }
  startClosing(){
    clearInterval(this.timeout)
    this.setState({leaving:true});
    this.timeout = setTimeout(this.props.closeAlert,FADE_TIME);
  }
  componentDidUpdate(prevProps){
    if(prevProps.message!==this.props.message){
      this.reset();
    }
  }
  componentWillMount(){
    this.reset();
  }
  componentWillUnmount(){
    clearInterval(this.timeout);
  }
  render(){
    return <AlertComponent {...this.props} leaving={this.state.leaving} handleClose={this.startClosing}/>
  }
}

export default Alert;
