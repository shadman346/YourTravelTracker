class ExpressError extends Error {
   constructor(message, statusCode) {
      super();
      this.statusCode = statusCode;
      this.message = messsage;
   }
}

module.exports = ExpressError;
