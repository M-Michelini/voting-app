import React from 'react';
import {getTimeDiff} from '../_utils';

const TimeDescription = ({
  created_at,
  finish_at
}) => {
  let finished = new Date() >= new Date(finish_at)
  const createdDescription = getTimeDiff(created_at);
  const finishDescription = getTimeDiff(finish_at);
  return(
    <div className='d-flex flex-column justify-content-center align-items-end'style={{minWidth:102,fontSize:'.6em',textAlign:'right'}}>
      <div>{
        !finished?`Ending in ${finishDescription}`:`Ended ${finishDescription} ago`
      }</div>
      {!finished?<div>Created {createdDescription} ago</div>:null}
    </div>
  )
}
export default TimeDescription;
