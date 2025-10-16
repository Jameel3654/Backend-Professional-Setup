// 2nd method
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
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
