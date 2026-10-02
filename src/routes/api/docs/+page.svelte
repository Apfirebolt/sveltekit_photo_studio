<script lang="ts">
  import { onMount } from 'svelte';
  import 'swagger-ui-dist/swagger-ui.css';

  onMount(async () => {
    // Import both the bundle constructor and standalone preset
    const { SwaggerUIBundle, SwaggerUIStandalonePreset } = await import('swagger-ui-dist');

    SwaggerUIBundle({
      url: '/api/docs/spec',
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      layout: 'StandaloneLayout'
    });
  });
</script>

<svelte:head>
  <title>API Documentation | SvelteKit Movies</title>
</svelte:head>

<div class="swagger-container min-h-screen bg-white">
  <div id="swagger-ui"></div>
</div>

<style>
  :global(.swagger-ui .topbar) {
    display: none;
  }
</style>