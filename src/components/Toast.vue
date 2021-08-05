<template>
    <div :class="classes">
        <slot v-if="show">
            <div class="bg-teal-900 text-white p-6">
                {{text}}
            </div>
        </slot>
    </div>
</template>
<script>
    export default {
        props: {
            text: {
                type: String,
                default: ""
            },
            duration: {
                type: Number,
                default: 5000
            },
            classes: {
                type: String,
                default: "absolute bottom-0 right-0"
            }
        },
        data() {
            return {
                show: true,
                timeout: null
            }
        },
        mounted() {
            this.timeout = setTimeout(() => {
                this.show = false
                this.$emit('hidden')
            }, this.duration)
        },
        destroyed() {
            this.timeout && clearTimeout(this.timeout)
        }
    }
</script>