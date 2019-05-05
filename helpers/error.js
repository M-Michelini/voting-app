module.exports.createError =  (req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
}

module.exports.errorHandler = (error, request, response, next) => {
  return response.status(error.status || 500).json({
    error: {
      message: error.message || "Oops! Something went wrong."
    }
  });
}

const pollAttrs = {
  title:{
    required:"Your poll needs a title.",
    minlength:"The title of a poll should be atleast 5 characters.",
    maxlength:"The title of a poll should be at most 75 characters."
  },
  nominations:{
    title:{
      required:"Nominations need a title.",
      minlength:"The title of a nomination should be atleast 2 characters.",
      maxlength:"The title of a nomination should be at most 25 characters."
    }
  }
}

const customMongoMessage = (key,error) => {
  if(error.kind==='user defined') return error.message;

  const eTypes = key
    .split(/\.[0-9]\./)
    .reduce((acc,key)=>!acc?null:acc[key],pollAttrs);
  if(eTypes&&eTypes[error.kind]){
    return eTypes[error.kind]
  }return null
}

module.exports.handleMongoErrors = errors => (
  Object.keys(errors).map(eKey=>({
    path:eKey,
    kind:errors[eKey].properties.kind||errors[eKey].kind,
    message:customMongoMessage(eKey,errors[eKey])
  }))
)
