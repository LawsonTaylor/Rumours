import { Router, Request, Response, Express } from "express";
import { Block, Transaction } from "./Blockchain";
import { blockchain, UID } from './Server';

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("This is a blockchain app!!!");
});

router.post("/mine", (req: Request, res: Response) => {
  const lastBlock = blockchain.lastBlock();
  const lastProof = lastBlock["proof"];
  const proof = blockchain.proofOfWork(lastProof);

  // reward for finding proof, 0 = sender minded new coin.
  blockchain.newTransaction("0", UID, 1);

  const previousHash = blockchain.hash(lastBlock);
  const block = blockchain.newBlock(previousHash, proof);

  res.send({
    message: "New Block Mined!",
    transactions: block.transactions,
    proof: block.proof,
    previous_hash: block.previousHash
  });
});

router.post("/transaction/new", (req: Request, res: Response) => {

    console.log(req.body);
  const transaction: Transaction = req.body;
    // Implement checking on the incoming request body to
    // ensure all fields are valid.   
  console.log(transaction);

  const index = blockchain.newTransaction(
    transaction.sender,
    transaction.recipient,
    transaction.amount
  );

  res.send("Added a transaction!");
});

router.get("/get-chain", (req: Request, res: Response) => {
  const chain: Block[] = blockchain.getChain();
  const chainData = JSON.stringify(chain);
  const length = chain.length;
  const response = {
    'chain': chainData,
    'length': length,
  }
  res.send(response);
});

router.get("/last-block", (req: Request, res: Response) => {
  res.send("this is the last block!");
});

export const ChainController: Router = router;
