import { contractAddress } from "../constants/constant";
import React, { useEffect, useState } from "react";
import { ethers, Contract, providers } from "ethers";
import abi from "../constants/abi.json";







export const ConnectContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const stolidContract = new ethers.Contract(contractAddress, abi.abi, signer);

  return stolidContract;
};

const fetchClosedCases = async () => {
  const contract = createEthereumContract();

  try {
    const result = await contract.closedCases();

    return result
  }
  catch (error) {
    console.log(error)

  }
}



export const ConnectProvider = ({ children }) => {

  const [connectedWallet, setConnectedWallet] = useState(false);

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnect = async () => {

    try {
      if (!ethereum) return alert("Please install MetaMask.");
      // const provider = new ethers.providers.Web3Provider(ethereum);
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        //  setCurrentAccount(await provider.lookupAddress(accounts[0]));
        setCurrentAccount(accounts[0]);

      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };



  const connectWallet = async () => {

    try {

      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });


      setCurrentAccount(accounts[0]);


      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);









  return (
    <ConnectContext.Provider
      value={{


        connectWallet,

        fetchClosedCases,

        currentAccount

      }}
    >
      {children}
    </ConnectContext.Provider>
  );
};