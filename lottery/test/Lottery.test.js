const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

// Breaking change:
// in earlier versions of solc/solidity,
// output.contracts["Inbox.sol"]["Inbox"] would return { interface, bytecode }
// but now it returns "abi" for interface and "evm.bytecode" for bytecode
const compiled = require("../compile");
const interface = compiled.abi;
const bytecode = compiled.evm.bytecode.object;

let accounts, lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(interface)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery Contact", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows one account to enter the lottery", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.012", "ether")
    });
    const players = await lottery.methods.getPlayers().call();
    assert.equal(accounts[0], players[0]);
  });

  it("allows multiple accounts to enter the lottery", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.012", "ether")
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.05", "ether")
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.042", "ether")
    });
    const players = await lottery.methods.getPlayers().call();
    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(players.length, 3);
  });

  it("requires a minimum amount of eth to enter the lottery", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei("0.0001", "ether")
      });
      assert(false);
    } catch (err) {
      assert.ok(err);
    }
  });

  it("only manager can pick winner", async () => {
    try {
      await lottery.methods.pickWinner.send({
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert.ok(err);
    }
  });
});
