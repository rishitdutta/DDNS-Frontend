<script>
  import ConnectWallet from "./lib/ConnectWallet.svelte";
  import RegisterDomain from "./lib/RegisterDomain.svelte";
  import ViewDomain from "./lib/ViewDomain.svelte";

  let wallet = {
    address: null,
    signer: null,
    contract: null,
  };

  function handleWalletConnect(event) {
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
  <header style="margin-bottom: 3rem; text-align: center;">
    <h1>Blockchain DNS</h1>
    <p style="color: #888; font-size: 1.05rem; margin-top: 0.5rem;">
      Decentralized Domain Name System
    </p>
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

  <footer
    style="text-align: center; margin-top: 4rem; color: #666; font-size: 0.85rem;"
  >
    Built with Svelte + Ethers.js • Ethereum Sepolia Testnet
  </footer>
</main>
