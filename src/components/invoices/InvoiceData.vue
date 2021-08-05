<script>

    import Invoice from "./Invoice";

    export default {
        props: {
            invoice: Object
        },
        watch: {
            invoice: {
                deep: true
            }
        },
        data() {
            return {
                data: null
            }
        },
        created() {
            this.data = new Invoice(this.invoice)
        },
        render() {
            return this.$scopedSlots.default({
                lines: this.data.lines,
                subtotal: this.data.subtotal,
                tax: this.data.tax,
                total: this.data.total
            })
        }
    }
</script>