export const errorHandler = (err, req, res, next) => {
  //Safe fallback if 'err' is somehow missing
  if (!err) {
    err = { message: "Internal Server Error!" };
  }

  console.error("⛔ Error caught: ", err.message);

  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error!";

  //Mongoosse bad object format
  if (err.name === "CastError") {
    ((statusCode = 400),
      (message = `The provided ID format '${err.value}' is invalid!`));
  }

  //Mongoose validation error
  if (err.name === "ValidationError") {
    //Show all error field(s)
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  //Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const duplicatedField = Object.keys(err.keyValue)[0];
    message = `Key ${duplicatedField} already exists!`;
  }

  //Send human error message to frontend in JSON
  res.status(statusCode).json({
    error: {
      status: statusCode,
      message: message,
      path: req.originalUrl || req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    },
  });
};
