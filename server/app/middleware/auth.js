import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;
    let decodeData;

    if (token && isCustomAuth) {
      decodeData = jwt.verify(token, "test");
      req.uuid = decodeData?.uuid;
    } else {
      decodeData = jwt.decode(token);
      req.uuid = decodeData?.sub;
    }
    if (decodeData) {
      next();
    } else {
      res.json({
        success: false,
        message: "Please sign in or sign up!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export default auth;
