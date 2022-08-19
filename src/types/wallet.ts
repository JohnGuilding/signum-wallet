import { ethers } from "ethers";
import TransactionController from "../controllers/TransactionController";

export type WalletContextType = {
    provider: ethers.providers.JsonRpcProvider;
    transactionController: TransactionController;
};
