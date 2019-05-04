import React from 'react';

const sortTypes = [
  ['voters','Votes (Asc.)'],
  ['voters-desc','Votes (Desc.)'],
  ['created_at','Date (Asc.)'],
  ['created_at-desc','Date (Desc.)'],
  ['title','Title (Asc.)'],
  ['title-desc','Title (Desc.)'],
]
const filterTypes = [
  ['active','Active'],
  ['complete','Complete'],
  ['mobile','Mobile Validated'],
  ['users','My Polls']
]
const DropDown = ({
  id,
  label,
  active,
  data,
  handle
}) => (
  <div className="dropdown flex-grow-1">
    <button
      id={id}
      className="btn btn-secondary dropdown-toggle w-100"
      type="button"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      {label}
    </button>
    <div className="dropdown-menu" aria-labelledby={id}>
      {data.map((but,i)=>
        <button
          key={i}
          onClick={handle}
          name={but.name}
          className={`dropdown-item${but.active?' active':''}`}
          type="button"
        >
          {but.label}
        </button>
      )}
    </div>
  </div>
)

export const Sorter = ({handle,sort})=>{
  const active=sortTypes.findIndex(keyval=>sort===keyval[0]);
  return(
    <DropDown
      id='sort-dropdown'
      data={sortTypes.map(keyval=>({
        name:keyval[0],
        label:keyval[1],
        active:keyval[0]===sort
      }))}
      label={`Sort: ${active>-1?sortTypes[active][1]:''}`}
      handle={handle}
    />
  )
}
export const Filterer = ({handle,filters,currentUser})=>{
  const label = 'Filters ';
  let fTypes = [...filterTypes];
  if(!currentUser) fTypes.pop();
  return(
    <DropDown
      id='filter-dropdown'
      data={fTypes.map(keyval=>({
        name:keyval[0],
        label:keyval[1],
        active:filters.includes(keyval[0])
      }))}
      label={label}
      handle={handle}
    />
  )
}
