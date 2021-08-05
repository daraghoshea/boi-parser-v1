<script>
    export default {
        data() {
            return {
                checking: false
            }
        },
        methods: {
            check() {
                this.checking = true
                this.$emit('checking')
            },
            cancel() {
                this.checking = false;
                this.$emit('cancelled')
            },
            confirm() {
                this.checking = false;
                this.$emit('confirm');
            }
        },
        render() {
            return this.$scopedSlots.default({
                checking: this.checking,
                check: this.check,
                cancel: this.cancel,
                confirm: this.confirm
            });
        }
    }
</script>