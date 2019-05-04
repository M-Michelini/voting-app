import React from 'react';
import {Link} from "react-router-dom";
import TimeDescription from '../TimeDescription'

const PollTag = ({
  _id,
  title,
  created_at,
  finish_at
}) => (
  <Link to={`${_id}`} className="list-group-item list-group-item-action d-flex justify-content-between">
    <div>{title}</div>
    <TimeDescription created_at={created_at} finish_at={finish_at} />
  </Link>
)

const PollList = ({polls}) => (
  <ul className="list-group">
    {polls.map((poll,i)=><PollTag key={i} {...poll}/>)}
  </ul>
)
export default PollList;
