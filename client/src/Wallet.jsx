import React, { useState } from "react";
import server from "./server";

function Wallet({ address, setAddress, balance, setBalance }) {
  const [loading, setLoading] = useState(false); // State for loading indicator

  // Function to fetch balance based on wallet address
  async function fetchBalance(walletAddress) {
    setLoading(true); // Start loading indicator
    try {
      const response = await server.get(`balance/${walletAddress}`);
      const newBalance = response.data.balance;
      setBalance(newBalance); // Update the balance state with the new value
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(0); // Reset the balance to 0 if there's an error
    } finally {
      setLoading(false); // Stop loading indicator
    }
  }

  // Function to handle wallet address change
  function handleAddressChange(evt) {
    const newAddress = evt.target.value;
    setAddress(newAddress); // Update the address state with the new value
    if (newAddress) {
      fetchBalance(newAddress); // Fetch balance for the new address
    } else {
      setBalance(0); // Reset the balance to 0 if the address is empty
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input
          placeholder="Type an address, for example: 0x1"
          value={address}
          onChange={handleAddressChange}
        ></input>
      </label>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="balance">Balance: {balance}</div>
      )}
    </div>
  );
}

export default Wallet;
