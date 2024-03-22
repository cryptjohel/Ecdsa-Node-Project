import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

// Define hexToBytes function
function hexToBytes(hex) {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return new Uint8Array(bytes);
}

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  // Define signTransaction function
  function signTransaction(message, privateKey) {
    // Convert the privateKey from hexadecimal string to bytes
    const privateKeyBytes = hexToBytes(privateKey);

    // Convert the message to bytes using TextEncoder
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);

    // Sign the message using secp256k1
    const { r, s } = secp256k1.sign(messageBytes, privateKeyBytes);

    // Return the signature
    return { r, s };
  }

  async function sendTransaction(signature) {
    try {
      // Convert BigInt values to strings before sending the transaction
      const signatureString = JSON.stringify({
        r: signature.r.toString(), // Convert BigInt to string
        s: signature.s.toString(), // Convert BigInt to string
      });
      const amountString = sendAmount.toString(); // Convert BigInt to string

      const response = await server.post(`send`, {
        sender: address,
        amount: amountString,
        recipient,
        signature: signatureString,
      });

      if (response.status === 200) {
        setBalance(response.data.balance);
      } else {
        console.error("Error Sending Transaction", response.data);
        // Handle error response accordingly
      }
    } catch (error) {
      console.error("Error Sending Transaction", error);
      // Handle other errors (e.g., network error)
    }
  }

  async function transfer(evt) {
    evt.preventDefault();

    if (!sendAmount || !recipient || !privateKey) {
      alert("Please fill in all fields.");
      return;
    }

    // Sign the transaction before sending
    const signature = signTransaction(
      `Sender: ${address}, Recipient: ${recipient}, Amount: ${sendAmount}`,
      privateKey
    );

    // Call sendTransaction with the signature
    await sendTransaction(signature);
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          type="number" // Use type="number" for amount input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        />
      </label>

      <label>
        Private Key
        <input
          type="password"
          placeholder="Enter your Private Key"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
        />
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        />
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
