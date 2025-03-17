exports.verifyToken = async (req, res, next) => {
    try {
        console.log("Cookies received:", req.cookies); // Debugging step

        // Extract token from request cookies
        const { token } = req.cookies;

        // If token is not present, return 401 response
        if (!token) {
            return res.status(401).json({ message: "Token missing, please login again" });
        }

        console.log("Token received:", token); // Debugging step

        // Ensure token is a valid string
        if (typeof token !== "string") {
            return res.status(401).json({ message: "Invalid token format, please login again" });
        }

        // Verify the token
        const decodedInfo = jwt.verify(token, process.env.SECRET_KEY);

        // Check if decoded info contains required details
        if (decodedInfo && decodedInfo._id && decodedInfo.email) {
            req.user = decodedInfo;
            next();
        } else {
            return res.status(401).json({ message: "Invalid Token, please login again" });
        }
    } catch (error) {
        console.error("JWT Verification Error:", error);

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token expired, please login again" });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid Token, please login again" });
        } else {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
};
