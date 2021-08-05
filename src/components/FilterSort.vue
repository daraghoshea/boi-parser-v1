<template>
    <div class="inline-flex">
        <span v-if="label" class="mr-2">{{label}}</span>
        <div class="inline-flex flex-col leading-none">
            <button type="button"
                    @click="update( asc )"
                    class="mb-1"
                    :class="classes( asc )">
                <svg class="h-full w-auto" width="14" height="8" viewBox="0 0 14 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.29289 0.292893C6.68342 -0.0976311 7.31658 -0.0976311 7.70711 0.292893L13.7071 6.29289C14.0976 6.68342 14.0976 7.31658 13.7071 7.70711C13.3166 8.09763 12.6834 8.09763 12.2929 7.70711L7 2.41421L1.70711 7.70711C1.31658 8.09763 0.683417 8.09763 0.292893 7.70711C-0.0976311 7.31658 -0.0976311 6.68342 0.292893 6.29289L6.29289 0.292893Z" />
                </svg>
            </button>

            <button type="button"
                    @click="update( desc )"
                    :class="classes( desc )">
                <svg class="h-full w-auto" width="14" height="8" viewBox="0 0 14 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L7 5.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L7.70711 7.70711C7.31658 8.09763 6.68342 8.09763 6.29289 7.70711L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z" />
                </svg>
            </button>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            label: String,
            value: String,
            size: {
                type: Number,
                default: 4
            },
            asc: {
                type: String,
                default: 'asc'
            },
            desc: {
                type: String,
                default: 'desc'
            }
        },
        watch: {
            value(n) {
                this.current = n;
            }
        },
        computed: {
            classes() {
                return (type) => {
                    const classes = [`h-${this.size/2} text-gray-600 hover:text-teal-500`];
                    type === this.current
                        ? classes.push(`text-teal-500`)
                        : '';
                    return classes.join(' ');
                }
            }
        },
        data() {
            return {
                current: this.value
            }
        },
        methods: {
            update(value) {
                const deselecting = this.current === value;
                this.current = deselecting ? null : value;
                this.$emit('input', this.current);
            }
        },
    }
</script>