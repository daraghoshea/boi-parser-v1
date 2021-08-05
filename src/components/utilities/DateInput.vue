<script>
    import flatpickr from 'flatpickr'
    export default {
        props: ['options'],
        data() {
            return {
                input: null,
                flatpickr: null
            }
        },
        mounted() {
            this.findInput();
            this.initFlatpickr();
        },
        destroyed() {
            this.destroyFlatpickr();
        },
        methods: {
            findInput() {
                if( ! this.$el || this.$el.tagName.toUpperCase() !== "INPUT" ) {
                    throw new Error('The Date Input component should directly wrap a single input');
                }
                this.input = this.$el;
            },
            initFlatpickr() {
                const options = {...this.options};

                // Add listeners
                const hooks = ['onOpen', 'onClose', 'onChange', 'onMonthChange', 'onYearChange', 'onReady', 'onValueUpdate', 'onDayCreate'];

                hooks.forEach( hook => {
                    options[hook] = (...values) => {
                        this.$emit(hook, ...values);
                    }
                });

                this._fp = flatpickr(this.input, options)
            },
            destroyFlatpickr() {
                this._fp && this._fp.destroy();
            }
        },
        render() {
            return this.$scopedSlots.default({
                calendar: this._fp
            });
        }
    }
</script>