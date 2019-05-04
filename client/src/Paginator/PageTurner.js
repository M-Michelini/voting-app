import React from 'react';

const NumButton = ({
  num,
  active,
  onClick
}) => (
  <li className={`page-item${active?' active':''}`}>
    <button onClick={onClick} className="page-link">{num+1}</button>
  </li>
)

const PageTurner = ({
  page,
  totalPages,
  fetchPage
}) => {
  let numbers = Array.from({length:5},(_,i)=>page-2+i).filter(val=>val>-1&&val<totalPages);
  return(
    numbers.length<=1?null:
    <nav className='mt-3 mb-3' aria-label="Page navigation example">
      <ul className="pagination justify-content-center m-0">
        {numbers[0]<=0?null:
          <>
            <li className="page-item">
              <button onClick={()=>fetchPage({page:0})} className="page-link">{'<<'}</button>
            </li>
            <li className="page-item">
              <button onClick={()=>fetchPage({page:numbers[0]-1})} className="page-link">{'<'}</button>
            </li>
          </>
        }
        {numbers.map(n=><NumButton key={n} onClick={()=>fetchPage({page:n})} num={n} active={n===page} />)}
        {numbers[numbers.length-1]===totalPages-1?null:
          <>
            <li className="page-item">
              <button onClick={()=>fetchPage(numbers[numbers.length-1]+1)} className="page-link">{'>'}</button>
            </li>
            <li className="page-item">
              <button onClick={()=>fetchPage(totalPages-1)} className="page-link">{'>>'}</button>
            </li>
          </>
        }
      </ul>
    </nav>
  )
}

export default PageTurner;
