const SHA256 = require("crypto-js/sha256");

// global variable to hold block index
var counter = 0;

// define the shape of the block
class Block {
  constructor(data, previousHash, timestamp, index, currentHash, nonce) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = new Date().getTime();
    this.hash = this.calculateHash();
    this.nonce = 0;
    this.data = data;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Mined block " + this.index + "  => Hash value " + this.hash);
    return this.hash;
  }
}

class Blockchain {
  // first create the genesis block and set the mining difficulty
  // which refers to the difficulty of the finding nonce that has a
  // certain number of zeroos at the begining of the string
  // difficulty = 3 , means that the it must start with 3 zerros => '000'
  // greate the difficulty more time it take to mine a block

  constructor() {
    this.chain = [this.createGenesis()];
    this.difficulty = 5;
  }

  // data, previousHash timestamp, index, currentHash
  createGenesis() {
    return new Block("SATOSHI GENESIS BLOCK", 0, "01/01/2023", 0, 0);
  }

  // calculate the index of the latest blockchain
  latestBlock() {
    return this.chain[this.chain.length - 1];
  }

  //add a block to the blockchain
  addBlock(newBlock) {
    // increment the block index
    newBlock.index = Number(this.latestBlock().index) + 1;
    // create the link between blocks by setting the new block's previousHash
    // to the preceeding block's hash value
    newBlock.previousHash = this.latestBlock.hash;
    // set the new block;s hash value in the calculateHash() function
    newBlock.hash = newBlock.mineBlock(this.difficulty);
    // push the new block to the end of the blockchain array
    this.chain.push(newBlock);
  }

  checkValid() {
    for (let i = 1; i < this.chain.length; i++) {
      //get the current block and previous block and check that the hashes are valid
      const currentBlock = this.chain[i];
      const previousHash = this.chain[i - 1];
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log("Hash is valid");
        return false;
      }

      if (currentBlock.previousHash !== previousHash.hash) {
        console.log("Hash of the previous block is invalid");
        return false;
      }
    }
    return true;
  }
}

let jsChain = new Blockchain();

jsChain.addBlock(new Block("sample tx data 1"));
jsChain.addBlock(new Block("sample tx data 2"));
jsChain.addBlock(new Block("sample tx data 3"));
jsChain.addBlock(new Block("sample tx data 4"));
jsChain.addBlock(new Block("sample tx data 5"));

console.log(JSON.stringify(jsChain, null, 4));
console.log("is state is valid >> ", jsChain.checkValid());
