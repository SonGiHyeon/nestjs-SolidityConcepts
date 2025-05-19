import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ethers,
  zeroPadValue,
  encodeBytes32String,
  isBytesLike,
  toUtf8Bytes,
  parseEther,
  LogDescription,
  formatEther,
} from 'ethers';
import { abi, address } from '../../../abis/SolidityConcepts.json';

@Injectable()
export class EthersService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    const privateKey = this.configService.get<string>('PRIVATE_KEY');

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey!, this.provider);
    this.contract = new ethers.Contract(address, abi, this.signer);
  }

  zeroPadValue32(data: string) {
    return zeroPadValue(data, 32);
  }

  encodeBytes32String(data: string) {
    return encodeBytes32String(data);
  }

  isBytesLike(data: string) {
    return isBytesLike(data);
  }

  toUtf8Bytes(data: string) {
    return toUtf8Bytes(data);
  }

  parseEther(data: string) {
    return parseEther(data);
  }

  formatEther(data: bigint) {
    return formatEther(data);
  }

  // 위 코드는 지우지 마세요.

  async owner() {
    // Todo: owner의 값을 리턴합니다.
    return this.contract.owner();
  }

  async fixedValue() {
    // Todo: FIXED_VALUE의 값을 리턴합니다.
    return this.contract.FIXED_VALUE();
  }

  async value() {
    // Todo: value의 값을 리턴합니다.
    return this.contract.value();
  }

  async checkValue(value: number) {
    // Todo: checkValue의 값을 리턴합니다.
    return this.contract.checkValue(value);
  }

  async sumUpTo(value: number) {
    // Todo: sumUpTo의값을 리턴합니다.
    return this.contract.sumUpTo(value);
  }

  async updateValue(value: number) {
    const tx = await this.contract.updateValue(value);
    const receipt = await tx.wait();

    for (const log of receipt.logs) {
      let parsed: LogDescription | null = null;
      try {
        parsed = this.contract.interface.parseLog(log);
      } catch (_) {
        continue; // parse 실패한 로그는 무시
      }

      // 테스트가 기대하는 구조: parsed.fragment.name
      if (parsed && parsed.fragment?.name === 'ValueChanged') {
        const [oldValue, newValue] = parsed.args;
        return {
          oldValue: Number(oldValue),
          newValue: Number(newValue),
        };
      }
    }

    throw new Error('ValueChanged 이벤트를 찾을 수 없습니다.');
  }


  async ownerFunction() {
    // Todo: ownerFunction의값을 리턴합니다.
    return this.contract.ownerFunction()
  }

  async sendEther(address: string, value: number) {
    // Todo: sendEther의값을 리턴합니다.
    // ⚠️ setter함수는 tx 확정 후 영수증을 리턴합니다.(wait)
    const tx = await this.contract.sendEther(address, {
      value: this.parseEther(value.toString()) // ✅ msg.value 지정
    });
    return tx.wait();
  }

  async getContractBalance() {
    // Todo: getContractBalance의 값을 리턴합니다.
    // ⚠️ 리턴은 ether 단위로 리턴합니다.(wei => ether)
    const wei: bigint = await this.contract.getContractBalance();
    return this.formatEther(wei); // ethers 단위로 변환  }
  }

  async deposit(value: number) {
    // Todo: Contract에 코인을 전송합니다.
    // ⚠️ tx 확정 후 영수증을 리턴합니다.(wait)
    const tx = await this.signer.sendTransaction({
      to: this.contract.target,
      value: this.parseEther(value.toString()),
    });
    return tx.wait();
  }


  async withDraw() {
    // Todo: withDraw의값을 리턴합니다.
    // ⚠️ setter함수는 tx 확정 후 영수증을 리턴합니다.(wait)
    const tx = await this.contract.withDraw();
    return tx.wait();
  }
}
