"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Shield, FileText, Home, Upload, Book, SubscriptIcon, UserPlus, Accessibility } from 'lucide-react';
import { ethers } from 'ethers';
import { getContract } from '@/lib/contract';
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const pathname = usePathname();
  const [account, setAccount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    if (account) {
      checkAdminStatus();
    }
  }, [account]);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      } else {
        toast({
          title: "MetaMask Required",
          description: "Please install MetaMask to use this DApp",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to wallet",
        variant: "destructive",
      });
    }
  };

  const checkAdminStatus = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const contract = getContract(provider);
      const adminStatus = await contract.admins(account);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-blue-600 shadow-md backdrop-blur text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center font-bold text-xl">
              <FileText className="h-7 w-7 text-white" />
              <span className="ml-2">UniBookChain</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {[
                { href: '/', icon: Home, label: 'Home' },
                { href: '/upload', icon: Upload, label: 'Upload PDF' },
                { href: '/library', icon: Book, label: 'Library' },
                { href: '/subscription', icon: UserPlus, label: 'Subscription' },
                { href: '/accessLLM', icon: Accessibility, label: 'Access LLM' }
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    pathname === href
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon className="mr-1 h-4 w-4" /> {label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/admin'
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Shield className="mr-1 h-4 w-4" /> Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {!account ? (
              <Button
                onClick={connectWallet}
                size="sm"
                className="bg-white text-blue-600 hover:bg-teal-100 font-medium"
              >
                Connect Wallet
              </Button>
            ) : (
              <div className="text-sm px-3 py-1 bg-white bg-opacity-20 rounded-full">
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {[
            { href: '/', icon: Home, label: 'Home' },
            { href: '/upload', icon: Upload, label: 'Upload PDF' },
            ...(isAdmin ? [{ href: '/admin', icon: Shield, label: 'Admin' }] : [])
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === href
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Icon className="inline mr-1 h-4 w-4" /> {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
