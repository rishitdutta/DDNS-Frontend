<script lang="ts">
  export let contract: any;

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
    } catch (e: any) {
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
    } catch (e: any) {
      const errorMessage = e.shortMessage || e.message || "Update failed";
      status = errorMessage;
      statusType = "error";
    }

    loading = false;
  }
</script>

<div class="card">
  <h2>Register & Manage Domain</h2>

  <div class="mt-6 mb-8">
    <h3 class="mb-4">Register New Domain</h3>
    <div class="mb-4">
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

  <div class="border-t border-border pt-8">
    <h3 class="mb-4">Update A Record</h3>
    <div class="mb-4">
      <label for="update-domain">Domain Name</label>
      <input
        id="update-domain"
        type="text"
        bind:value={domain}
        placeholder="example.blockchain"
        disabled={loading}
      />
    </div>
    <div class="mb-4">
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
