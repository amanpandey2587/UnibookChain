import { PinataSDK } from "pinata-web3";

console.log("Pinata environment variables status:", {
  jwt: process.env.NEXT_PUBLIC_PINATA_JWT ? "Available" : "Missing",
  gateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL ? "Available" : "Missing"
});

export const pinata = new PinataSDK({
  pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkYTk1NGNlMS1jNzc4LTQzMDctOTU1ZC0yNWNiZWExMTdlMGIiLCJlbWFpbCI6ImFtYW5wYW5kZXkxNzgyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJhZGE5ZDZkM2FhMzIxOTBhM2MwNSIsInNjb3BlZEtleVNlY3JldCI6ImViMDNjZDBhODk3YTFmOTViYWIxMDhjNjU1Y2RkNTQ1ZDY5NDRlZmQ0N2Q5NjA4YTBjMDRhOGRhZDZmMzU4MTYiLCJleHAiOjE3Njk0NDEzNzZ9.AnQMEIuafC4byGC3J_46EvGxGtQaF57QEG4oUBd2DSM",
  pinataGateway: "brown-deep-lion-489.mypinata.cloud"
});

export const isPinataConfigured = () => {
  return !!process.env.NEXT_PUBLIC_PINATA_JWT && 
         !!process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL;
};