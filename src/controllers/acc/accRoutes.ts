import { Router } from "express";
import { AuthToken } from "../../middleware/auth";
import { CreateACC } from "./acc.controller";

const router = Router();

router.post("/create", AuthToken, CreateACC);

export default router;