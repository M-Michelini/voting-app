export const getHTMLDate = (dt) =>{
  let d = new Date(Date.now()+dt);
  d.setMinutes(d.getMinutes()-d.getTimezoneOffset());
  return d.toISOString().split('T')[0]
}
export const getLocalISOString = (dt) =>{
  let d = new Date(Date.now()+dt);
  d.setMinutes(d.getMinutes()-d.getTimezoneOffset());
  return d.toISOString()
}
export const getTimeDiff = (date_str, date2_str=Date.now()) =>{
  const now = new Date(date2_str)
  const then = new Date(date_str).getTime();
  const direction = now>then?1:-1
  const diff = (now-then)*direction/(1000*60);
  const daysHoursMins = [
    Math.floor(diff/(60*24)),
    Math.floor(diff/(60))%24,
    Math.floor(diff)%60
  ];
  const time_strings = ['Day','Hour','Minute'];
  const index = daysHoursMins.findIndex(val=>!!val);
  if(index===-1) return '< 1 Minute'
  const value = daysHoursMins[index];

  return `${value} ${time_strings[index]}${value>1?'s':''}`
}
export const getUTCfromHTML = (str) =>{
  let d = new Date(str);
  if(d.toString()==='Invalid Date') return;
  d.setMinutes(d.getTimezoneOffset())
  return d.toISOString()
}
