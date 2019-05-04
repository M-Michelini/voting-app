import React from 'react';
import './inputs.css';

const InputError = ({message})=>(
  <div className='input-error-message position-absolute'>
    {message}
  </div>
)

export const TextInput = ({
  title,
  id,
  placeholder,
  help,
  value,
  onChange,
  index,
  sm,
  error,
  onDelete
}) => (
  <div className={"position-relative form-group mb-0 pb-4"+(error?' input-error':'')}>
    {!error?null:<InputError message={error.message} />}
    {!title?null:<label forhtml={id}>{title}</label>}
    <div className='d-flex'>
      <input
        id={id}
        type={'text'}
        className={`flex-grow-1 form-control${sm?' form-control-sm':''}${error?' input-error':''}`}
        aria-describedby={id+'-help'}
        placeholder={!placeholder?'':placeholder}
        value={value}
        onChange={onChange}
      />
      {!onDelete?null:<i onClick={onDelete} className="fa fa-trash nom-trash" aria-hidden="true"></i>}
    </div>
  </div>
)

export const DateInput = ({
  title,
  id,
  countdown,
  value,
  onInput,
  pattern,
  index,
  onChange,
  error
}) => (
  <div className={"position-relative form-group mb-0 pb-4"+(error?' input-error':'')}>
    {!error?null:<InputError message={error.message} />}
    {!title?null:<label forhtml={id}>{title}</label>}
    <input
      className={`form-control${error?' input-error':''}`}
      id={id}
      type='date'
      aria-describedby={id+'-countdown'}
      value={value}
      onChange={onChange}
    />
    {!countdown?null:<small
      id={id+'-countdown'}
      className="form-text text-muted"
    >{countdown}</small>}
  </div>
)
