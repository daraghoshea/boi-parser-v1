<script>
    export default {
        props: {
            open: {
                type: Boolean,
                required: true
            },
            options: {
                type: Object,
                default: () => {
                    return {
                        position: 'left',
                        hideOnClickOutside: true
                    }
                }
            }
        },
        watch: {
            open(value) {
                value ? this.addListener() : this.removeListener();
            }
        },
        data() {
            return {
                listener: null,
                listenerAdded: null
            }
        },
        methods: {
            addListener: function() {
                if( ! this.options.hideOnClickOutside ) {
                    return;
                }

                this.listenerAdded = new Date;

                this.listener = event => {
                    // Clicking to open is causing an immediate close,
                    // this is a terrible hack to work around
                    const tooSoon = (new Date - this.listenerAdded) < 200;

                    if (!tooSoon && !this.$el.contains(event.target) && isVisible(this.$el)) { // or use: event.target.closest(selector) === null
                        this.$emit('close');
                        this.removeListener();
                    }
                };

                // source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
                const isVisible = elem => {
                    return !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length )
                };

                document.addEventListener('click', this.listener)
            },
            removeListener() {
                this.listener && document.removeEventListener('click', this.listener);
                this.listener = null;
                this.listenerAdded = null;
            }
        },
        render: function(create) {
            if (!this.open) {
                return create('');
            }

            return create('div',
                {
                    ref: "container",
                    class: `z-20 origin-top-${this.options.position} absolute ${this.options.position}-0 w-56 rounded-md shadow-lg bg-white w-full`
                },
                [
                    create('div',
                        this.$slots.default
                    )
                ]
            );
        }
    }
</script>