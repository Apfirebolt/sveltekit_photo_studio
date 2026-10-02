<script lang="ts">
  import { fade } from "svelte/transition";

  export let text: string = "Loading Content";
  export let subtext: string = "Fetching data from TV Maze";
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
    <!-- Concentric Dual-Ring Spinner -->
    <div class="spinner-assembly">
      <div class="spinner-track" />
      <div class="spinner-glow" />
      <div class="spinner-pulse" />
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
    background: radial-gradient(circle at 50% 40%, rgba(15, 23, 42, 0.78) 0%, rgba(2, 6, 23, 0.94) 100%);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    overflow: hidden;
  }

  .glow-orb {
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(20, 184, 166, 0.22) 0%, rgba(99, 102, 241, 0.12) 50%, transparent 70%);
    filter: blur(48px);
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
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  /* Spinner Assembly */
  .spinner-assembly {
    position: relative;
    width: 62px;
    height: 62px;
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
    border-top-color: #14b8a6; /* Bermudan / Teal theme accent */
    border-right-color: #6366f1; /* Indigo theme accent */
    animation: spin 0.85s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
  }

  .spinner-pulse {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #14b8a6;
    box-shadow: 0 0 14px rgba(20, 184, 166, 0.9);
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
    color: #f8fafc;
  }

  .status-subtext {
    font-size: 0.75rem;
    color: #94a3b8;
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
    background-color: #14b8a6;
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
    0% { transform: scale(0.75); opacity: 0.5; }
    100% { transform: scale(1.15); opacity: 1; }
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