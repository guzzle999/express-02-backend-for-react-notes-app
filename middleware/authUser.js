import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.json({
            error: true,
            message: "Access denied. No token.",
        });
    }

    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {_id: decoded_token.userId}
        next();
    }   catch (err) {
        const isExpired = err.name === "TokenExpireError";

        res.status(401).json({
            error: true,
            code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
            message: isExpired ? "Token has expired, please log in again." : "Invalid token.",
        });
    }
};