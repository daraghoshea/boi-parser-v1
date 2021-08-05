<script>
    import {money} from "../../utils/money";
    import {debounce} from 'lodash'

    export default {
        props: ['line'],
        data() {
            return {
                price: this.line.price,
                quantity: this.line.quantity,
                tax: this.line.tax
            }
        },
        computed: {
            sanitizedPrice() {
                return money(this.price)
            },
            sanitizedQuantity() {
                return Number.parseInt(this.quantity) || 0
            },
            sanitizedTax() {
                return Number.parseFloat(this.tax).toFixed(1)
            },
            nett() {
                return this.sanitizedPrice.multiply(
                    this.sanitizedQuantity
                )
            },
            taxAmount() {
                return this.nett.multiply(
                    Number.parseInt(this.tax)
                ).divide(100);
            },
            subtotal() {
                return this.nett.add( this.taxAmount );
            },
        },
        methods: {
            setQuantity(val) {
                this.quantity = val;
                this.$emit('quantity', this.sanitizedQuantity)
            },
            setPrice(value) {
                this.price = value
                this.$emit('price', this.sanitizedPrice.toJSON())
            },
            setTax(value) {
                this.tax = value
                this.$emit('tax', this.sanitizedTax)
            },
        },
        render() {
            return this.$scopedSlots.default({
                nett: this.nett.toJSON(),
                tax: this.taxAmount.toJSON(),
                subtotal: this.subtotal.toJSON(),
                price: this.sanitizedPrice.toJSON(),
                quantity: this.sanitizedQuantity,
                setQuantity: debounce(this.setQuantity, 50),
                setPrice: debounce(this.setPrice, 50),
                setTax: debounce(this.setTax, 50),
            });
        }
    }
</script>