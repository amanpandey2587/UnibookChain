'use client';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ContractABI from '../ContractABI.json'; 
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

const CONTRACT_ADDRESS = '0x5e69F6891A959aCfB4795201E720e1D1BC5B73Cc';

const FREE_TIER = 0;
const BASIC_TIER = 1;
const PREMIUM_TIER = 2;

const SubscriptionPage: React.FC = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTier, setCurrentTier] = useState<number>(0);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<Date | null>(null);
  const [basicPrice, setBasicPrice] = useState<string>('0.01');
  const [premiumPrice, setPremiumPrice] = useState<string>('0.03');
  const [uploadCount, setUploadCount] = useState<number>(0);
  const [basicTierLimit, setBasicTierLimit] = useState<number>(10);
  const [freeTierLimit, setFreeTierLimit] = useState<number>(2);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<number>(0);
  const [error, setError] = useState<string>('');

  // Connect to wallet and initialize contract
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        setLoading(true);
        
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setAccount(account);
        
        // Initialize provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        
        const signer = provider.getSigner();
        setSigner(signer);
        
        // Initialize contract instance
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ContractABI, signer);
        setContract(contractInstance);
        
        // Load user data
        await loadUserData(contractInstance, account);
        
        setLoading(false);
      } else {
        setError('Please install MetaMask to use this dApp');
        setLoading(false);
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setError('Failed to connect to wallet');
      setLoading(false);
    }
  };

  const loadUserData = async (contractInstance: ethers.Contract, userAddress: string) => {
    try {
      const tier = await contractInstance.subscriptionTier(userAddress);
      setCurrentTier(tier);
      
      const expiry = await contractInstance.subscriptionExpiry(userAddress);
      const expiryDate = new Date(expiry.toNumber() * 1000);
      setSubscriptionExpiry(expiryDate);
      
      const basicTierPrice = await contractInstance.basicTierPrice();
      setBasicPrice(ethers.utils.formatEther(basicTierPrice));
      
      const premiumTierPrice = await contractInstance.premiumTierPrice();
      setPremiumPrice(ethers.utils.formatEther(premiumTierPrice));
      
      const uploads = await contractInstance.userUploadCount(userAddress);
      setUploadCount(uploads.toNumber());
      
      const freeLimit = await contractInstance.freeTierUploadLimit();
      setFreeTierLimit(freeLimit);
      
      const basicLimit = await contractInstance.basicTierUploadLimit();
      setBasicTierLimit(basicLimit);
    } catch (error) {
      console.error("Error loading user data:", error);
      setError('Failed to load user data');
    }
  };

  useEffect(() => {
    connectWallet();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0]);
        if (contract) {
          loadUserData(contract, accounts[0]);
        }
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const handleSubscribe = (tier: number) => {
    setSelectedTier(tier);
    setShowConfirmDialog(true);
  };

  const purchaseSubscription = async () => {
    if (!contract || !signer) return;
    
    try {
      setIsProcessing(true);
      
      const price = selectedTier === BASIC_TIER 
        ? ethers.utils.parseEther(basicPrice) 
        : ethers.utils.parseEther(premiumPrice);
      const tx = await contract.purchaseSubscription(selectedTier, { value: price });
      await tx.wait();
      await loadUserData(contract, account);
      
      setIsProcessing(false);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Error purchasing subscription:", error);
      setError('Transaction failed. Please try again.');
      setIsProcessing(false);
      setShowConfirmDialog(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getTierName = (tier: number) => {
    switch (tier) {
      case FREE_TIER:
        return 'Free';
      case BASIC_TIER:
        return 'Basic';
      case PREMIUM_TIER:
        return 'Premium';
      default:
        return 'Unknown';
    }
  };

  const isSubscriptionActive = () => {
    if (!subscriptionExpiry) return false;
    return subscriptionExpiry > new Date();
  };

  const getUploadsRemaining = () => {
    if (currentTier === PREMIUM_TIER) return 'Unlimited';
    if (currentTier === BASIC_TIER) return Math.max(0, basicTierLimit - uploadCount).toString();
    return Math.max(0, freeTierLimit - uploadCount).toString();
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-cyan-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-cyan-700">PDF Repository Subscription</h1>
  
      {loading ? (
        <div className="text-center py-10 text-cyan-700">Loading...</div>
      ) : !account ? (
        <div className="text-center py-10">
          <Button onClick={connectWallet} size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
            Connect Wallet
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      ) : (
        <>
          <Card className="mb-8 border-cyan-300 shadow-md">
            <CardHeader>
              <CardTitle className="text-teal-700">Current Subscription</CardTitle>
              <CardDescription>Your current subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 text-cyan-800">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Account:</span>
                  <span className="font-mono">{account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Current Tier:</span>
                  <Badge
                    variant="default"
                    className={
                      currentTier === PREMIUM_TIER
                        ? "bg-indigo-600 text-white"
                        : currentTier === BASIC_TIER
                        ? "bg-teal-400 text-white"
                        : "border-cyan-600 text-cyan-700"
                    }
                  >
                    {getTierName(currentTier)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status:</span>
                  <Badge
                    variant="default"
                    className={
                      isSubscriptionActive()
                        ? "bg-teal-500 hover:bg-teal-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }
                  >
                    {isSubscriptionActive() ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Expiry Date:</span>
                  <span>{formatDate(subscriptionExpiry)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Uploads Used:</span>
                  <span>{uploadCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Uploads Remaining:</span>
                  <span>{getUploadsRemaining()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
  
          <h2 className="text-2xl font-bold mb-4 text-cyan-700">Subscription Plans</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Free Plan */}
            <Card className="border border-cyan-300">
              <CardHeader>
                <CardTitle className="text-cyan-700">Free</CardTitle>
                <CardDescription>Basic access with limited uploads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4 text-cyan-600">0 ETH</div>
                <ul className="list-disc pl-5 space-y-2 text-cyan-800">
                  <li>Limited to {freeTierLimit} uploads</li>
                  <li>No access to LLM for other PDFs</li>
                  <li>No queue priority</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-cyan-600 text-cyan-700 hover:bg-cyan-100"
                  disabled={currentTier === FREE_TIER}
                >
                  {currentTier === FREE_TIER ? 'Current Plan' : 'Default Plan'}
                </Button>
              </CardFooter>
            </Card>
  
            {/* Basic Plan */}
            <Card className="border border-cyan-300">
              <CardHeader>
                <CardTitle className="text-teal-700">Basic</CardTitle>
                <CardDescription>Better access with more uploads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4 text-teal-600">{basicPrice} ETH</div>
                <ul className="list-disc pl-5 space-y-2 text-cyan-800">
                  <li>Up to {basicTierLimit} uploads</li>
                  <li>Access to LLM for all approved PDFs</li>
                  <li>Medium queue priority</li>
                  <li>30-day subscription</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    currentTier === BASIC_TIER && isSubscriptionActive()
                      ? "border-teal-600 text-teal-700 hover:bg-teal-50"
                      : "bg-teal-600 hover:bg-teal-700 text-white"
                  }`}
                  variant={currentTier === BASIC_TIER && isSubscriptionActive() ? "outline" : "default"}
                  disabled={currentTier === BASIC_TIER && isSubscriptionActive()}
                  onClick={() => handleSubscribe(BASIC_TIER)}
                >
                  {currentTier === BASIC_TIER && isSubscriptionActive()
                    ? 'Current Plan'
                    : currentTier === BASIC_TIER
                    ? 'Renew Plan'
                    : 'Upgrade to Basic'}
                </Button>
              </CardFooter>
            </Card>
  
            {/* Premium Plan */}
            <Card className="border-2 border-indigo-600 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-indigo-700">Premium</CardTitle>
                  <Badge className="bg-indigo-600 text-white">Recommended</Badge>
                </div>
                <CardDescription>Full access with unlimited uploads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4 text-indigo-600">{premiumPrice} ETH</div>
                <ul className="list-disc pl-5 space-y-2 text-cyan-800">
                  <li>Unlimited uploads</li>
                  <li>Access to LLM for all approved PDFs</li>
                  <li>Highest queue priority</li>
                  <li>30-day subscription</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    currentTier === PREMIUM_TIER && isSubscriptionActive()
                      ? "border-indigo-600 text-indigo-700 hover:bg-indigo-50"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                  variant={currentTier === PREMIUM_TIER && isSubscriptionActive() ? "outline" : "default"}
                  disabled={currentTier === PREMIUM_TIER && isSubscriptionActive()}
                  onClick={() => handleSubscribe(PREMIUM_TIER)}
                >
                  {currentTier === PREMIUM_TIER && isSubscriptionActive()
                    ? 'Current Plan'
                    : currentTier === PREMIUM_TIER
                    ? 'Renew Plan'
                    : 'Upgrade to Premium'}
                </Button>
              </CardFooter>
            </Card>
          </div>
  
          {/* Confirmation Dialog */}
          <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-cyan-700">Confirm Subscription</AlertDialogTitle>
                <AlertDialogDescription className="text-cyan-800">
                  You are about to purchase a {getTierName(selectedTier)} subscription for{" "}
                  {selectedTier === BASIC_TIER ? basicPrice : premiumPrice} ETH. This will give you access for 30 days.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isProcessing} className="text-cyan-700 hover:text-cyan-900">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={purchaseSubscription}
                  disabled={isProcessing}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Purchase'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
  
          {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        </>
      )}
    </div>
  );
  
};

export default SubscriptionPage;