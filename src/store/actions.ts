import { ethers } from "ethers";
import React from "react";
import { getNetwork } from "../constants/networks";

export const SET_ACCOUNT = "SET_ACCOUNT";
export const SET_PROVIDER = "SET_PROVIDER";

export const setProvider = (dispatch: React.Dispatch<any>, payload: any) => {
    const localProviderUrl = getNetwork(payload).rpcUrl;
    const provider = new ethers.providers.JsonRpcProvider(localProviderUrl);
    dispatch({ type: SET_PROVIDER, payload: provider });
};

export const setAccount = (dispatch: React.Dispatch<any>, payload: any) => {
    dispatch({ type: SET_ACCOUNT, payload });
};
