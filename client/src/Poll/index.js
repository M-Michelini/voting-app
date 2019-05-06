import React,{Component} from 'react';
import {Redirect} from "react-router-dom";

const Nomination = ({
  title,
  votes,
  index,
  max,
  total,
  hasUsersVote,
  castVote,
  finished
}) => (
  <div className="d-flex flex-column w-100 align-items-center list-group-item">
    <p className="w-100 m-0 text-center">{title}</p>
    <div className="d-flex w-100 align-items-center">
      {!finished?<input type="checkbox" name={index} checked={hasUsersVote} onChange={castVote} />:null}
      <div className="progress flex-grow-1" style={{height:20}}>
        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={100*votes/max} aria-valuemin="0" aria-valuemax="100" style={{color:'black',backgroundColor:hasUsersVote?'rgb(150,170,225)':'rgb(150,225,170)',width:`${max?100*votes/max:0}%`}}>
          <div className='position-absolute'>{votes}/{total}</div>
        </div>
      </div>
    </div>
  </div>
)

const PollComponent = ({
  title,
  votes,
  nominations,
  castVote,
  usersVote,
  finished
}) => {
  const winnerVotes = Math.max(...nominations.map(n=>n.voters.length));
  const total = nominations.reduce((acc,n)=>acc+n.voters.length,0);
  const nominationTags = nominations.map((n)=>{
    return <Nomination
      castVote={()=>castVote(n.index)}
      hasUsersVote={usersVote===n.index}
      key={n.index}
      title={n.title}
      total={total}
      votes={n.voters.length}
      max={winnerVotes}
      finished={finished}
    />
  })
  return(
    <div id="poll-container" className='container'>
      <h1 id="poll-title" className="text-center">{title}</h1>
      <ul className="list-group">
        {nominationTags}
      </ul>
    </div>
  )
}

export default class Poll extends Component{
  constructor(){
    super();
    this.state={
      title:null,
      nominations:[],
      error:null,
      usersVote:-1,
      finishDate:false,
      fetching:true
    }

    this.fetchData = this.fetchData.bind(this);
    this.castVote = this.castVote.bind(this);
  }
  componentDidMount(){
    this.fetchData();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.currentUser !== prevProps.currentUser ||
      (!prevState.nominations.length&&this.state.nominations.length)
    ){
      const userNomination = !this.props.currentUser ? null:this.state.nominations.find(n=>n.voters.includes(this.props.currentUser._id))
      this.setState({
        usersVote:
          !userNomination?-1:
          userNomination.index
      });
    }
  }
  fetchData(){
    const {id}=this.props;
    fetch('/api/poll/'+id)
    .then(r=>r.ok ? r.json():null)
    .then(data=>{
      if(!data) throw Error('Something went wrong')
      this.setState({
        fetching:false,
        nominations:data.nominations,
        title:data.title,
        finishDate:data.finish_at
      })
    }).catch(e=>{
      this.setState({fetching:false,error:true})
    })
  }
  castVote(nominationIndex){
    if(!this.props.currentUser) return this.props.setAlert(
      'You need to sign in to vote!'
    );
    if(this.state.fetching) return;
    this.setState({fetching:true})
    const pull=this.state.usersVote===nominationIndex;
    fetch(`/api/poll/${this.props.id}/vote`,{
      method:'PUT',
      headers:{
        authorization:`Bearer ${this.props.currentUser.token}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({nominationIndex,pull})
    })
    .then(r=>r.ok ? r.json():null)
    .then(()=>{
      let newNominations = [...this.state.nominations];
      const nomToPull = newNominations.find(n=>n.index===this.state.usersVote);
      const nomToPush = newNominations.find(n=>n.index===nominationIndex);
      if(nomToPull) nomToPull.voters=nomToPull.voters.filter(id=>id!==this.props.currentUser._id);
      if(!pull) nomToPush.voters.push(this.props.currentUser._id)
      this.setState({
        fetching:false,
        nominations:newNominations,
        usersVote:pull?-1:nominationIndex
      })
    }).catch(e=>{
      console.log(e)
      this.setState({error:true,fetching:false})
    })
  }
  render(){
    const {title,nominations,error,usersVote,finishDate,fetching} = this.state;
    return(
      (fetching&&!title) ?
        <div>Loading</div>:
        error || !title ?
          <Redirect to="" />:
          <PollComponent
            castVote={this.castVote}
            usersVote={usersVote}
            nominations={nominations}
            title={title}
            finished={new Date(finishDate)<=Date.now()}
          />
    )
  }
}
