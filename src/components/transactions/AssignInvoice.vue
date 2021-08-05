<template>
    <div class="invoice-container relative">

        <input
               type="text"
               ref="input"
               @keyup.esc="editing=false"
               @keyup.up="highlightPrev"
               @keyup.down="highlightNext"
               @keyup.enter="highlightSelect"
               @keydown.tab="highlightSelect"
               @focus="edit"
               @blur="end"
               @click.stop="()=>{}"
               v-model.trim="text"
               placeholder="Select invoice.."
               class="bg-transparent font-gray-700 italic pb-1 mb-1 w-full outline-none border-b-2 border-transparent transition-all duration-700 ease-linear focus:border-teal-500"
        />

        <transition name="slide-down">
            <dropdown :open="isDropdownOpen">
                <ul class="invoice-dropdown-list">
                    <li v-for="(inv, index) in filteredOptions" :key="inv.id" @click="onSelect(inv.id)" class="" :class="{highlighted: index === highlighted}">
                        <div class="flex items-center font-number">
                            {{padStart(inv.data.number,4,'0')}} <span class="text-gray-800 ml-auto">{{formatMoney(inv.totals.total)}}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="truncated"></span>
                        </div>
                    </li>
                </ul>
            </dropdown>
        </transition>
    </div>

</template>
<script>
    import {mapActions, mapGetters} from 'vuex'
    import Dropdown from "../utilities/Dropdown";
    import {padStart} from "lodash";
    import InvoicesCollection from "../invoices/InvoicesCollection";

    export default {
        components: {Dropdown},
        props: {
            transaction: {
                type: Object,
                required: true
            }
        },
        computed: {
            ...mapGetters({
                findTransaction: 'transactions/FIND_BY_ID',
                findInvoices: 'invoices/FIND_BY_IDS',
                getInvoices: 'invoices/GET',
                getContactsByIds: 'contacts/FIND_BY_IDS'
            }),
            isDropdownOpen() {
                return this.editing;
            },
            invoiceOptions() {
                const collection = this.getInvoices({
                    orderBy: 'date',
                    order: 'desc',
                    contact: this.transaction.data.contact
                });
                debugger // eslint-disable-line
                return (new InvoicesCollection(collection.items))
                    .loadContactsUsing(this.getContactsByIds)
                    .toJson();
            },
            filteredOptions() {
                if( ! this.text.length ) {
                    return this.invoiceOptions.items;
                }

                return this.invoiceOptions.items.filter( inv => {
                    let regex = new RegExp(this.text, 'gi');
                    return (inv.data.number + "").match(regex);
                });
            }
        },
        data() {
            return {
                invoices: {},
                text: "",
                timeout: null,
                focusInput: false,
                editing: false,
                highlighted: 0
            }
        },
        watch: {
            transaction: {
                deep: true,
                handler(value) {
                    this.fetchInvoices(value.invoices)
                }
            }
        },
        mounted() {
            this.fetchInvoices(this.transaction.invoices);
        },
        updated() {
            if( this.focusInput ) {
                this.$refs.input && this.$refs.input.focus()
                this.focusInput = false;
            }
        },
        methods: {
            ...mapActions({
                allocate: 'transactions/ALLOCATE',
            }),
            padStart,
            fetchInvoices(invoices) {
                if( ! invoices || ! invoices.length ) {
                    this.invoices = {};
                    return;
                }
                this.invoices = this.findInvoices(invoices.map(i => i.id));
            },
            edit() {
                this.editing = true;
                this.timeout && clearTimeout(this.timeout);
                this.highlighted = Math.min(this.highlighted, this.filteredCategories.length );
                this.focusInput = true;
            },
            end() {
                this.timeout = window.setTimeout(() => {
                    this.editing = false;
                }, 2000)
            },
            onSelect(invoiceId) {
                alert(`selected ${invoiceId}`);
                // this.select({
                //     id: this.transaction.id,
                //     category: categoryId
                // }).then(() => {
                //     _this.editing = false;
                //     _this.text = "";
                // })
            },
            onDeselect() {
                alert(`deselected`);
                // const _this = this;
                // this.select({
                //     id: this.transaction.id,
                //     category: null
                // }).then(() => _this.edit() )
            },
            highlightPrev() {
                this.highlighted += (this.highlighted > 0) ? -1 : 0;
            },
            highlightNext() {
                this.highlighted += (this.highlighted >= this.filteredCategories.length) ? 0 : 1;
            },
            highlightSelect() {
                this.onSelect( this.filteredCategories[this.highlighted].id )
            }
        }
    }
</script>

<style scoped>
    .invoice-container,
    .invoice-dropdown-list {
        min-width: 168px
    }

    .invoice-dropdown-list li {
        @apply bg-gray-100 p-2 w-full
    }
    .invoice-dropdown-list li:hover {
        @apply bg-gray-300 cursor-pointer
    }

    li.highlighted {
        @apply bg-blue-600 text-white
    }
    li.highlighted:hover {
        @apply bg-blue-800 text-white
    }
</style>