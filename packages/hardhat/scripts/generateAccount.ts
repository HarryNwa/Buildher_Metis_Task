import { ethers } from "ethers";
import { parse, stringify } from "envfile";
import * as fs from "fs";

const myEnvFilePath = "./.env";

/**
 * Generate a new random private key and write it to the .env file
 */
const setNewEnvConfig = (currentEnvConfig = {}) => {
  console.log("👛 Generating new Wallet");
  const myWallet = ethers.Wallet.createRandom();

  const newEnvConfig = {
    ...currentEnvConfig,
    DEPLOYER_PRIVATE_KEY: myWallet.privateKey,
  };

  // Store in .env
  fs.writeFileSync(myEnvFilePath, stringify(newEnvConfig));
  console.log("📄 My private Key has been saved to packages/hardhat/.env file");
  console.log("🪄 My generated wallet address:", myWallet.address);
};

async function main() {
  if (!fs.existsSync(myEnvFilePath)) {
    // No .env file yet.
    setNewEnvConfig();
    return;
  }

  // .env file exists
  const currentEnvConfig = parse(fs.readFileSync(myEnvFilePath).toString());
  if (currentEnvConfig.DEPLOYER_PRIVATE_KEY) {
    console.log("⚠️ You already have a deployer account. Check the packages/hardhat/.env file");
    return;
  }

  setNewEnvConfig(currentEnvConfig);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
