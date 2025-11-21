<script>
  export let contract;

  let searchDomain = "";
  let records = null;
  let loading = false;
  let error = "";

  async function search() {
    const trimmedDomain = searchDomain.trim();
    if (!trimmedDomain) return;

    loading = true;
    error = "";
    records = null;

    try {
      const result = await contract.getRecords(trimmedDomain);

      // Check if domain exists (owner is not zero address)
      const zeroAddress = "0x0000000000000000000000000000000000000000";
      if (result && result[0] && result[0] !== zeroAddress) {
        records = {
          owner: result[0],
          aRecord: result[1] || "",
          cnameRecord: result[2] || "",
          txtRecord: result[3] || "",
        };
      } else {
        error = "Domain not found";
      }
    } catch (e) {
      const errorMessage = e.message || "Failed to fetch domain";
      error = errorMessage;
    }

    loading = false;
  }

  function formatAddress(addr) {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      search();
    }
  }
</script>

<div class="card">
  <h2>View Domain Records</h2>

  <div style="margin-top: 1.5rem;">
    <label for="search-domain">Search Domain</label>
    <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
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
        style="white-space: nowrap; min-width: 120px;"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  </div>

  {#if records}
    <div
      style="background: #242424; padding: 1.5rem; border-radius: 8px; margin-top: 1.5rem;"
    >
      <h3 style="color: #00b8d4; margin-bottom: 1rem;">{searchDomain}</h3>

      <div style="display: grid; gap: 1.25rem;">
        <div>
          <p style="color: #888; font-size: 0.9rem; margin-bottom: 0.25rem;">
            Owner
          </p>
          <p style="font-family: 'Courier New', monospace;">
            {formatAddress(records.owner)}
          </p>
        </div>

        {#if records.aRecord}
          <div>
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 0.25rem;">
              A Record
            </p>
            <p style="font-family: 'Courier New', monospace;">
              {records.aRecord}
            </p>
          </div>
        {/if}

        {#if records.cnameRecord}
          <div>
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 0.25rem;">
              CNAME Record
            </p>
            <p style="font-family: 'Courier New', monospace;">
              {records.cnameRecord}
            </p>
          </div>
        {/if}

        {#if records.txtRecord}
          <div>
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 0.25rem;">
              TXT Record
            </p>
            <p
              style="font-family: 'Courier New', monospace; word-break: break-all;"
            >
              {records.txtRecord}
            </p>
          </div>
        {/if}
      </div>
    </div>
  {:else if error}
    <div class="status error">{error}</div>
  {/if}
</div>
