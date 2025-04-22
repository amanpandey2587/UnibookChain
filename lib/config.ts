import { PinataSDK } from "pinata-web3";

console.log("Pinata environment variables status:", {
  jwt: process.env.NEXT_PUBLIC_PINATA_JWT ? "Available" : "Missing",
  gateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL ? "Available" : "Missing"
});

export const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL
});

export const isPinataConfigured = () => {
  return !!process.env.NEXT_PUBLIC_PINATA_JWT && 
         !!process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL;
};
