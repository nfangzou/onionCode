import * as tbc from "tbc-lib-js"
import { API, FT, poolNFT } from "tbc-contract";
// testnet
// mainnet
async function test(poolNftContractId, addressA, uName) {
    const poolUse = new poolNFT({txidOrParams: poolNftContractId, network:"mainnet"});
	
    await poolUse.initfromContractId();

    const FTA = new FT(poolUse.ft_a_contractTxid);

    const FTAInfo = await API.fetchFtInfo(FTA.contractTxid, poolUse.network);

    await FTA.initialize(FTAInfo);

    const ftlpCodeScript = poolUse.getFTLPcode(tbc.crypto.Hash.sha256(Buffer.from(poolUse.poolnft_code, 'hex')).toString('hex'), addressA, FTA.tapeScript.length / 2);

    const ftlpCodeHash = tbc.crypto.Hash.sha256(ftlpCodeScript.toBuffer()).reverse().toString('hex');

	const usePool = [];
	usePool.push({"ft_a_amount":poolUse.ft_a_amount,"ft_lp_amount":poolUse.ft_lp_amount,"tbc_amount":poolUse.tbc_amount,"contractName":uName,"ftDecimal":FTA.decimal,"FTContract":FTA.contractTxid,"poolContract":poolNftContractId,"ftlpCodeHash":ftlpCodeHash})
    
	// console.log(uName);
	// console.log(poolUse.ft_lp_amount)
	// console.log(poolUse.ft_a_amount)
	// console.log(poolUse.tbc_amount)

	return usePool;
}

module.exports = test;