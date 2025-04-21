"use client";

import { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Loader2 } from 'lucide-react';
import { getContract } from '@/lib/contract';
import { ethers } from 'ethers';
import { useDropzone } from 'react-dropzone';
import { pinata } from '@/lib/config';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState('');
  const [pdfDescription, setPdfDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if wallet is connected on component mount
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setIsWalletConnected(accounts.length > 0);
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      console.log("File selected:", acceptedFiles[0].name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const uploadToPinata = async () => {
    if (!selectedFile) {
      toast({
        title: "Upload Failed",
        description: "No file selected",
        variant: "destructive",
      });
      return '';
    }

    try {
      console.log("Starting Pinata upload process");
      
      // Create a FormData object to properly format the file
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const upload = await pinata.upload.file(selectedFile);
      console.log("Upload response from Pinata:", upload);
      
      // Check if IpfsHash exists
      if (!upload.IpfsHash) {
        console.error("No IpfsHash returned from Pinata");
        return '';
      }
      
      const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash);
      
      toast({
        title: "Upload Successful",
        description: "Document uploaded to IPFS",
      });
      return upload.IpfsHash; 
    } catch (error) {
      console.error("Pinata upload error details:", error);
      
      toast({
        title: "Upload Failed",
        description: "Error uploading document to Pinata",
        variant: "destructive",
      });
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !pdfName || !pdfDescription) {
      toast({
        title: "Missing Info",
        description: "Please complete all fields",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const ipfsHash = await uploadToPinata();
      if (!ipfsHash) {
        setIsUploading(false);
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = getContract(signer);
      
      const tx = await contract.createRequest(pdfName, pdfDescription, ipfsHash);
      await tx.wait();

      toast({
        title: "Request Submitted",
        description: "Your PDF has been submitted for admin review",
      });

      setPdfName('');
      setPdfDescription('');
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload process error:", error);
      
      toast({
        title: "Upload Failed",
        description: "Something went wrong during the process",
        variant: "destructive",
      });
    }

    setIsUploading(false);
  };

  if (!isWalletConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 text-center">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">Wallet Connection Required</h2>
          <p className="text-gray-600 mb-4">Please connect your wallet using the button in the navigation bar to upload PDFs.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <div className="text-center mb-8">
          <FileText className="w-12 h-12 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold">Upload PDF</h1>
          <p className="text-gray-600 mt-2">Submit your PDF for admin approval</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="pdfName">PDF Name</Label>
            <Input
              id="pdfName"
              value={pdfName}
              onChange={(e) => setPdfName(e.target.value)}
              placeholder="Enter PDF name"
              required
            />
          </div>

          <div>
            <Label htmlFor="pdfDescription">Description</Label>
            <Textarea
              id="pdfDescription"
              value={pdfDescription}
              onChange={(e) => setPdfDescription(e.target.value)}
              placeholder="Enter PDF description"
              required
            />
          </div>

          <div>
            <Label>Upload PDF</Label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${
                isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              {selectedFile ? (
                <p className="text-sm text-gray-700">
                  Selected File: <strong>{selectedFile.name}</strong>
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Drag and drop your PDF here, or click to select a file
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload PDF
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}