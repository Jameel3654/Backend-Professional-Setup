// 2nd method
const asyncHandler = (reqHandler) => (req, res, next) => {
  Promise.resolve(reqHandler(req, res, next)).catch((error) => {
    next(error);
  });
};
export default asyncHandler;

// method 01
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res
//       .status(error.code || 500)
//       .json({ status: false, message: error.message });
//   }
// };
