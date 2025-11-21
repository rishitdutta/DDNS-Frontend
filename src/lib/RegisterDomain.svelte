<script>
  export let contract;

  let domain = "";
  let aRecord = "";
  let loading = false;
  let status = "";
  let statusType = "";

  async function register() {
    if (!domain.trim()) {
      status = "Please enter a domain name";
      statusType = "error";
      return;
    }

    loading = true;
    status = "Registering domain...";
    statusType = "info";

    try {
      const tx = await contract.registerDomain(domain);
      status = "Waiting for confirmation...";
      await tx.wait();

      status = `Domain "${domain}" registered successfully!`;
      statusType = "success";
      domain = "";
    } catch (e) {
      const errorMessage = e.shortMessage || e.message || "Registration failed";
      status = errorMessage;
      statusType = "error";
    }

    loading = false;
  }

  async function updateA() {
    if (!domain.trim() || !aRecord.trim()) {
      status = "Please fill in all fields";
      statusType = "error";
      return;
    }

    loading = true;
    status = "Updating A record...";
    statusType = "info";

    try {
      const tx = await contract.updateARecord(domain, aRecord);
      status = "Waiting for confirmation...";
      await tx.wait();

      status = `A record updated for "${domain}"!`;
      statusType = "success";
      aRecord = "";
    } catch (e) {
      const errorMessage = e.shortMessage || e.message || "Update failed";
      status = errorMessage;
      statusType = "error";
    }

    loading = false;
  }
</script>

<div class="card">
  <h2>Register & Manage Domain</h2>

  <div style="margin-top: 1.5rem; margin-bottom: 2rem;">
    <h3 style="margin-bottom: 1rem;">Register New Domain</h3>
    <div style="margin-bottom: 1rem;">
      <label for="register-domain">Domain Name</label>
      <input
        id="register-domain"
        type="text"
        bind:value={domain}
        placeholder="example.blockchain"
        disabled={loading}
      />
    </div>
    <button on:click={register} disabled={loading}>
      {loading ? "Registering..." : "Register Domain"}
    </button>
  </div>

  <div style="border-top: 1px solid #2a2a2a; padding-top: 2rem;">
    <h3 style="margin-bottom: 1rem;">Update A Record</h3>
    <div style="margin-bottom: 1rem;">
      <label for="update-domain">Domain Name</label>
      <input
        id="update-domain"
        type="text"
        bind:value={domain}
        placeholder="example.blockchain"
        disabled={loading}
      />
    </div>
    <div style="margin-bottom: 1rem;">
      <label for="a-record">IP Address (A Record)</label>
      <input
        id="a-record"
        type="text"
        bind:value={aRecord}
        placeholder="192.168.1.1"
        disabled={loading}
      />
    </div>
    <button on:click={updateA} disabled={loading}>
      {loading ? "Updating..." : "Update A Record"}
    </button>
  </div>

  {#if status}
    <div class="status {statusType}">{status}</div>
  {/if}
</div>
