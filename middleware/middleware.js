const jwt = require('jsonwebtoken');

const VerifyToken = (req, res, next) => {
    const token = req.header("auth-token");  // Ensure you're sending the token in the headers
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const data = jwt.verify(token, process.env.KEY);
        console.log("Decoded token data:", data);  // Should show { id: '679d00fa4f61482f3a9e36d2', ... }
        req.user = { id: data.id };  // Make sure req.user is an object with the id field
        next();
    } catch (error) {
        console.error("Token verification failed:", error); // Log errors if any
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = VerifyToken;
