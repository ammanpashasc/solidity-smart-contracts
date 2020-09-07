const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

// Breaking change:
// in earlier versions of solc/solidity,
// output.contracts["Inbox.sol"]["Inbox"] would return { interface, bytecode }
// but now it returns "abi" for interface and "evm.bytecode" for bytecode
const compiled = require("./compile");
const interface = compiled.abi;
const bytecode = compiled.evm.bytecode.object;

const provider = new HDWalletProvider(
  "your 12 word mnemonic phrase goes here",
  "https://rinkeby.infura.io/v3/db52f21b618f442d917e590a732afa2e"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Deploying from account:", accounts[0]);

  const result = await new web3.eth.Contract(interface)
    .deploy({
      data: bytecode
    })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to:", result.options.address);
};

deploy();
