import { Router, Request, Response, Express } from "express";
import { Blockchain, Block, Transaction } from "./Blockchain";
import uuidv4 from "uuid/v4";

const router: Router = Router();

