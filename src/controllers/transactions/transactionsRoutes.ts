import { Router } from "express";
import { AuthSystemUser, AuthToken } from "../../middleware/auth";
import { CreateIFT, createTransaction } from "./transactions.controller";

const router = Router();

router.post("/create", AuthToken, createTransaction);

// Create Initial Funds Transaction
router.post("/system/IFT", AuthSystemUser, CreateIFT);

export default router;