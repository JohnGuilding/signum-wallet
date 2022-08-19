import { ethers } from "ethers";
import { createContext, ReactNode, FC, useState, useContext } from "react";
import TransactionController from "../controllers/TransactionController";
import { WalletContextType } from "../types/wallet";
import { getNetwork } from "./../constants/networks";

function findNetwork() {
    const networkName = localStorage.getItem("selectedNetwork") || "localhost";
    return getNetwork(networkName);
}

interface Props {
    children: ReactNode;
}

const getProvider = (): ethers.providers.JsonRpcProvider => {
    const localProviderUrl = findNetwork().rpcUrl;
    return new ethers.providers.JsonRpcProvider(localProviderUrl);
};

const getPrivateKey = () => {
    const PK_LOCAL_STORAGE_KEY = "privateKey";
    let privateKey = localStorage.getItem(PK_LOCAL_STORAGE_KEY);
    if (!privateKey) {
        privateKey = ethers.Wallet.createRandom().privateKey;
        localStorage.setItem(PK_LOCAL_STORAGE_KEY, privateKey);
    }
    return privateKey;
};

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

export const useWallet = () => {
    return useContext(WalletContext);
};

export const WalletProvider = ({ children }: Props) => {
    const provider = getProvider();
    const privateKey = getPrivateKey();
    const transactionController = new TransactionController(
        provider,
        privateKey
    );

    return (
        <WalletContext.Provider value={{ provider, transactionController }}>
            {children}
        </WalletContext.Provider>
    );
};
