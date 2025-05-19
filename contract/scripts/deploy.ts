import { ethers } from 'hardhat';
import { makeAbi } from './abiGenerator';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // 컨트랙트 팩토리 가져오기
  const SolidityConcepts = await ethers.getContractFactory('SolidityConcepts');

  // 배포 (생성자 인자가 있다면 여기에 넣기)
  const contract = await SolidityConcepts.deploy();

  // 배포 완료까지 대기
  await contract.waitForDeployment();

  // 배포 주소 출력 및 ABI 생성
  const contractAddress = await contract.getAddress();
  console.log(`SolidityConcepts contract deployed at: ${contractAddress}`);

  await makeAbi('SolidityConcepts', contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
