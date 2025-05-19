import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.RPC_URL;

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    // Todo: 원하는 네트워크를 선택하여 설정합니다.
    sepolia: {
      url: 'https://sepolia.infura.io/v3/7a2f1e9b214448069fe349701c066903', // 또는 Alchemy
      accounts: privateKey ? [privateKey] : [],
      chainId: 11155111,
    },
  },
};

export default config;
