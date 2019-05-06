import React, {useState,Component} from 'react';
import {Redirect} from "react-router-dom";
import {TextInput,DateInput} from './inputs'
import {getHTMLDate,getUTCfromHTML} from '../_utils';

const NominationsInput = ({
  values,
  onChange,
  errors,
  onDelete,
  onCreate
}) => (
  <>
    {values.map((value,index)=><TextInput
      sm
      id={'poll-nomination-input-'+index}
      title={index===0?'Nominations':null}
      key={index}
      index={index}
      placeholder={'Option '+(index+1)}
      value={value}
      help={`${25-value.length} chars remaining.`}
      onChange={onChange(index)}
      error={errors.find(e=>e.path===`nominations.${index}.title`)}
      onDelete={values.length>2?()=>onDelete(index):null}
    />)}
    <button type="button" onClick={onCreate} className="btn btn-light">Add Nomination</button>
  </>
)

class PollForm extends Component{
  constructor(){
    super();
    this.state={
      title:'',
      nominations:['',''],
      date:getHTMLDate(24*60*60*1000),

      done:false,
      loading:false,
      errors:[]
    };

    this.timeout = null
  }
  componentWillUnmount(){
    if(this.timeout) this.timeout = clearInterval(this.timeout)
  }

  postPoll(){
    const {date,nominations,title} = this.state;
    const {currentUser,setAlert} = this.props;
    this.setState({loading:true})
    fetch(`/api/poll`,{
      method:'POST',
      headers:{
        authorization:`Bearer ${currentUser.token}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        title:title,
        nominations:nominations,
        finish_at:getUTCfromHTML(date)
      })
    })
    .then(async r=>{
      this.setState({loading:false})
      const json = await r.json();
      if(r.ok){
        return  json;
      }else{
        throw json;
      }
    })
    .then((res)=>{
      this.setState({done:res._id});
    })
    .catch(e=>{
      if(e.errors && e.errors.length>0){
        const nomErr = e.errors.find(er=>er.path==='nominations')
        if(nomErr){
          this.props.setAlert(nomErr.message)
        }
        this.setState({errors:e.errors});
        if(this.timeout) this.timeout = clearInterval(this.timeout)
        this.timeout=setTimeout(()=>{
          this.setState({errors:[]})
        },5000);
      }
    })
  }
  handleSubmit(e){
    e.preventDefault();
    const {loading} = this.state;
    const {currentUser,setAlert} = this.props;
    if(loading) return;
    if(!currentUser) return setAlert('You need to sign in to vote!');
    this.postPoll.bind(this)()
  }

  addNomination(){
    const {nominations} = this.state;
    if(nominations.length>9){
      return this.props.setAlert('You can have at most 10 nominations.')
    }
    this.setState({nominations:[...nominations,'']});
  }
  deleteNomination(i){
    this.setState({nominations:this.state.nominations.filter((_,j)=>i!==j)})
  }
  render(){
    const {loading,date,nominations,title,done,errors} = this.state;
    const {currentUser} = this.props;
    if(!currentUser) return <Redirect to="" />;
    if(done) return <Redirect to={done} />
    return(
      <form onSubmit={this.handleSubmit.bind(this)} className='container mt-2 mb-4'>
        <TextInput
          id='poll-title-input'
          title='Title'
          placeholder="Ask something..."
          value={title}
          pattern=".{2,25}"
          onChange={e=>this.setState({title:e.target.value})}
          error={errors.find(e=>e.path==='title')}
        />
        <DateInput
          id='poll-date-input'
          title='End Date'
          value={date}
          onChange={e=>{
            this.setState({date:e.target.value})
          }}
          error={errors.find(e=>e.path==='finish_at')}
          type='date'
        />
        <NominationsInput
          values={nominations}
          errors={errors}
          onDelete={this.deleteNomination.bind(this)}
          onCreate={this.addNomination.bind(this)}
          onChange={index=>e=>{
            let noms = [...nominations];
            noms[index]=e.target.value
            this.setState({nominations:noms})
          }
        }/>
        <button type="submit" className="btn btn-secondary btn-block">Submit</button>
      </form>
    )
  }
}
export default PollForm;
