import { Router, Request, Response, Express } from "express";
import { Blockchain, Block, Transaction } from "./Blockchain";
import { blockchain, UID } from './Server';
import { Set } from 'immutable';

const router: Router = Router();

router.post('/nodes/register', (req: Request, res: Response) => {
  let values = req.body;
  let nodes: Set<string> = values.nodes;

  // register new nodes....
  nodes.forEach((node) => {
    blockchain.registerNode(node);
  });

  // package response
  const response = {
    'message': "New nodes added!",
    'nodes': blockchain.getNodes().toArray(),
  }

  res.send(response);

});

router.get('/nodes/resolve', (req: Request, res: Response) => {
  
  const replaced = blockchain.resolveConflicts();
  let response = {};

  if (replaced === true){
    response = {
      'message': 'The chain was replaced',
      'chain': blockchain.getChain(),
      'new_chain': true,
    }
  } else {
    response = {
      'message': "Our chain is an authority",
      'chain': blockchain.getChain(),
      'new_chain': false,
    }
  }

  res.send(response);

});


