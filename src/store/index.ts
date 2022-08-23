import { ethers } from "ethers";
import { SET_ACCOUNT, SET_PROVIDER } from "./actions";

type InitialState = {
    account: string;
    provider: ethers.providers.JsonRpcProvider;
};

export const reducer = (state: InitialState, action: any) => {
    const { type, payload } = action;

    switch (type) {
        case SET_ACCOUNT:
            return { ...state, account: payload };
        case SET_PROVIDER:
            return { ...state, provider: payload };
        default:
            return state;
    }
};
