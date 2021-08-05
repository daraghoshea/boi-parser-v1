<template functional>
    <div class="container">
        <div class="backdrop">
            <div class="highlights">
                {{highlighted}}
            </div>
        </div>
        <textarea :value="value"></textarea>
    </div>
</template>

<script>
    export default {
        props: {
            value: String,
            highlight: {
                type: Function,
                default: value => value
            }
        },
        computed: {
            highlighted() {
                return this.highlight(this.value)
            }
        }
    }
</script>