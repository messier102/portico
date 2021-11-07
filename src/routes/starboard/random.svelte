<script lang="ts" context="module">
    import { LoadOutput } from "@sveltejs/kit";

    export async function load(): Promise<LoadOutput> {
        const minTimestamp = 1593860599394; // first item on the starboard
        const maxTimestamp = Date.now();
        const range = maxTimestamp - minTimestamp;

        const randomTimestamp = Math.floor(
            minTimestamp + range * Math.random()
        );

        return {
            status: 302,
            redirect: `/starboard?before=${randomTimestamp}`,
        };
    }
</script>
