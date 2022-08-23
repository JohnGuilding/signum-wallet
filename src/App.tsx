import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { WalletProvider } from "./contexts/WalletContext";
import useBalance from "./hooks/Balance";
import { setAccount } from "./store/actions";
import { SendTransactionParams } from "./types/sendTransactionParams";
import { WalletContext } from "./contexts/WalletContext";

function App() {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");

    const { state, dispatch, transactionsController } =
        useContext(WalletContext);
    const { account, provider } = state;

    const balance = useBalance(provider, account, 5000);

    const sendTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(recipient);
        console.log(amount);

        const tx: SendTransactionParams = {
            value: ethers.utils.parseEther(amount).toHexString(),
            to: recipient,
        };

        const hash = await transactionsController.sendTransaction([tx]);
    };

    useEffect(() => {
        const getAddress = async () => {
            const address = await transactionsController.getAddress();
            setAccount(dispatch, address);
        };
        getAddress();
        console.log(account);
    }, [setAccount]);

    return (
        <div className="App">
            <header>
                <h1>Signum</h1>
            </header>
            <main>
                <div>
                    <h2>ETH Balance: </h2>
                    <p>{balance || "0.0"}</p>
                </div>
                <div>
                    <h2>Account: </h2>
                    <p>{account || "0x..."}</p>
                </div>
                <form onSubmit={sendTransaction}>
                    <label htmlFor="recipient">Recipient</label>
                    <input
                        id="recipient"
                        type="text"
                        value={recipient}
                        placeholder="Enter recipient here"
                        onChange={(e) => setRecipient(e.target.value)}
                    />
                    <label htmlFor="amount">Amount</label>
                    <input
                        id="amount"
                        type="text"
                        value={amount}
                        placeholder="Enter amount here"
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <button type="submit">Send</button>
                </form>
            </main>
        </div>
    );
}

export default App;
