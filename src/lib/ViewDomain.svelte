<script lang="ts">
  import { resolveDomain } from "../api.js";

  export let contract: any;

  let searchDomain = "";
  let records: any = null;
  let loading = false;
  let error = "";
  let useBackend = true; // Toggle between backend and blockchain

  async function searchViaBackend() {
    const trimmedDomain = searchDomain.trim();
    if (!trimmedDomain) return;

    loading = true;
    error = "";
    records = null;

    try {
      const result: any = await resolveDomain(trimmedDomain);

      records = {
        owner: result.owner,
        aRecord: result.aRecord || "",
        cnameRecord: result.cnameRecord || "",
        txtRecord: result.txtRecord || "",
        cached: result.cached || false,
      };
    } catch (e: any) {
      error = e.message || "Failed to fetch domain";
    }

    loading = false;
  }

  async function searchViaBlockchain() {
    const trimmedDomain = searchDomain.trim();
    if (!trimmedDomain) return;

    loading = true;
    error = "";
    records = null;

    try {
      const result = await contract.getRecords(trimmedDomain);

      const zeroAddress = "0x0000000000000000000000000000000000000000";
      if (result && result[0] && result[0] !== zeroAddress) {
        records = {
          owner: result[0],
          aRecord: result[1] || "",
          cnameRecord: result[2] || "",
          txtRecord: result[3] || "",
          cached: false,
        };
      } else {
        error = "Domain not found";
      }
    } catch (e: any) {
      error = e.message || "Failed to fetch domain";
    }

    loading = false;
  }

  function search() {
    if (useBackend) {
      searchViaBackend();
    } else {
      searchViaBlockchain();
    }
  }

  function formatAddress(addr: string) {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      search();
    }
  }

  function openSite() {
    if (!records || !records.aRecord) return;

    // Check if IP has protocol, if not add http://
    let url = records.aRecord;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `http://${url}`;
    }

    // Open in new tab
    window.open(url, "_blank", "noopener,noreferrer");
  }
</script>

<div class="card">
  <div class="flex justify-between items-center">
    <h2>View Domain Records</h2>
    <div class="flex items-center gap-2">
      <label for="use-backend" class="text-sm text-muted m-0">
        Use Backend
      </label>
      <input
        id="use-backend"
        type="checkbox"
        bind:checked={useBackend}
        class="w-auto cursor-pointer"
      />
    </div>
  </div>

  <div class="mt-6">
    <label for="search-domain">Search Domain</label>
    <div class="flex gap-4 mt-2">
      <input
        id="search-domain"
        type="text"
        bind:value={searchDomain}
        placeholder="example.blockchain"
        disabled={loading}
        on:keypress={handleKeyPress}
      />
      <button
        on:click={search}
        disabled={loading}
        class="whitespace-nowrap min-w-[120px]"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
    <p class="text-muted text-sm mt-2">
      {useBackend
        ? "⚡ Fast (cached via backend)"
        : "🔗 Direct blockchain query"}
    </p>
  </div>

  {#if records}
    <div class="bg-card-dark p-6 rounded-lg mt-6">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-3">
          <h3 class="text-primary m-0">{searchDomain}</h3>
          {#if records.cached}
            <span
              class="bg-primary/10 text-primary px-3 py-1 rounded text-sm border border-primary"
            >
              Cached
            </span>
          {/if}
        </div>
        {#if records.aRecord}
          <button
            on:click={openSite}
            class="flex items-center gap-2 px-4 py-2 text-sm"
            title="Open site"
          >
            <span>Open Site</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
              />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        {/if}
      </div>

      <div class="grid gap-5">
        <div>
          <p class="text-muted text-sm mb-1">Owner</p>
          <p class="font-mono">{formatAddress(records.owner)}</p>
        </div>

        {#if records.aRecord}
          <div>
            <p class="text-muted text-sm mb-1">A Record (IP Address)</p>
            <p class="font-mono">{records.aRecord}</p>
          </div>
        {/if}

        {#if records.cnameRecord}
          <div>
            <p class="text-muted text-sm mb-1">CNAME Record</p>
            <p class="font-mono">{records.cnameRecord}</p>
          </div>
        {/if}

        {#if records.txtRecord}
          <div>
            <p class="text-muted text-sm mb-1">TXT Record</p>
            <p class="font-mono break-all">{records.txtRecord}</p>
          </div>
        {/if}
      </div>
    </div>
  {:else if error}
    <div class="status error">{error}</div>
  {/if}
</div>
