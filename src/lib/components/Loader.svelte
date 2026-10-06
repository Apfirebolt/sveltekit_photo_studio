<script lang="ts">
  import { fade } from "svelte/transition";
  import Icon from "@iconify/svelte";

  export let text: string = "Softgenie Studio";
  export let subtext: string = "Processing asset geometry & filters...";
  export let fullScreen: boolean = true;
</script>

<div
  class="loader-overlay {fullScreen ? 'fixed inset-0 min-h-screen' : 'w-full py-16'}"
  role="status"
  aria-live="polite"
  aria-busy="true"
  out:fade={{ duration: 250 }}
>
  <!-- Subtle Ambient Glow -->
  <div class="glow-orb" />

  <div class="loader-card">
    <!-- Studio Icon Badge + Concentric Dual-Ring Spinner -->
    <div class="spinner-assembly">
      <div class="spinner-track" />
      <div class="spinner-glow" />
      <div class="spinner-core">
        <Icon icon="mdi:drawing-box" class="text-success text-sm" />
      </div>
    </div>

    <!-- Status Typography -->
    <div class="status-wrap">
      <div class="status-headline">
        <span class="status-title">{text}</span>
        <span class="dots-flurry">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </span>
      </div>
      {#if subtext}
        <p class="status-subtext">{subtext}</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .loader-overlay {
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 50% 40%, rgba(13, 28, 66, 0.88) 0%, rgba(5, 12, 30, 0.96) 100%);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    overflow: hidden;
  }

  .glow-orb {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(91, 145, 59, 0.2) 0%, rgba(49, 91, 140, 0.15) 50%, transparent 70%);
    filter: blur(52px);
    pointer-events: none;
    animation: pulse-glow 3s ease-in-out infinite alternate;
  }

  .loader-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 2.25rem 2.75rem;
    background: rgba(13, 28, 66, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  /* Spinner Assembly */
  .spinner-assembly {
    position: relative;
    width: 66px;
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner-track {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.08);
  }

  .spinner-glow {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #5B913B; /* Success Accent */
    border-right-color: #315B8C; /* Secondary Accent */
    animation: spin 0.85s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
  }

  .spinner-core {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(91, 145, 59, 0.2);
    border: 1px solid rgba(91, 145, 59, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 12px rgba(91, 145, 59, 0.4);
    animation: core-pulse 1.3s ease-in-out infinite alternate;
  }

  /* Typography */
  .status-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    text-align: center;
  }

  .status-headline {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .status-title {
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #EEEAD7; /* Light Theme Token */
  }

  .status-subtext {
    font-size: 0.75rem;
    color: #CADABF; /* Accent Dark Token */
    margin: 0;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  /* Micro Flurry Dots */
  .dots-flurry {
    display: inline-flex;
    gap: 3px;
    align-items: center;
  }

  .dot {
    width: 3.5px;
    height: 3.5px;
    border-radius: 50%;
    background-color: #5B913B;
    animation: dot-wave 1.4s infinite ease-in-out both;
  }

  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }
  .dot:nth-child(3) { animation-delay: 0s; }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes core-pulse {
    0% { transform: scale(0.9); opacity: 0.7; }
    100% { transform: scale(1.1); opacity: 1; }
  }

  @keyframes pulse-glow {
    0% { transform: scale(0.9); opacity: 0.3; }
    100% { transform: scale(1.15); opacity: 0.7; }
  }

  @keyframes dot-wave {
    0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
    40% { transform: scale(1.2); opacity: 1; }
  }
</style>