<script>
    import {mapGetters} from 'vuex'

    export default {
        props: {
            delay: {
                type: Number,
                default: 200
            },
            excludeIds: {
                type: Array,
                default: () => []
            }
        },
        computed: {
            ...mapGetters({
                getContacts: 'contacts/GET',
            }),
            isDropdownOpen() {
                return this.text.length || this.editing;
            },
            results() {
                return this.getContacts({ search: this.text, exclude: this.excludeIds}).slice(0,10)
            }
        },
        data() {
            return {
                contact: null,
                text: "",
                timeout: null,
                editing: false,
                highlighted: 0,
                selected: []
            }
        },
        methods: {
            select(contact) {
                this.$emit('select', contact)
            },
            setText(val) {
                this.text = val;
                this.editing = true;
            },
            onFocus() {
                this.editing = true;
                this.timeout && clearTimeout(this.timeout);
                this.highlighted = Math.min(this.highlighted, this.results.length );
            },
            onBlur() {
                this.timeout = window.setTimeout(() => {
                    this.editing = false;
                }, 300)
            },
            onUpArrow() {
                this.highlighted += (this.highlighted > 0) ? -1 : 0;
            },
            onDownArrow() {
                this.highlighted += (this.highlighted >= this.results.length) ? 0 : 1;
            },
            onEnterBtn() {
                const contact = this.results[this.highlighted];
                contact && this.select( contact )
            },
            onEscBtn() {
                this.editing = false;
            },

            // TODO
            onCreate() {
                const _this = this;
                this.create({
                    name: this.text
                }).then(() => {
                    const category = _this.categoryFindByName(_this.text);
                    _this.onSelect(category.id);
                })
            },
        },
        render() {
            return this.$scopedSlots.default({
                isDropdownOpen: this.isDropdownOpen,
                results: this.results,
                highlighted: this.highlighted,
                select: this.select,

                onEscBtn: this.onEscBtn,
                onEnterBtn: this.onEnterBtn,
                onUpArrow: this.onUpArrow,
                onDownArrow: this.onDownArrow,
                onFocus: this.onFocus,
                onBlur: this.onBlur,
                setText: this.setText
            })
        }
    }
</script>