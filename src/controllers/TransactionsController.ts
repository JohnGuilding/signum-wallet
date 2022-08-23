import { ethers } from "ethers";
import { Aggregator, BlsWalletWrapper } from "bls-wallet-clients";
import { getNetwork } from "../constants/networks";
import { SendTransactionParams } from "../types/sendTransactionParams";

function findNetwork() {
    const networkName = localStorage.getItem("selectedNetwork") || "localhost";
    return getNetwork(networkName);
}

export default class TransactionsController {
    constructor(
        public ethersProvider: ethers.providers.JsonRpcProvider,
        public privateKey: string
    ) {}

    sendTransaction = async (
        sendTransactionParams: SendTransactionParams[]
    ) => {
        const verificationGateway = findNetwork().verificationGateway;

        const actions = sendTransactionParams.map((tx) => ({
            ethValue: tx.value ?? "0",
            contractAddress: tx.to,
            encodedFunction: tx.data ?? "0x",
        }));

        const wallet = await BlsWalletWrapper.connect(
            this.privateKey,
            verificationGateway,
            this.ethersProvider
        );

        // const nonce = await wallet.Nonce();
        const nonce = await BlsWalletWrapper.Nonce(
            wallet.PublicKey(),
            verificationGateway,
            this.ethersProvider
        );

        const bundle = wallet.sign({
            nonce,
            actions,
        });

        const aggregator = new Aggregator(findNetwork().aggregatorUrl);
        const result = await aggregator.add(bundle);

        if ("failures" in result) {
            throw new Error(JSON.stringify(result));
        }

        return result.hash;
    };

    getAddress = async () =>
        BlsWalletWrapper.Address(
            this.privateKey,
            findNetwork().verificationGateway,
            this.ethersProvider
        );
}
