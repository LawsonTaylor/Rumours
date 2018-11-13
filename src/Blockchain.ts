import { sha256 } from "js-sha256";
import { Set } from "immutable";

export interface Transaction {
  sender: string;
  recipient: string;
  amount: number;
}

export interface Block {
  index: number;
  timestamp: number;
  transactions?: Array<Transaction>;
  proof: number;
  previousHash: string;
}

export class Blockchain {
  private chain: Block[];
  private currentTransactions: Array<Transaction>;
  private nodes: Set<string>;

  constructor() {
    this.chain = [];
    this.currentTransactions = [];
    this.newBlock("1", 100);
    this.nodes = Set();
  }

  getChain(): Block[] {
    return this.chain;
  }

  getNodes(): Set<string> {
    return this.nodes;
  }

  newBlock(previousHash: string, proof: number): Block {
    // create new block and add to chain;

    const date = new Date();

    const neuBlock: Block = {
      index: this.chain.length + 1,
      timestamp: date.getMilliseconds(),
      transactions: this.currentTransactions,
      proof,
      previousHash
    };

    this.currentTransactions = [];

    this.chain.push(neuBlock);

    return neuBlock;
  }

  newTransaction(sender: string, recipient: string, amount: number): number {
    // Add new transaction to list
    const neuTransaction: Transaction = {
      sender,
      recipient,
      amount
    };
    this.currentTransactions.push(neuTransaction);

    return this.chain.length + 1;
  }

  hash(block: Block) {
    const blockData = JSON.stringify(block);
    const h = sha256(blockData);
    return h;
  }

  lastBlock(): Block {
    // returns last block
    return this.chain[this.chain.length - 1];
  }

  proofOfWork(lastProof: number): number {
    let proof = 0;

    while (this.validProof(lastProof, proof) !== true) {
      proof += 1;
    }

    return proof;
  }

  validProof(lastProof: number, proof: number) {
    const guess = lastProof.toString().concat(proof.toString());
    const gHash = sha256(guess);
    return gHash.slice(0, 4) === "0000";
  }

  validChain(blockchain: Blockchain) {
    const chain = blockchain.chain;
    let lastBlock = chain[0];
    let currentIndex = 1;

    console.log("Validating Blockchain...");

    while (currentIndex < chain.length) {
      let block = chain[currentIndex];

      // Check block hash
      if (block.previousHash !== this.hash(lastBlock)) {
        return false;
      }

      // check proof of work
      if (!this.validProof(lastBlock.proof, block.proof)) {
        return false;
      }

      lastBlock = block;
      currentIndex += 1;
    }

    return true;
  }

  resolveConflicts(): boolean {
    // if longer chain exists in network replace this chain.
    let neighbours = this.nodes;
    let newChain = null;

    // find longer chains
    let maxChainLength = this.chain.length;

    neighbours.forEach(node => {
      let response = fetch("http://${node}/chain/get-chain");
      response.then(
        res => {
            if(res.ok){
                let responseJSON = res.json();
                responseJSON.then((data) => {
                  let length = data.length;
                  let chain = data.chain;
                  if (length > maxChainLength && this.validChain(chain)) {
                      maxChainLength = length;
                      newChain = chain;
                  }
                })
              
            } else {
                throw new Error("resquest not ok :'(");
            }
        },
        err => {
          console.log("Error getting: ${node} \n" + err);
        }
      );
    });

    if (newChain !== null) {
        this.chain = newChain;
        return true;
    }
    return  false; 
  }

  registerNode(address: string) {
    // add address to immutable set, and return.
    // TODO: test if adding duplicates is possible and handel error
    this.nodes = this.nodes.add(address);
  }
}
