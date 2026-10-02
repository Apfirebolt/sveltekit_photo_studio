<main class="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-16 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <div class="mx-auto flex max-w-lg flex-col items-center justify-center text-center">
        <!-- Error Code with subtle glowing/accent effect -->
        <h1 class="font-extrabold tracking-tight text-8xl sm:text-9xl text-violet-600 dark:text-violet-500 selection:bg-violet-600 selection:text-white">
            <span class="sr-only">Error </span>404
        </h1>

        <!-- Primary Heading -->
        <h2 class="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
            Sorry, we couldn't find this page.
        </h2>

        <!-- Descriptive Subtext -->
        <p class="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-400">
            But don't worry, you can find plenty of other things on our homepage.
        </p>

        <!-- Actions -->
        <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <a
                href="/"
                class="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-violet-500 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:scale-95"
            >
                Back to homepage
            </a>
            <button
                type="button"
				on:click={() => history.back()}
                class="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all duration-150 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 active:scale-95"
            >
                Go back
            </button>
        </div>
    </div>
</main>

