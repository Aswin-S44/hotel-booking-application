import express from "express";

const customerRouter = express.Router();
router.get("/", (req, res) => {
    res.json({ message: "Customer route" });
});

export default customerRouter;  
