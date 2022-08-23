import { ethers } from "ethers";
import React, {
    createContext,
    ReactNode,
    useContext,
    useReducer,
    useMemo,
} from "react";
import TransactionsController from "../controllers/TransactionsController";
import { getNetwork } from "./../constants/networks";
import { reducer } from "../store";

function findNetwork() {
    const networkName = localStorage.getItem("selectedNetwork") || "localhost";
    return getNetwork(networkName);
}

type WalletContextType = ReturnType<typeof getContextValue>;

export const WalletContext = createContext<WalletContextType>(
    {} as WalletContextType
);

// export const useWallet = () => {
//     return useContext(WalletContext);
// };

type Props = {
    children: ReactNode;
};

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

function getContextValue() {
    const provider = getProvider();
    const privateKey = getPrivateKey();
    const transactionsController = new TransactionsController(
        provider,
        privateKey
    );

    const initialState = {
        account: "",
        provider,
    };

    // eslint-disable-next-line
    const [state, dispatch] = useReducer(reducer, initialState);

    return {
        state,
        dispatch,
        transactionsController,
    };
}

export function WalletProvider({ children }: Props) {
    const { state, dispatch, transactionsController } = getContextValue();

    const value = React.useMemo(
        () => ({
            state,
            dispatch,
            transactionsController,
        }),
        [state, dispatch, transactionsController]
    );

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}
