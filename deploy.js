const ethers = require("ethers");
const fs = require("fs-extra");
//getting environment
require("dotenv").config();

async function main() {
  //compile them sepparetly
  //http://127.0.0.1:7545 in this case we take it from .env
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  //we take the pk from .env
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  //to deploy the contract we need the ABI and BIN from the compiled contract
  const abi = fs.readFileSync("SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );
  //to deploy the contract:
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait..");
  const contract = await contractFactory.deploy(); //stop until contract deploy
  console.log(`Contract address is ${contract.address}`);
  const deploymentReceipt = await contract.deployTransaction.wait(1);

  //get number
  let currentFavoriteNumber = await contract.retrieve();
  console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`);
  const transactionResponse = await contract.store("213443151453425");
  const transactionReceipt = await transactionResponse.wait(1);
  currentFavoriteNumber = await contract.retrieve();
  console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
