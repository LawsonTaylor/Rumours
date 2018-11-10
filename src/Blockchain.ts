import { sha256, sha224 } from 'js-sha256';

export interface Transaction {
    sender: string,
    recipient: string,
    amount: number,
}

export interface Block {
    index: number,
    timestamp: number,
    transactions?: Array<Transaction>,
    proof: number,
    previousHash: string,
}

export class Blockchain {

    private chain: Block[];
    private currentTransactions: Array<Transaction>;

    constructor(){
        this.chain = [];
        this.currentTransactions = [];
        this.newBlock('1', 100);
    }

    getChain(): Block[]{
        return this.chain;
    }

    newBlock(previousHash: string, proof: number): Block {
        // create new block and add to chain;

        const date = new Date;

        const neuBlock: Block = {
            index: this.chain.length + 1,
            timestamp: date.getMilliseconds(),
            transactions: this.currentTransactions,
            proof,
            previousHash,
        }

        this.currentTransactions = [];

        this.chain.push(neuBlock);
        
        return neuBlock;
    }

    newTransaction(sender: string, recipient: string, amount: number): number{
        // Add new transaction to list
        const neuTransaction: Transaction = {
            sender,
            recipient,
            amount,
        }
        this.currentTransactions.push(neuTransaction);

        return this.chain.length + 1;

    }

    hash(block: Block){
        const blockData = JSON.stringify(block);
        const h =  sha256(blockData);
        return h;
        
    }

    lastBlock(): Object {
        // returns last block
        return this.chain[this.chain.length-1];
    }

    proofOfWork(lastProof: number) {
        let proof = 0;

        while(this.validProof(lastProof, proof) !== true) {
            proof += 1;
        }

        return proof;
    }

    validProof(lastProof: number, proof: number) {
        const guess = lastProof.toString().concat(proof.toString());
        const gHash = sha256(guess);
        return gHash.slice(0, 4) === '0000';
    }
};