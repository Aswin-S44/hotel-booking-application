import admin from "../config/firebase.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = await admin.auth().verifyIdToken(token);

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
