import express from "express";

const customerRouter = express.Router();
customerRouter.get("/", (req, res) => {
    res.json({ message: "Customer route" });
});

export default customerRouter;  
