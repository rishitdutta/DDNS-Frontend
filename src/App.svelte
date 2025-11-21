<script lang="ts">
  import ConnectWallet from "./lib/ConnectWallet.svelte";
  import RegisterDomain from "./lib/RegisterDomain.svelte";
  import ViewDomain from "./lib/ViewDomain.svelte";

  let wallet: any = {
    address: null,
    signer: null,
    contract: null,
  };

  let backendStatus = "checking";

  // Check backend health on load
  async function checkBackend() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/health`
      );
      if (response.ok) {
        backendStatus = "online";
      } else {
        backendStatus = "offline";
      }
    } catch (e) {
      backendStatus = "offline";
    }
  }

  checkBackend();

  function handleWalletConnect(event: CustomEvent) {
    wallet = event.detail;
  }

  function handleDisconnect() {
    wallet = {
      address: null,
      signer: null,
      contract: null,
    };
  }
</script>

<main class="container">
  <header class="mb-12 text-center">
    <h1>Blockchain DNS</h1>
    <p class="text-muted text-lg mt-2">Decentralized Domain Name System</p>
    {#if backendStatus !== "checking"}
      <p
        class="text-sm mt-3 {backendStatus === 'online'
          ? 'text-success'
          : 'text-error'}"
      >
        Backend: {backendStatus === "online" ? "🟢 Online" : "🔴 Offline"}
      </p>
    {/if}
  </header>

  <ConnectWallet
    {wallet}
    on:connect={handleWalletConnect}
    on:disconnect={handleDisconnect}
  />

  {#if wallet.contract}
    <RegisterDomain contract={wallet.contract} />
    <ViewDomain contract={wallet.contract} />
  {/if}

  <footer class="text-center mt-16 text-muted text-sm">
    Built with Svelte + Ethers.js • Ethereum Sepolia Testnet
  </footer>
</main>
