<script lang="ts" context="module">
    import type { LoadOutput } from "@sveltejs/kit";

    export async function load(): Promise<LoadOutput> {
        return {
            status: 302,
            redirect: "/r/kemonomimi",
        };
    }
</script>
