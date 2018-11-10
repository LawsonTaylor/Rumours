import { Router, Request, Response } from 'express';
import { Blockchain, Block, Transaction } from './Blockchain';

const router: Router = Router();

const blockchain: Blockchain = new Blockchain();

router.get('/', (req: Request, res: Response) => {
    res.send('This is a blockchain app!!!');
})

router.put('/transaction/new', (req: Request, res: Response) => {
    res.send('Added a transaction!');
});

router.put('/mine', (req: Request, res: Response) => {
    res.send('Mined a Block!');
});

router.get('/chain', (req: Request, res: Response) => {
    const chain: Block[] = blockchain.getChain();
    const chainData = JSON.stringify(chain);
    res.send(chainData);
});

router.get('/lastBlock', (req: Request, res: Response) => {
    res.send('this is the last block!');
});