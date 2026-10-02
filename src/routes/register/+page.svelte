<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import Icon from "@iconify/svelte";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";

  let username: string = "";
  let email: string = "";
  let password: string = "";
  let showPassword: boolean = false;
  let termsAccepted: boolean = false;
  let isSubmitting: boolean = false;
  let error: string | null = null;

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

  async function handleRegister() {
    if (!username.trim() || !email.trim() || !password.trim()) {
      error = "Please fill in all fields.";
      return;
    }

    if (!termsAccepted) {
      error = "You must accept the Terms of Service to create an account.";
      return;
    }

    error = null;
    isSubmitting = true;

    // Simulate registration request delay
    setTimeout(() => {
      isSubmitting = false;
      alert("Registration successful!");
    }, 800);
  }
</script>

<svelte:head>
  <title>Register - TV Maze</title>
  <meta
    name="description"
    content="Register for a TV Maze account to bookmark your favorite TV shows, track air dates, and explore curated cast details."
  />
</svelte:head>

<div class="min-h-screen bg-light text-dark flex flex-col selection:bg-primary selection:text-light">
  <HeaderComponent title="Register" />

  <!-- Main Registration Form Container -->
  <main class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
    <div
      class="w-full max-w-md bg-white border border-gray-200/80 rounded-3xl shadow-xl p-8 sm:p-10 space-y-8 backdrop-blur-sm"
      in:fly={{ y: 20, duration: 400 }}
    >
      <!-- Form Header -->
      <div class="text-center space-y-2">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary/15 text-primary mb-2 shadow-inner">
          <Icon icon="mdi:account-plus-outline" class="text-2xl" />
        </div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-dark">
          Create Account
        </h1>
        <p class="text-xs sm:text-sm text-gray-500">
          Join TV Maze to track upcoming premieres, episodes, and cast schedules.
        </p>
      </div>

      <!-- Error Notification Banner -->
      {#if error}
        <div
          class="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium"
          in:fade={{ duration: 200 }}
          role="alert"
        >
          <Icon icon="mdi:alert-circle-outline" class="text-base shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      {/if}

      <!-- Registration Form -->
      <form on:submit|preventDefault={handleRegister} class="space-y-5">
        <!-- Username Field -->
        <div class="space-y-1.5">
          <label for="username" class="block text-xs font-bold uppercase tracking-wider text-gray-700">
            Username
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Icon icon="mdi:account-outline" class="text-lg" />
            </div>
            <input
              type="text"
              id="username"
              bind:value={username}
              class="w-full bg-gray-50/70 border border-gray-300 text-dark placeholder-gray-400 text-sm rounded-xl pl-10 pr-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="johndoe"
              autocomplete="username"
              required
            />
          </div>
        </div>

        <!-- Email Field -->
        <div class="space-y-1.5">
          <label for="email" class="block text-xs font-bold uppercase tracking-wider text-gray-700">
            Email Address
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Icon icon="mdi:email-outline" class="text-lg" />
            </div>
            <input
              type="email"
              id="email"
              bind:value={email}
              class="w-full bg-gray-50/70 border border-gray-300 text-dark placeholder-gray-400 text-sm rounded-xl pl-10 pr-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="you@example.com"
              autocomplete="email"
              required
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="space-y-1.5">
          <label for="password" class="block text-xs font-bold uppercase tracking-wider text-gray-700">
            Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Icon icon="mdi:lock-outline" class="text-lg" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              bind:value={password}
              class="w-full bg-gray-50/70 border border-gray-300 text-dark placeholder-gray-400 text-sm rounded-xl pl-10 pr-11 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="••••••••"
              autocomplete="new-password"
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              on:click={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"} class="text-lg" />
            </button>
          </div>
        </div>

        <!-- Terms Agreement Checkbox -->
        <div class="flex items-start">
          <label class="flex items-start gap-2.5 cursor-pointer select-none text-xs text-gray-600">
            <input
              type="checkbox"
              bind:checked={termsAccepted}
              class="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary/30 focus:ring-offset-0 shrink-0"
              required
            />
            <span>
              I agree to the <a href="/terms" class="text-primary hover:text-secondary underline">Terms of Service</a> and <a href="/privacy" class="text-primary hover:text-secondary underline">Privacy Policy</a>.
            </span>
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={isSubmitting}
          class="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark active:bg-secondary text-light font-bold text-sm py-3.5 px-5 rounded-xl shadow-lg shadow-primary/25 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {#if isSubmitting}
            <Icon icon="mdi:loading" class="animate-spin text-lg" />
            <span>Creating account...</span>
          {:else}
            <span>Create Account</span>
            <Icon icon="mdi:arrow-right" class="text-base" />
          {/if}
        </button>
      </form>

      <!-- Existing Account Footer Link -->
      <div class="text-center pt-2 border-t border-gray-100">
        <p class="text-xs text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            class="font-bold text-primary hover:text-secondary underline underline-offset-2 transition-colors"
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  </main>

  <FooterComponent />
</div>