<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import Icon from "@iconify/svelte";
</script>

<svelte:head>
  <title>Docs - Softgenie Studio Photo Suite</title>
</svelte:head>

<div
  class="min-h-screen bg-light dark:bg-dark dark:text-light text-dark flex flex-col selection:bg-primary selection:text-light font-sans overflow-x-hidden"
>
  <HeaderComponent title="Softgenie Studio" />

  <!-- Hero Section -->
  <section
    class="relative bg-cover bg-center min-h-[320px] sm:min-h-[400px] flex items-center justify-center overflow-hidden border-b border-secondary/20"
    style="background-image: url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1600&auto=format&fit=crop');"
  >
    <div
      class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90 pointer-events-none"
    />
    <div
      class="relative z-10 max-w-4xl mx-auto text-center px-4 py-16 text-light space-y-4"
    >
      <h1
        class="text-3xl sm:text-5xl font-black tracking-tight text-white min-h-[2.5rem]"
        in:fly={{ y: 25, duration: 400 }}
      >
        Softgenie Studio Suite Documentation
      </h1>
      <p
        class="text-sm sm:text-base text-light/85 max-w-2xl mx-auto leading-relaxed"
        in:fly={{ y: 20, duration: 400, delay: 100 }}
      >
        Comprehensive documentation for Softgenie Studio Suite, guiding you
        through its powerful features, workstation modules, and best practices
        for maximizing your creative workflow.
      </p>
    </div>
  </section>

  <!-- Main Content Container -->
  <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-12 space-y-16">
    <!-- Vision & Philosophy -->
    <div
      class="grid grid-cols-1 gap-8 items-center"
      in:fly={{ y: 30, duration: 500, delay: 200 }}
    >
      <div class="space-y-4">
        <span
          class="text-xs font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full dark:bg-light"
          >Origin Story</span
        >
        <h2
          class="text-2xl sm:text-3xl font-black tracking-tight text-dark dark:text-light"
        >
          Why I built Softgenie Studio Suite Photo Editor?
        </h2>
        <p
          class="text-sm sm:text-base text-gray-600 dark:text-light leading-relaxed"
        >
          As a part-time artist, I found some of the very basic features like
          splitting an image into grid was very cumbersome and time-consuming in
          existing software. I used to use a mobile app for this basic feature
          which had a lot of advertisements. I built Softgenie Studio Suite
          Photo Editor to streamline these tasks and provide a more efficient,
          browser-based creative workflow.
        </p>
        <p class="text-gray-600 dark:text-light leading-relaxed">
          While initially the idea was just to limit this application to basic
          grid and editing features only, it has gradually evolved into a
          comprehensive photo editing suite with a variety of creative tools and
          workstation modules. I'd try to guide you through various features
          this web-based image editor has through illustrations and screenshots
          in this documentation. I'm also working on a pdf documentation of this
          application. This application can be broadly divided into four modules
          as you might see at the top as tabs.
        </p>
      </div>
    </div>

    <!-- Core Feature Highlights Grid -->
    <div class="space-y-6">
      <div
        class="text-center max-w-2xl mx-auto space-y-2"
        in:fly={{ y: 25, duration: 400, delay: 300 }}
      >
        <span
          class="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:bg-light rounded-2xl p-2"
          >Workstation Modules</span
        >
        <h2
          class="text-2xl sm:text-3xl font-black text-dark dark:text-light mt-2"
        >
          Engineered for Creative Excellence
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Feature 1 -->
        <div
          class="bg-white dark:bg-secondary p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3"
          in:fly={{ y: 30, duration: 400, delay: 400 }}
        >
          <div
            class="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-white flex items-center justify-center text-xl"
          >
            <Icon icon="mdi:grid" />
          </div>
          <h3 class="font-bold text-xl text-dark dark:text-light">
            Artist Grid & Line Studio
          </h3>
          <p class="text-gray-600 dark:text-light leading-relaxed">
            Configure rows, columns, coordinate labels (A1, B2), Rule of Thirds,
            center diagonals, custom perspective lines, and split tiles for
            large-scale canvas transfers.
          </p>
        </div>

        <!-- Feature 2 -->
        <div
          class="bg-white dark:bg-secondary p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3"
          in:fly={{ y: 30, duration: 400, delay: 500 }}
        >
          <div
            class="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-white flex items-center justify-center text-xl"
          >
            <Icon icon="mdi:brain" />
          </div>
          <h3 class="font-bold text-dark dark:text-light text-xl">
            TensorFlow.js Studio
          </h3>
          <p class="text-gray-600 leading-relaxed dark:text-light">
            Leverage WebGL matrix kernels, Sobel edge detectors, Laplacian
            embossing, and neural color mapping to turn photos into precise
            sketches or cinematic masterpieces.
          </p>
        </div>

        <!-- Feature 3 -->
        <div
          class="bg-white dark:bg-secondary p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3"
          in:fly={{ y: 30, duration: 400, delay: 600 }}
        >
          <div
            class="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-white flex items-center justify-center text-xl"
          >
            <Icon icon="mdi:palette-advanced" />
          </div>
          <h3 class="font-bold text-xl text-dark dark:text-light">
            300+ Filter & Retouch Library
          </h3>
          <p class="text-gray-600 dark:text-light leading-relaxed">
            Explore vast collections of professional studio grades, film stocks,
            graphite pencils, charcoal shading, and real-time RGB histogram
            tonal analyzers.
          </p>
        </div>
      </div>
    </div>

    <div
      class="grid grid-cols-1 gap-6 bg-white dark:bg-secondary"
      in:fly={{ y: 30, duration: 400, delay: 700 }}
    >
      <div
        class="bg-white dark:bg-secondary p-6 border border-gray-200 shadow-xs space-y-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-white flex items-center justify-center text-xl"
        >
          <Icon icon="mdi:file-multiple" />
        </div>
        <h3 class="font-bold text-xl text-dark dark:text-light">
          File Bulk Process Features
        </h3>
        <p class="text-gray-600 dark:text-light leading-relaxed">
          Bulk process features include conversion of file formats, resizing,
          renaming, and applying filters to multiple files simultaneously.
        </p>
      </div>
    </div>

    <div
      class="dark:bg-gray-900 bg-white dark:text-light text-dark p-6 sm:p-12 rounded-3xl shadow-md space-y-6 overflow-hidden"
      in:fly={{ y: 30, duration: 400, delay: 800 }}
    >
      <h3 class="text-xl sm:text-2xl font-bold">Documentation Illustration</h3>
      <p class="dark:text-light text-dark leading-relaxed">
        For demonstration purposes, this image of Goku from Dragonball Z would
        be used.
      </p>
      <img src="/docs/test.jpg" alt="Documentation illustration" class="w-full h-auto object-contain rounded-xl shadow-md my-3 mx-auto max-w-4xl" />
    </div>

    <!-- Technology Stack Callouts (Modules 1 to 4) -->
    <div
      class="dark:bg-gray-900 bg-white dark:text-light text-dark p-6 sm:p-12 rounded-3xl shadow-md space-y-6 overflow-hidden"
      in:fly={{ y: 30, duration: 400, delay: 900 }}
    >
      <div class="space-y-2">
        <span
          class="text-xs font-mono text-success font-bold uppercase tracking-wider"
          >Module - 1</span
        >
        <h3 class="text-xl sm:text-2xl font-bold">Grid Lines and Tiling</h3>
        <p class="leading-relaxed">
          This is the first module of this application. Major features included
          in this module include grid lines, straight lines, cropping image,
          tiling, adjusting brightness and contrast. For this documentation I'd
          only focus on tiling and grid features as they were one of the most
          relevant features which inspired me to develop this in the first
          place.
        </p>

        <p class="leading-relaxed">
          Grid method is one of the most popular methods artists use to maintain
          proper proportions and alignment in their artwork. It helps in
          breaking down complex compositions into manageable sections, ensuring
          accuracy and consistency throughout the creative process. In this
          module, the grid feature allows users to overlay a customizable grid
          on their canvas, making it easier to align elements and maintain
          consistent proportions. You have the option to choose the number of
          rows and columns for the grid, allowing for precise control over the
          layout and alignment of elements on the canvas.
        </p>

        <h4 class="text-lg sm:text-xl font-bold pt-2">Tiling Feature</h4>
        <p class="leading-relaxed">
          The tiling feature allows users to split the image into equal tiles
          which can later be individually edited and saved. You can also use
          this zoom in and save feature to focus on specific areas of the image
          for detailed editing. In the illustration below, we have cut the image
          into four tiles.
        </p>

        <img
          class="w-full h-auto object-contain rounded-xl shadow-md max-w-4xl my-3 mx-auto"
          src="/docs/1.jpg"
          alt="Documentation illustration"
        />

        <p class="leading-relaxed">
          We would use the bottom right tile which has face of Goku for detailed
          editing in subsequent examples. The example image below shows this
          tiled image being used in advanced filtering section to apply advanced
          tensorflow image effects on this.
        </p>

        <img
          class="w-full h-auto object-contain rounded-xl shadow-md max-w-4xl my-3 mx-auto"
          src="/docs/10.jpg"
          alt="Documentation illustration"
        />

        <p class="leading-relaxed">
          Below image shows selection of an individual tile for detailed
          editing. You could also save it as it is, or tweak certain parameters
          in-place like brightness and contrast for immediate visual feedback.
        </p>

        <img
          class="w-full h-auto object-contain rounded-xl shadow-md max-w-4xl my-3 mx-auto"
          src="/docs/2.jpg"
          alt="Documentation illustration"
        />

        <p class="leading-relaxed">
          Some other trivial features of this module include the following. As
          most editors would have them by default, I decided to skip them for
          detailed explanation here.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div
            class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1"
          >
            <span class="text-success font-bold block">Cropping</span>
            <p class="text-light text-sm">
              Cropping an image is available in various shapes including
              freeform.
            </p>
          </div>
          <div
            class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1"
          >
            <span class="text-success font-bold block">Grid Lines</span>
            <p class="text-light text-sm">
              Save image as solid or dashed grid lines, very useful for artists
              in determining proportions and alignment.
            </p>
          </div>
          <div
            class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1"
          >
            <span class="text-success font-bold block">Pan and Zoom</span>
            <p class="text-light text-sm">
              Pan and zoom functionality for detailed image editing. You can
              also save the zoomed in area of the image.
            </p>
          </div>
          <div
            class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1"
          >
            <span class="text-success font-bold block">Adjust parameters</span>
            <p class="text-light text-sm">
              Adjust various image parameters such as brightness, contrast, and
              saturation for fine-tuned editing.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="dark:bg-gray-900 dark:text-light bg-white text-dark p-6 sm:p-12 rounded-3xl shadow-md space-y-6 overflow-hidden"
      in:fly={{ y: 30, duration: 400, delay: 1000 }}
    >
      <div class="space-y-2">
        <span class="font-mono text-success font-bold uppercase tracking-wider"
          >Module - 2</span
        >
        <h3 class="text-xl sm:text-2xl font-bold">Tensor Studio</h3>
      </div>

      <p class="leading-relaxed">
        This module includes features like eye-dropper tool, can extract top
        colors from the image, it has options to tweak certain properties of
        image like brightness, contrast, saturation, and hue. RGB values of the
        image can also be changed through sliders. You can also get description
        of the image using the AI-powered describe image feature. Though, we
        have a separate module for advanced filters, this does have some filters
        as well and view modes powered by AI.
      </p>

      <p class="leading-relaxed">
        Below image shows green channel effects applied on the individual image
        tile which I selected earlier from a Goku image.
      </p>

      <img
        class="w-full h-auto object-contain rounded-xl shadow-md max-w-4xl my-3 mx-auto"
        src="/docs/3.jpg"
        alt="Documentation illustration"
      />

      <p class="leading-relaxed">
        This uses pencil portrait effect powered by AI. You can create some cool
        illustrations by tweaking RGB values and other image parameters on top
        of pencil portrait effect.
      </p>

      <img
        class="w-full h-auto object-contain rounded-xl shadow-md max-w-4xl my-3 mx-auto"
        src="/docs/4.jpg"
        alt="Documentation illustration"
      />

      <p class="leading-relaxed">
        This illustration shows another effect applied called "Soft Graphite"
        from tensorflow. As mentioned earlier, you could combine other effects
        with this to create unique and customized image styles.
      </p>

      <img
        class="w-full h-auto object-contain rounded-xl shadow-md max-w-4xl my-3 mx-auto"
        src="/docs/5.jpg"
        alt="Documentation illustration"
      />

      <p class="leading-relaxed">
        We can see the edited image preview in a modal when clicking on the
        preview button as displayed in the illustration below.
      </p>

      <img
        class="w-full h-auto object-contain rounded-xl shadow-md max-w-4xl my-3 mx-auto"
        src="/docs/6.jpg"
        alt="Documentation illustration"
      />

      <p class="leading-relaxed">
        In the image below, we show the use of describe image button which on
        click would call for AI to generate a description of the image based on
        what objects it can detect in the image.
      </p>

      <img
        class="w-full h-auto object-contain rounded-xl shadow-md max-w-4xl my-3 mx-auto"
        src="/docs/7.jpg"
        alt="Documentation illustration"
      />

      <p class="leading-relaxed">
        Below is the summary of some of the lesser discussed features in this
        module.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        <div
          class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1"
        >
          <span class="text-success font-bold block">Eye Dropper</span>
          <p class="text-light text-sm">
            The eye dropper tool allows you to pick colors directly from the
            image for precise color adjustments.
          </p>
        </div>
        <div
          class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1"
        >
          <span class="text-success font-bold block">Top Image Colors</span>
          <p class="text-light text-sm">
            Displays the most prominent colors in the image, helping artists and
            designers quickly identify the color palette precisely.
          </p>
        </div>
        <div
          class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1"
        >
          <span class="text-success font-bold block">RGB Channel Mixer</span>
          <p class="text-light text-sm">
            Mix and adjust the red, green, and blue channels of the image to
            achieve desired color effects.
          </p>
        </div>
        <div
          class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1"
        >
          <span class="text-success font-bold block">Blend Intensity</span>
          <p class="text-light text-sm">
            Control the intensity of blending effects applied to the image
            through a slider.
          </p>
        </div>
      </div>
    </div>

    <div
      class="dark:bg-gray-900 bg-white text-dark dark:text-light p-6 sm:p-12 rounded-3xl shadow-md space-y-6 overflow-hidden"
      in:fly={{ y: 30, duration: 400, delay: 1100 }}
    >
      <div class="space-y-2">
        <span class="font-mono text-success font-bold uppercase tracking-wider"
          >Module - 3</span
        >
        <h3 class="text-xl sm:text-2xl font-bold">Filter Library</h3>
        <p class="leading-relaxed">
          Explore a wide range of filters to enhance your images with artistic
          and aesthetic effects. It has a total of around 400+ filters which can
          be applied to images for creative and professional results. It
          includes artistic filters, vibe filters, and various other effect
          categories. Behind the scenes AI using Tensorflow and HTML canvas is
          applied to efficiently process and enhance images with these filters.
        </p>

        <p class="leading-relaxed">
          Below is an illustration which shows one of the tensorflow-based
          artistic filters in action.
        </p>

        <img
          class="w-full h-auto object-contain rounded-xl shadow-md max-w-4xl my-3 mx-auto"
          src="/docs/10.jpg"
          alt="Tensorflow illustration"
        />

        <p class="leading-relaxed">
          As you might have already noticed, it has text edit features which
          allows you to add multiple text boxes in an image with effects like
          font customization, color adjustments, and various text effects. You
          can also add shadows, outlines, and other stylistic enhancements to
          your text boxes.
        </p>
      </div>

      <img
        class="w-full h-auto object-contain rounded-xl shadow-md max-w-4xl my-3 mx-auto"
        src="/docs/8.jpg"
        alt="Text edit illustration"
      />

      <p class="leading-relaxed">
        Using the preview feature, you can see side-by-side comparisons of your
        edits in real-time, allowing you to make precise adjustments and ensure
        the final image meets your expectations.
      </p>

      <img
        class="w-full h-auto object-contain rounded-xl shadow-md max-w-4xl my-3 mx-auto"
        src="/docs/9.jpg"
        alt="Preview feature illustration"
      />

      <p class="leading-relaxed">
        There is also this cool feature called vibe filtering which allows you
        to enter some vibe text and submit. The system will then perform a text
        matching analysis using sentence transformers behind the scenes to apply
        appropriate vibe filters to your image. It does so by performing a text
        search on existing filters and returning the top five closest matches.
        It automatically applies the one which matched the most, but with the
        choices it gives you, you can manually select the one that best fits
        your desired vibe.
      </p>

      <img
        class="w-full h-auto object-contain rounded-xl shadow-md max-w-4xl my-3 mx-auto"
        src="/docs/11.jpg"
        alt="Vibe filtering illustration"
      />

      <p class="leading-relaxed">
        Though this vibe filter feature is not working properly and probably
        would not be able to select from all the filters available in this
        application. It is recommended to use it with caution and not rely
        solely on it for critical edits. It is still under development.
      </p>

      <p class="leading-relaxed">
        Below is the summary of some of the features discussed in this module.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        <div
          class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1"
        >
          <span class="text-success font-bold block">Text Editor</span>
          <p class="text-light text-sm">
            Text edit tool allows you to add multiple text to images with some
            cool effects such as shadows, inner, outer glows, outlines and
            strokes. You can also apply blending modes to the text for creative
            effects.
          </p>
        </div>
        <div
          class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1"
        >
          <span class="text-success font-bold block">AI and Canvas Filters</span>
          <p class="text-light text-sm">
            Provides a wide range of AI-powered and canvas-based filters for
            enhancing and manipulating images.
          </p>
        </div>
        <div
          class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1"
        >
          <span class="text-success font-bold block"
            >Multi-format Export And Compression</span
          >
          <p class="text-light text-sm">
            Allows exporting images in multiple formats such as PNG, JPEG, PDF
            and WebP for versatile usage. Also provides compression options to
            reduce file size while maintaining quality.
          </p>
        </div>
        <div
          class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1"
        >
          <span class="text-success font-bold block">Histogram Analysis</span>
          <p class="text-light text-sm">
            Provides a visual representation of the tonal distribution in the
            image, helping to analyze exposure and contrast. Also, has options
            to tweak parameters like brightness, contrast, hue, blur radius and
            saturation.
          </p>
        </div>
      </div>
    </div>

    <div
      class="dark:bg-gray-900 dark:text-white bg-white text-dark p-6 sm:p-12 rounded-3xl shadow-md space-y-6 overflow-hidden"
      in:fly={{ y: 30, duration: 400, delay: 1200 }}
    >
      <div class="space-y-2">
        <span class="font-mono text-success font-bold uppercase tracking-wider"
          >Module - 4</span
        >
        <h3 class="text-xl sm:text-2xl font-bold">Bulk File Features</h3>
        <p class="leading-relaxed">
          You can work with multiple files simultaneously, applying edits,
          filters, and adjustments in bulk to streamline your workflow. This
          provides a compression tool alongwith file format conversion options.
          You can also club multiple images into a single pdf document. This is
          one of the features which I use a lot in my workflow.
        </p>

        <img
          class="w-full h-auto object-contain rounded-xl shadow-md max-w-4xl my-3 mx-auto"
          src="/docs/12.jpg"
          alt="Bulk edit illustration"
        />

        <p class="leading-relaxed">
          In the illustration above, you can see how multiple files are being
          managed and edited in bulk, showcasing the efficiency of the bulk file
          features. You can crop multiple images to a specific dimension
          simultaneously, saving time and ensuring consistency across your
          files.
        </p>

        <p class="leading-relaxed">
          App gives you option to apply watermark text to multiple images at
          once, apply random filters or same filter to all selected images. It
          also has option to create beautiful collages from multiple images.
        </p>
      </div>

      <div class="grid grid-cols-1 dark:text-light sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        <div
          class="dark:bg-gray-800/80 bg-light p-4 rounded-xl border border-gray-700/60 space-y-1"
        >
          <span class="text-success font-bold block">Watermark</span>
          <p class="text-sm">
            Watermark tool allows you to add multiple watermarks to your images
            at once.
          </p>
        </div>
        <div
          class="dark:bg-gray-800/80 bg-light p-4 rounded-xl border border-gray-700/60 space-y-1"
        >
          <span class="text-success font-bold block">Bulk file conversion</span>
          <p class="text-sm">
            Allows you to convert multiple files to different formats in bulk
            and compress, saving time and effort.
          </p>
        </div>
        <div
          class="dark:bg-gray-800/80 bg-light p-4 rounded-xl border border-gray-700/60 space-y-1"
        >
          <span class="text-success font-bold block">Frames</span>
          <p class="text-sm">
            Allows you to add frames to multiple images at once. There are
            multiple in-built frame styles to choose from.
          </p>
        </div>
        <div
          class="dark:bg-gray-800/80 bg-light p-4 rounded-xl border border-gray-700/60 space-y-1"
        >
          <span class="text-success font-bold block">Collage Maker</span>
          <p class="text-sm">
            Allows you to create collages from multiple images. You can choose
            from various templates and customize the layout, spacing, and
            background to create visually appealing collages.
          </p>
        </div>
      </div>
    </div>
  </main>

  <FooterComponent />
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>