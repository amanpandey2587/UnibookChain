'use client';
import React from "react";
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { getContract } from "@/lib/contract";
import { Book, FileText, ExternalLink } from "lucide-react";
import "./book.css"
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

const BookComponent =({ request }: { request: Request })  => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleBook = () => {
        setIsOpen(!isOpen);
    }
    const getIpfsUrl = (hash: string): string=> {
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
    };
    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString();
    };
    
    return (
        <div className="mb-8">
            <div 
                className={`book-container ${isOpen ? 'book-open' : ''}`} 
                onClick={toggleBook}
            >
        
                <div className="book-cover">
                    <div className="book-spine"></div>
                    <div className="book-front ml-10">
                        <h3 className="text-lg font-semibold">{request.pdfName}</h3>
                        <p className="text-xs text-gray-200 mt-1 line-clamp-2">{request.pdfDescription}</p>
                        <p className="text-xs text-gray-200 mt-2 absolute bottom-4">
                            By: {request.requester.substring(0, 6)}...{request.requester.substring(request.requester.length - 4)}
                        </p>
                    </div>
                </div>
                
                {/* Book Content */}
                <div className="book-content">
                    <div className="book-page right-page">
                        <div className="page-content">
                            {request.pdfHash ? (
                                <div className="pdf-preview">
                                    <h3 className="text-lg font-semibold mb-2">PDF Preview</h3>
                                    <div className="pdf-frame">
                                        <iframe 
                                            src={`${getIpfsUrl(request.pdfHash)}#toolbar=0&navpanes=0`}
                                            className="pdf-iframe"
                                            title={`Preview of ${request.pdfName}`}
                                        />
                                    </div>
                                    <a 
                                        href={getIpfsUrl(request.pdfHash)} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="view-pdf-btn"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ExternalLink size={16} className="mr-1" />
                                        Open PDF
                                    </a>
                                </div>
                            ) : (
                                <div className="pdf-not-available">
                                    <FileText size={48} className="text-gray-300 mb-2" />
                                    <p className="text-gray-500">PDF not available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function page() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const { toast } = useToast();

    const loadAcceptedRequests = async () => {
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
                    
                    if (requestInfo.isApproved) {
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
                    }
                } catch (error) {
                    console.error(`Error loading request ${i}`);
                }
            }
            
            console.log("Requests data in the frontend is", requestsData);
            setRequests(requestsData);
        } catch (error) {
            console.log("Error in library page is ", error);
        }
    };

    useEffect(() => {
        loadAcceptedRequests();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <Book className="w-12 h-12 mx-auto text-primary mb-4" />
                    <h1 className="text-3xl font-bold">Library Page</h1>
                    <p className="text-gray-600">See all the chain approved books here</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((request) => (
                        <BookComponent key={request.id} request={request} />
                    ))}
                </div>
                
                {requests.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No approved books found</p>
                    </div>
                )}
            </div>
        </div>
    );
}