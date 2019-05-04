import React,{Component} from 'react';

import {Link} from "react-router-dom";
import {Sorter,Filterer} from './DropDowns'
import PollList from './PollList';
import PageTurner from './PageTurner';

import './index.css';

class Paginator extends Component{
  constructor(){
    super();
    this.state = {
      loading:true,
      data:[],
      page:0,
      totalPages:0,
      sort:'voters',
      filters:[]
    }
    this.fetchPage = this.fetchPage.bind(this);
  }
  componentDidMount(){
    this.fetchPage({page:0});
  }
  static getDerivedStateFromProps(nextProps,prevState){
    if(!nextProps.currentUser && prevState.filters.includes('users')){
      return {filters:prevState.filters.filter(f=>f!=='users')}
    }return null
  }
  fetchPage(query){
    this.setState({loading:true})
    const params = new URLSearchParams({
      sort:this.state.sort,
      filters:this.state.filters,
      ...query
    })
    fetch('/api/poll?'+params.toString(),{
      headers:{
        authorization:this.props.currentUser ? `Bearer ${this.props.currentUser.token}`:null,
      },
    })
    .then(r=>r.json())
    .then(res=>{
      const {data,totalPages,page} = res;
      const sort = query.sort?query.sort:this.state.sort;
      const filters = query.filters||this.state.filters;
      this.setState({
        data,
        totalPages,
        page,
        sort,
        filters,
        loading:false
      });
    })
  }
  handleSort(e){
    this.fetchPage({
      page:0,
      filters:this.state.filters,
      sort:e.target.name
    })
  }
  handleFilter(e){
    let filters = [...this.state.filters].filter(f=>!(
        (f==='active'&&e.target.name==='complete') ||
        (f==='complete'&&e.target.name==='active')
      )
    )
    if(filters.includes(e.target.name)){
      filters = filters.filter(f=>f!==e.target.name);
    }else{
      filters.push(e.target.name);
    }
    this.fetchPage({
      page:0,
      filters,
      sort:this.state.sort
    })
  }
  validateUser(){
    if(!this.props.currentUser){
      this.props.setAlert('You need to sign in to create a poll!')
    }
  }
  render(){
    return (
      <div id="paginator" className="container mt-2 p-0">
        <div className='d-flex justify-content-between mb-4 flex-wrap'>
          <div id='paginator-btn-panel' className='d-flex'>
            <Sorter sort={this.state.sort} handle={this.handleSort.bind(this)}/>
            <Filterer currentUser={this.props.currentUser} filters={this.state.filters} handle={this.handleFilter.bind(this)}/>
          </div>
          <Link
            id='create-link'
            onClick={this.validateUser.bind(this)}
            to={this.props.currentUser?'/new':'/'}
            className="btn btn-primary justify-self-end"
          >
            Create Poll
          </Link>
        </div>
        {
          this.state.data.length&&!this.state.loading ?
            <>
              <div className='m-2 mt-0 page-description'>
                Showing page {this.state.page+1} of {this.state.totalPages}
              </div>
              <PollList polls={this.state.data} />
              <PageTurner
                page={this.state.page}
                totalPages={this.state.totalPages}
                fetchPage={this.fetchPage}
              />
            </>:null
        }
      </div>
    );
  }
}

export default Paginator;
