import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Connection, PublicKey, Keypair, Transaction, SystemProgram } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const senderKeypair = Keypair.generate(); // Replace with your actual sender keypair

const PromptTokenApp = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleAirdrop = async () => {
    if (!walletAddress || !amount) {
      setStatus('Please enter both wallet address and amount.');
      return;
    }

    try {
      const recipientPublicKey = new PublicKey(walletAddress);
      const lamports = parseFloat(amount) * 1e9; // Convert SOL to lamports

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: recipientPublicKey,
          lamports,
        })
      );

      const signature = await connection.sendTransaction(transaction, [senderKeypair]);
      await connection.confirmTransaction(signature, "confirmed");

      setStatus(`Successfully sent ${amount} SOL to ${walletAddress}! Transaction Signature: ${signature}`);
    } catch (error) {
      console.error(error);
      setStatus('Transaction failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Prompt-Token Airdrop</h1>

          <div className="mb-4">
            <Label htmlFor="walletAddress">Recipient Wallet Address</Label>
            <Input
              id="walletAddress"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter wallet address"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="amount">Amount (SOL)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <Button className="w-full" onClick={handleAirdrop}>
            Send Tokens
          </Button>

          {status && <p className="mt-4 text-center text-sm text-gray-600">{status}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptTokenApp;
