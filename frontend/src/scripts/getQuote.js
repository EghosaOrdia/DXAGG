import { POOL_FACTORY_CONTRACT_ADDRESS } from "@/lib/constants";
import { QUOTER_CONTRACT_ADDRESS } from "@/libs/constants";
import { quoteConfig } from "@/libs/quoteConfig";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { computePoolAddress } from "@uniswap/v3-sdk";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";

import { createPublicClient, http, getContract } from "viem";
import { mainnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(quoteConfig.rpc.mainnet),
});

export const Quote = async () => {
  const quoterContract = getContract({
    address: QUOTER_CONTRACT_ADDRESS,
    abi: Quoter.abi,
    client: publicClient,
  });

  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    token0,
    token1,
    fee,
    fromReadableAmount(
      quoteConfig.pool.amountIn,
      quoteConfig.pool.in.decimals,
    ).toString(),
    0,
  );
};

async function getPoolConstants() {
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: quoteConfig.pool.in,
    tokenB: quoteConfig.pool.out,
    fee: quoteConfig.pool.poolFee,
  });

  const poolContract = getContract({
    address: currentPoolAddress,
    abi: IUniswapV3PoolABI.abi,
    client: publicClient,
  });

  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);

  return {
    token0,
    token1,
    fee,
  };
}
