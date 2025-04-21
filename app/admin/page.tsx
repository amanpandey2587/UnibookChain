"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card,CardContent,CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Check, X, ExternalLink, FileText } from 'lucide-react';
import { getContract } from '@/lib/contract';
import { ethers } from 'ethers';

interface Request {
  id: number;
  requester: string;
  pdfName: string;
  pdfDescription: string;
  requestTime: number;
  isApproved: boolean;
  isProcessed: boolean;
  approvalCount: number;
  rejectionCount: number;
  pdfHash: string;
}

export default function AdminPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
    loadRequests();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = getContract(signer);
      const address = await signer.getAddress();
      const adminStatus = await contract.admins(address);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error(error);
    }
  };

  const loadRequests = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = getContract(provider);
      const requestCount = await contract.requestIdCounter();
      
      const requestsData = [];
      
      for (let i = 0; i < requestCount; i++) {
        try {
          const [requestInfo, pdfHash] = await Promise.all([
            contract.getRequestInfo(i),
            contract.getRequestPDFHash(i)
          ]);
          
          requestsData.push({
            id: i,
            requester: requestInfo.requester,
            pdfName: requestInfo.pdfName,
            pdfDescription: requestInfo.pdfDescription,
            requestTime: requestInfo.requestTime.toNumber(),
            isApproved: requestInfo.isApproved,
            isProcessed: requestInfo.isProcessed,
            approvalCount: requestInfo.approvalCount,
            rejectionCount: requestInfo.rejectionCount,
            pdfHash: pdfHash
          });
        } catch (error) {
          console.error(`Error loading request ${i}:`, error);
        }
      }
      
      setRequests(requestsData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVote = async (requestId: number, approve: boolean) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = getContract(signer);
      const tx = await contract.voteOnRequest(requestId, approve);
      await tx.wait();
      toast({
        title: "Success",
        description: `Vote submitted successfully`,
      });
      
      loadRequests();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Voting failed. You may have already voted on this request.",
        variant: "destructive",
      });
    }
  };

  const togglePdfView = (requestId: number) => {
    if (expandedRequestId === requestId) {
      setExpandedRequestId(null);
    } else {
      setExpandedRequestId(requestId);
    }
  };

  const getIpfsUrl = (hash: string) => {
    console.log("Original hash:", hash);
    if (!hash || hash.trim() === '') {
      return '';
    }
    if (hash.startsWith('http://') || hash.startsWith('https://')) {
      return hash;
    }
    let cleanHash = hash;
    if (hash.startsWith('ipfs://')) {
      cleanHash = hash.substring(7);
    }
    return `https://gateway.pinata.cloud/ipfs/${cleanHash}`;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2">You must be an admin to access this page.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-blue-900">Admin Dashboard</h1>
          <p className="text-blue-700 mt-2">Review and approve PDF upload requests</p>
        </div>
  
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="border border-blue-100 shadow-sm hover:shadow-md transition">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">{request.pdfName}</h3>
                    <p className="text-blue-700 mt-1">{request.pdfDescription}</p>
                    <p className="text-sm text-blue-500 mt-2">
                      Requested by: {request.requester}
                    </p>
                    <p className="text-sm text-blue-400">
                      Time: {new Date(request.requestTime * 1000).toLocaleString()}
                    </p>
                    <div className="mt-2">
                      <span className="text-sm text-green-600">
                        Approvals: {request.approvalCount}
                      </span>
                      <span className="text-sm text-red-500 ml-4">
                        Rejections: {request.rejectionCount}
                      </span>
                    </div>
  
                    {request.pdfHash && (
                      <Button 
                        variant="outline"
                        size="sm"
                        className="mt-3 text-blue-600 hover:text-blue-700 border-blue-200"
                        onClick={() => togglePdfView(request.id)}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        {expandedRequestId === request.id ? 'Hide PDF' : 'View PDF'}
                      </Button>
                    )}
  
                    {request.pdfHash && (
                      <a 
                        href={getIpfsUrl(request.pdfHash)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center ml-3 text-sm text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open in new tab
                      </a>
                    )}
                  </div>
  
                  {!request.isProcessed ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleVote(request.id, true)}
                        variant="outline"
                        className="text-green-600 hover:text-green-700 border-green-200"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleVote(request.id, false)}
                        variant="outline"
                        className="text-red-600 hover:text-red-700 border-red-200"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <div className={`text-sm font-medium ${
                      request.isApproved ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {request.isApproved ? 'Approved' : 'Rejected'}
                    </div>
                  )}
                </div>
  
                {expandedRequestId === request.id && request.pdfHash && (
                  <div className="mt-4 border border-blue-100 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 p-2 border-b border-blue-100">
                      <p className="text-sm font-medium text-blue-800">PDF Preview</p>
                    </div>
                    <iframe 
                      src={getIpfsUrl(request.pdfHash)} 
                      width="100%" 
                      height="500"
                      className="bg-white"
                      title={`PDF: ${request.pdfName}`}
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}
  
          {requests.length === 0 && (
            <Card className="p-6 text-center text-blue-500 border border-blue-100 shadow-none">
              No pending requests
            </Card>
          )}
        </div>
      </div>
    </div>
  )
  
}