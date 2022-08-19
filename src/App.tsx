import { ethers } from "ethers";
import { useState } from "react";
import { useWallet, WalletProvider } from "./contexts/WalletContext";
import { SendTransactionParams } from "./types/sendTransactionParams";

function App() {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");

    const { provider, transactionController } = useWallet();

    const sendTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(recipient);
        console.log(amount);

        const tx: SendTransactionParams = {
            value: ethers.utils.parseEther(amount).toHexString(),
            to: recipient,
        };

        const hash = await transactionController.sendTransaction([tx]);
    };

    return (
        <WalletProvider>
            <div className="App">
                <header>
                    <h1>Signum</h1>
                </header>
                <main>
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
        </WalletProvider>
    );
}

export default App;
