// Payment Gateways Provider: MetaMask Web3 + Wise International Wire

export const DEFAULT_MERCHANT_CONFIG = {
  designerName: "Laila Khalil Atelier",
  designerEmail: "contact@lailakhalil.com",
  isConfigured: false, // designer hasn't created live accounts yet
  wise: {
    payeeName: "Laila Khalil Couture Atelier",
    wiseTag: "@lailakhalil_couture",
    wiseEmail: "atelier.billing@lailakhalil.com",
    ibanEUR: "BE68 5390 0754 7034",
    swiftBIC: "TRWIBEB1XXX",
    bankName: "Wise Payments Europe (Brussels / London)",
    routingUSD: "026073150",
    accountUSD: "9832049182",
    sortCodeGBP: "23-14-70",
    accountGBP: "49201948"
  },
  metamask: {
    ethAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Provisional Atelier Vault
    supportedChains: [
      { id: "0x1", name: "Ethereum Mainnet", symbol: "ETH", rateToUSD: 2650 },
      { id: "0x89", name: "Polygon Network", symbol: "POL", rateToUSD: 0.45 },
      { id: "0xa4b1", name: "Arbitrum One", symbol: "ETH", rateToUSD: 2650 }
    ],
    stablecoins: ["USDT (ERC20)", "USDC (ERC20)", "USDC (Polygon)"]
  }
};

export class PaymentManager {
  constructor() {
    this.config = this.loadConfig();
    this.connectedWallet = null;
    this.walletChainId = null;
    this.cryptoRates = {
      ETH: 2650,
      USDT: 1.0,
      USDC: 1.0
    };
  }

  loadConfig() {
    try {
      const stored = localStorage.getItem("laila_khalil_merchant_config");
      if (stored) {
        return { ...DEFAULT_MERCHANT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn("Could not load config from localStorage", e);
    }
    return { ...DEFAULT_MERCHANT_CONFIG };
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig, isConfigured: true };
    try {
      localStorage.setItem("laila_khalil_merchant_config", JSON.stringify(this.config));
    } catch (e) {
      console.error("Could not save to localStorage", e);
    }
    return this.config;
  }

  // ================= METAMASK WEB3 FLOW =================

  hasMetaMask() {
    return typeof window !== 'undefined' && Boolean(window.ethereum && window.ethereum.isMetaMask);
  }

  async connectMetaMask() {
    if (!this.hasMetaMask()) {
      return {
        success: false,
        installed: false,
        message: "MetaMask extension is not detected in your browser."
      };
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      this.connectedWallet = accounts[0];
      this.walletChainId = chainId;

      // Listen to events
      window.ethereum.on('accountsChanged', (newAccounts) => {
        this.connectedWallet = newAccounts[0] || null;
        window.dispatchEvent(new CustomEvent('metamask_account_changed', { detail: this.connectedWallet }));
      });

      window.ethereum.on('chainChanged', (newChainId) => {
        this.walletChainId = newChainId;
        window.dispatchEvent(new CustomEvent('metamask_chain_changed', { detail: newChainId }));
      });

      return {
        success: true,
        installed: true,
        address: this.connectedWallet,
        chainId: this.walletChainId
      };
    } catch (err) {
      return {
        success: false,
        installed: true,
        message: err.message || "User rejected connection request."
      };
    }
  }

  async sendMetaMaskPayment(orderId, amountUSD, currency = "ETH") {
    if (!this.hasMetaMask()) {
      throw new Error("MetaMask not installed");
    }

    if (!this.connectedWallet) {
      const connectRes = await this.connectMetaMask();
      if (!connectRes.success) throw new Error(connectRes.message);
    }

    const recipientAddress = this.config.metamask.ethAddress;
    const ethRate = this.cryptoRates.ETH || 2650;
    const ethAmount = (amountUSD / ethRate).toFixed(5);
    
    // Convert to Wei hex
    const weiAmount = Math.floor(parseFloat(ethAmount) * 1e18);
    const hexValue = "0x" + weiAmount.toString(16);

    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: this.connectedWallet,
            to: recipientAddress,
            value: hexValue,
            data: "0x" + Array.from(new TextEncoder().encode(`LK-${orderId}`)).map(b => b.toString(16).padStart(2, '0')).join('')
          }
        ]
      });

      return {
        success: true,
        txHash,
        amountUSD,
        cryptoAmount: ethAmount,
        currency,
        recipient: recipientAddress
      };
    } catch (err) {
      return {
        success: false,
        message: err.message || "Transaction cancelled by user."
      };
    }
  }

  calculateCryptoPrice(usdPrice) {
    const ethRate = this.cryptoRates.ETH;
    return {
      ETH: (usdPrice / ethRate).toFixed(4),
      USDT: usdPrice.toFixed(2),
      USDC: usdPrice.toFixed(2)
    };
  }

  // ================= WISE WIRE TRANSFER FLOW =================

  generateWisePaymentDetails(orderId, amountUSD, clientCurrency = "USD") {
    const exchangeRates = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.79,
      EGP: 48.75,
      AED: 3.67,
      SAR: 3.75
    };

    const rate = exchangeRates[clientCurrency] || 1.0;
    const convertedAmount = (amountUSD * rate).toFixed(2);
    const reference = `LK-${orderId}`;

    return {
      orderId,
      reference,
      amountUSD,
      targetCurrency: clientCurrency,
      targetAmount: convertedAmount,
      wiseTag: this.config.wise.wiseTag,
      wiseEmail: this.config.wise.wiseEmail,
      payeeName: this.config.wise.payeeName,
      iban: this.config.wise.ibanEUR,
      swiftBic: this.config.wise.swiftBIC,
      bankName: this.config.wise.bankName,
      routingUSD: this.config.wise.routingUSD,
      accountUSD: this.config.wise.accountUSD,
      sortCodeGBP: this.config.wise.sortCodeGBP,
      accountGBP: this.config.wise.accountGBP,
      deepLink: `https://wise.com/pay/me/${encodeURIComponent(this.config.wise.wiseTag.replace('@', ''))}?amount=${convertedAmount}&currency=${clientCurrency}&description=${encodeURIComponent(reference)}`
    };
  }
}

export const paymentManager = new PaymentManager();
