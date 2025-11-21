<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { ethers } from "ethers";
  import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config.js";

  export let wallet: any;

  const dispatch = createEventDispatcher();
  let error = "";
  let loading = false;
  let hasMetaMask = false;

  // Check for MetaMask on component mount
  $: if (typeof window !== "undefined") {
    hasMetaMask = !!window.ethereum;
  }

  async function connect() {
    if (!window.ethereum) {
      error = "MetaMask not found";
      return;
    }

    loading = true;
    error = "";

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      dispatch("connect", { address, signer, contract });
    } catch (e: any) {
      error = e.message || "Connection failed";
    }

    loading = false;
  }

  function disconnect() {
    dispatch("disconnect");
  }

  function formatAddress(addr: string) {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }
</script>

<div class="card">
  <h2>Wallet Connection</h2>

  {#if !hasMetaMask}
    <div class="status error mt-4">
      MetaMask not found.
      <a
        href="https://metamask.io/download/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Install MetaMask
      </a> to continue.
    </div>
  {:else if wallet.address}
    <div class="flex justify-between items-center mt-4">
      <div>
        <p class="text-muted text-sm">Connected Address</p>
        <p class="font-mono text-lg mt-1">
          {formatAddress(wallet.address)}
        </p>
      </div>
      <button on:click={disconnect} class="btn-secondary"> Disconnect </button>
    </div>
    <div class="status success">✓ Wallet Connected</div>
  {:else}
    <button on:click={connect} disabled={loading} class="mt-4">
      {loading ? "Connecting..." : "Connect MetaMask"}
    </button>
    {#if error}
      <div class="status error">{error}</div>
    {/if}
  {/if}
</div>
