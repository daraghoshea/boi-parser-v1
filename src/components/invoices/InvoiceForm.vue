<template>
    <div class="-mt-8 -mx-6 lg:-mt-12 lg:-mx-12 pt-12 pb-24 px-8 mx-auto pdf-wrapper h-full">
        <div class="pdf-paper">
            <h1 class="uppercase flex items-center">
                Invoice
                <small class="ml-auto no-print bg-gray-300 text-gray-700 py-1 px-2 rounded-full text-xs">
                    draft
                </small>
            </h1>

            <hr class="my-6">

            <div class="flex">
                <div class="flex-1 flex-shrink-0">
                    <label class="text-xs uppercase text-teal-700 mb-1">To</label>
                    <div v-if="contact" class="group flex flex-wrap items-center">
                        <span class="mr-2">{{contact.company.name}}</span>

                        <button @click="removeContact" type="button" class="text-indigo-500 hover:text-indigo-700 inline invisible group-hover:visible">
                            <svg class="w-4 h-4" viewBox="0 0 20 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 5C0 4.44772 0.447715 4 1 4H19C19.5523 4 20 4.44772 20 5C20 5.55228 19.5523 6 19 6H1C0.447715 6 0 5.55228 0 5Z" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H13V3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2H8ZM15 4V3C15 2.20435 14.6839 1.44129 14.1213 0.87868C13.5587 0.31607 12.7956 0 12 0H8C7.20435 0 6.44129 0.31607 5.87868 0.87868C5.31607 1.44129 5 2.20435 5 3V4H3C2.44772 4 2 4.44772 2 5V19C2 19.7957 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H15C15.7957 22 16.5587 21.6839 17.1213 21.1213C17.6839 20.5587 18 19.7957 18 19V5C18 4.44772 17.5523 4 17 4H15ZM4 6V19C4 19.2652 4.10536 19.5196 4.29289 19.7071C4.48043 19.8946 4.73478 20 5 20H15C15.2652 20 15.5196 19.8946 15.7071 19.7071C15.8946 19.5196 16 19.2652 16 19V6H4Z" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 9C8.55228 9 9 9.44772 9 10V16C9 16.5523 8.55228 17 8 17C7.44772 17 7 16.5523 7 16V10C7 9.44772 7.44772 9 8 9Z" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 9C12.5523 9 13 9.44772 13 10V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V10C11 9.44772 11.4477 9 12 9Z" />
                            </svg>
                        </button>
                    </div>
                    <contact-search v-else @select="setContact">
                        <div class="relative"
                             slot-scope="{setText, select, isDropdownOpen, results, highlighted, onUpArrow, onDownArrow, onEscBtn, onEnterBtn, onFocus, onBlur }"
                             >
                            <input id="invoice-to"
                                   class="appearance-none bg-transparent border-none w-full text-gray-700 mb-3 py-1 leading-tight focus:outline-none"
                                   type="text" placeholder="Search contacts.." aria-label="Search contacts"
                                   autocomplete="off"
                                   @input="setText($event.target.value)"
                                   @focus="onFocus" @blur="onBlur"
                                   @keyup.up.prevent="onUpArrow" @keyup.down.prevent="onDownArrow"
                                   @keyup.esc.prevent="onEscBtn" @keyup.enter.prevent="onEnterBtn"
                            >

                            <ul v-if="isDropdownOpen" class="-mt-3 absolute bg-white h-48 shadow-lg w-full overflow-y-auto">
                                <li v-for="(contact, index) in results" :key="contact.id" @click="select(contact)" :class="{'bg-indigo-600 text-white hover:bg-indigo-800': index === highlighted}" class="bg-gray-100 p-2 w-full hover:bg-gray-300 cursor-pointer">
                                    {{contact.company.name}}
                                </li>
                            </ul>
                        </div>
                    </contact-search>

                    <label for="contact-address-input" class="text-xs uppercase text-teal-700 mt-4 mb-1 block">Address</label>
                    <resizeable-textarea>
                        <textarea id="contact-address-input" v-model="form.address" class="resize-none appearance-none bg-transparent border-none w-full text-gray-700 py-1 leading-tight focus:outline-none" type="text" placeholder="Address..." aria-label="Full name"></textarea>
                    </resizeable-textarea>
                </div>
                <div class="flex-1 flex-shrink-0 mx-8">
                    <label for="invoice-number" class="text-xs uppercase text-teal-700 mb-1">Invoice Number</label>
                    <input v-model="form.number" id="invoice-number" class="appearance-none bg-transparent border-none w-full text-gray-700 mb-3 py-1 leading-tight focus:outline-none" type="text" placeholder="Number" aria-label="Invoice Number">

                    <label for="invoice-date" class="text-xs uppercase text-teal-700 mb-1">Invoice Date</label>
                    <input v-model="form.date" id="invoice-date" class="appearance-none bg-transparent border-none w-full text-gray-700 mb-3 py-1 leading-tight focus:outline-none" type="text" placeholder="Date" aria-label="Invoice Date">

                    <label for="invoice-due" class="text-xs uppercase text-teal-700 mb-1">Invoice Due Date</label>
                    <input v-model="form.due" id="invoice-due" class="appearance-none bg-transparent border-none w-full text-gray-700 mb-3 py-1 leading-tight focus:outline-none" type="text" placeholder="Due Date" aria-label="Invoice Due Date">
                </div>
                <div class="flex-1 flex-shrink-0">
                    <p class="text-xs uppercase text-teal-700 mb-1">From</p>
                    <h2 contenteditable>Innovate Licensing Ltd</h2>
                    <p contenteditable>20 Upper Mountpleasant Ave</p>
                    <p contenteditable>Rathmines, Dublin 6</p>

                    <div class="flex mt-4">
                        <div class="w-1/2">
                            <p class="text-xs uppercase text-teal-700 " contenteditable>VAT No.</p>
                            <p class="appearance-none bg-transparent border-none w-full text-gray-700 mb-3 py-1 leading-tight focus:outline-none" contenteditable>
                                IE9805501N
                            </p>
                        </div>
                        <div class="w-1/2">
                            <p class="text-xs uppercase text-teal-700" contenteditable>Company No.</p>
                            <p class="appearance-none bg-transparent border-none w-full text-gray-700 mb-3 py-1 leading-tight focus:outline-none" contenteditable>
                                483055
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <table class="mt-16 w-full invoice-table">
                <thead>
                    <tr>
                        <th class="py-2 border-b border-gray-400 uppercase text-teal-700 text-xs font-normal text-left">Description</th>
                        <th class="py-2 border-b border-gray-400 uppercase text-teal-700 text-xs font-normal text-right">Quantity</th>
                        <th class="py-2 border-b border-gray-400 uppercase text-teal-700 text-xs font-normal text-right">Price</th>
                        <th class="py-2 border-b border-gray-400 uppercase text-teal-700 text-xs font-normal text-right pr-3">VAT Rate</th>
                        <th class="py-2 border-b border-gray-400 uppercase text-teal-700 text-xs font-normal text-right">Amount</th>
                    </tr>
                </thead>
                <tbody v-for="(line, ix) in form.lines" :key="ix">
                    <invoice-form-line :line="line"  @price="val => line.price = val" @quantity="val => line.quantity = val" @tax="val => line.tax = val">
                        <tr class="align-top" slot-scope="{ nett, setQuantity, setPrice, setTax }" >
                            <td class="py-2 border-b border-gray-400 text-left relative">
                                <resizeable-textarea>
                                    <textarea v-model="line.description" rows="1" class="resize-none appearance-none bg-transparent border-none w-full text-gray-700 leading-tight focus:outline-none" type="text" placeholder="Description" :aria-label="`Item ${ix+1} Description`"></textarea>
                                </resizeable-textarea>
                            </td>
                            <td class="py-2 border-b border-gray-400 text-right font-number">
                                <input :value="line.quantity" @blur="setQuantity($event.target.value)" class="w-12 appearance-none bg-transparent border-none text-right text-gray-700 py-1 leading-tight focus:outline-none focus:bg-gray-200 font-number" type="text" placeholder="0" :aria-label="`Item ${ix+1} Quantity`">
                            </td>
                            <td class="py-2 border-b border-gray-400 text-right font-number">
                                <input :value="formatMoney(line.price)" @blur="setPrice($event.target.value)" class=" w-24 appearance-none bg-transparent border-none text-right text-gray-700 py-1 leading-tight focus:outline-none focus:bg-gray-200 font-number " type="text" placeholder="0.00" :aria-label="`Item ${ix+1} Price`">
                            </td>
                            <td class="py-2 border-b border-gray-400 text-right font-number">
                                <input :value="line.tax" @blur="setTax($event.target.value)" class="w-16 inline appearance-none bg-transparent border-none text-right text-gray-700 py-1 leading-tight focus:outline-none focus:bg-gray-200 font-number" type="text" placeholder="0" :aria-label="`Item ${ix+1} Tax`">%
                            </td>
                            <td class="py-2 border-b border-gray-400 text-right relative font-number">
                                <input disabled class="w-24 appearance-none bg-transparent border-none text-right text-gray-700 py-2 pl-2 leading-tight focus:outline-none focus:bg-gray-200 font-number" type="text" placeholder="0.00" :aria-label="`Item ${ix+1} Subtotal`" :value="formatMoney(nett)">

                                <button type="button" class="-mr-6 absolute hover:text-indigo-800 mt-2 no-print right-0 text-indigo-600 text-sm top-auto"
                                        v-if="form.lines.length > 1"
                                        @click="removeLine(ix)">
                                    <svg class="w-4 h-4" viewBox="0 0 20 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 5C0 4.44772 0.447715 4 1 4H19C19.5523 4 20 4.44772 20 5C20 5.55228 19.5523 6 19 6H1C0.447715 6 0 5.55228 0 5Z" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H13V3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2H8ZM15 4V3C15 2.20435 14.6839 1.44129 14.1213 0.87868C13.5587 0.31607 12.7956 0 12 0H8C7.20435 0 6.44129 0.31607 5.87868 0.87868C5.31607 1.44129 5 2.20435 5 3V4H3C2.44772 4 2 4.44772 2 5V19C2 19.7957 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H15C15.7957 22 16.5587 21.6839 17.1213 21.1213C17.6839 20.5587 18 19.7957 18 19V5C18 4.44772 17.5523 4 17 4H15ZM4 6V19C4 19.2652 4.10536 19.5196 4.29289 19.7071C4.48043 19.8946 4.73478 20 5 20H15C15.2652 20 15.5196 19.8946 15.7071 19.7071C15.8946 19.5196 16 19.2652 16 19V6H4Z" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 9C8.55228 9 9 9.44772 9 10V16C9 16.5523 8.55228 17 8 17C7.44772 17 7 16.5523 7 16V10C7 9.44772 7.44772 9 8 9Z" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 9C12.5523 9 13 9.44772 13 10V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V10C11 9.44772 11.4477 9 12 9Z" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </invoice-form-line>
                </tbody>
                <tbody>
                    <tr>
                        <td colspan="2">
                            <button type="button" @click="addLine" class="no-print px-3 py-1 text-sm rounded-full text-white font-bold bg-indigo-600 hover:bg-indigo-700">
                                + Add Line
                            </button>
                        </td>
                        <td colspan="2" class="py-2 pr-2 font-bold text-right">Subtotal</td>
                        <td class="py-2 text-right font-number">
                            {{formatMoney(this.subtotal)}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"></td>
                        <td colspan="2" class="py-2 pr-2 font-bold text-right">VAT</td>
                        <td class="py-2 text-right font-number">
                            {{formatMoney(this.tax)}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"></td>
                        <td colspan="2" class="py-2 pr-2 font-bold text-right">Total EUR</td>
                        <td class="py-2 border-t border-gray-400 text-right font-number">
                            {{formatMoney(this.total)}}
                        </td>
                    </tr>
                </tbody>
            </table>

            <section class="mt-24">
                <h2 class="text-lg font-bold">Bank Transfer Information</h2>

                <div contenteditable>
                    <p>Bank of Ireland, Blanchardstown, Co. Dublin</p>
                    <p>IE44BOFI90042046950263</p>
                    <p>BOFIIE2DXXX</p>
                </div>
            </section>
        </div>
        <div class="mt-12 flex justify-center no-print">
            <button @click.prevent="print"
                    class="inline-flex items-center px-5 py-3 mx-6 border border-teal-600 text-teal-600 font-bold hover:text-teal-700 hover:border-teal-700 rounded-lg text-sm"
                    :disabled="saving"
                    :class="{'opacity-25': saving}">
                <svg class="h-3 w-3 mr-2" viewBox="0 0 22 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 1C4 0.447715 4.44772 0 5 0H17C17.5523 0 18 0.447715 18 1V8C18 8.55228 17.5523 9 17 9C16.4477 9 16 8.55228 16 8V2H6V8C6 8.55228 5.55228 9 5 9C4.44772 9 4 8.55228 4 8V1Z" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3 9C2.73478 9 2.48043 9.10536 2.29289 9.29289C2.10536 9.48043 2 9.73478 2 10V15C2 15.2652 2.10536 15.5196 2.29289 15.7071C2.48043 15.8946 2.73478 16 3 16H5C5.55228 16 6 16.4477 6 17C6 17.5523 5.55228 18 5 18H3C2.20435 18 1.44129 17.6839 0.87868 17.1213C0.31607 16.5587 0 15.7956 0 15V10C0 9.20435 0.31607 8.44129 0.87868 7.87868C1.44129 7.31607 2.20435 7 3 7H19C19.7957 7 20.5587 7.31607 21.1213 7.87868C21.6839 8.44129 22 9.20435 22 10V15C22 15.7957 21.6839 16.5587 21.1213 17.1213C20.5587 17.6839 19.7957 18 19 18H17C16.4477 18 16 17.5523 16 17C16 16.4477 16.4477 16 17 16H19C19.2652 16 19.5196 15.8946 19.7071 15.7071C19.8946 15.5196 20 15.2652 20 15V10C20 9.73478 19.8946 9.48043 19.7071 9.29289C19.5196 9.10536 19.2652 9 19 9H3Z" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 13C4 12.4477 4.44772 12 5 12H17C17.5523 12 18 12.4477 18 13V21C18 21.5523 17.5523 22 17 22H5C4.44772 22 4 21.5523 4 21V13ZM6 14V20H16V14H6Z" />
                </svg>
                Print
            </button>

            <button
                    @click="onSave"
                    type="submit"
                    class="inline-flex items-center px-5 py-3 mx-6 text-white font-bold rounded-lg" :class="[saving ? 'bg-indigo-300 cursor-default' : 'bg-indigo-600 hover:bg-indigo-700']" :disabled="saving">
                        <span v-if="saving">
                            <svg class="h-4 w-4 loading-spinner my-1 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                        </span>
                        <span v-else>{{this.button}}</span>
            </button>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    import {money, formatMoney} from "../../utils/money";
    import {merge} from 'lodash'
    import {mapActions, mapGetters} from 'vuex'
    import InvoiceFormLine from "./InvoiceFormLine";
    import ResizeableTextarea from "../forms/ResizeableTextarea";
    import ContactSearch from "../ContactSearch";

    export default {
        components: {ContactSearch, InvoiceFormLine, ResizeableTextarea},
        props: {
            id: {
                type: Number,
                default: 0
            },
            populate: {
                type: Object,
                default() { return {} }
            },
            button: {
                type: String,
                default: "Save"
            }
        },
        computed: {
            subtotal() {
                return this.form.lines.reduce((subtotal, line) => {
                    return subtotal.add(
                        money(line.price).multiply(line.quantity)
                    )
                }, money())
            },
            tax() {
                return this.form.lines.reduce((tax, line) => {
                    const nett = money(line.price).multiply(line.quantity)
                    return tax.add(
                        money({
                            amount: Math.round( nett.getAmount() * (line.tax || 0) / 100 )
                        })
                    )
                }, money())
            },
            total() {
                return this.subtotal.add(this.tax)
            },
            ...mapGetters({
                findContact: 'contacts/FIND_BY_ID'
            })
        },
        data() {
            return {
                contact: null,
                saving: false,
                form: {
                    contact: null,
                    address: null,
                    number: 0,
                    date: null,
                    due: null,
                    status: null,
                    lines: [
                        {
                            description: "",
                            quantity: 0,
                            price: {
                                amount: 0
                            },
                            tax: 23
                        }
                    ]
                },
                totals: {

                }
            }
        },
        created() {
            const allowedFormKeys = Object.keys(this.form);

            this.form = merge(this.form, this.populate);

            // Remove any keys not specified on form
            Object.keys(this.form).forEach(key => {
                if( allowedFormKeys.indexOf(key) < 0 ) {
                    delete this.form[key];
                }
            });

            if(this.form.contact) {
                this.contact = this.findContact(this.form.contact)
            }
        },
        methods: {
            ...mapActions({
                saveInvoice: 'invoices/SAVE'
            }),
            moment,
            formatMoney,
            addLine() {
                this.form.lines.push({
                    description: "",
                    quantity: 0,
                    price: 0,
                    tax: 23,
                    amount: 0
                })
            },
            removeLine(index) {
                if( this.form.lines.length > 1 ) {
                    this.form.lines.splice(index, 1)
                }
            },
            print() {
                //TODO check if fields are valid and send warning if not
                window.print()
            },
            setContact(contact) {
                this.contact = contact;
                this.form.contact = contact.id
                this.form.address = contact.company.address
            },
            removeContact() {
                this.contact = null
                this.form.contact = null
                this.form.address = null
            },
            onSave() {

                if( this.saving ) {
                    return;
                }

                const invoice = {...this.form};
                const _this = this;
                this.saving = true;

                this.saveInvoice({ id: this.id, invoice })
                    .then( response => {
                        _this.saving = false
                        _this.$emit('saved', response)
                    } )
                    .catch( reason => {
                        _this.saving = false
                        _this.$emit('error', reason)
                    })
            }
        }
    }
</script>

<style scoped>
    @media screen {
        input:not([disabled]), textarea:not([disabled]) {
            @apply bg-indigo-100 p-2
        }

        .pdf-wrapper {
            @apply bg-gray-100
        }

        .pdf-paper {
            @apply bg-white shadow-lg max-w-3xl p-8 mx-auto
        }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        .hide-screen {
            @apply hidden
        }
    }

    @media print {
        input:not([disabled]), textarea:not([disabled]) {
            @apply bg-transparent px-0
        }
        .pdf-paper {
            @apply p-16
        }
        .hide-print {
            @apply hidden
        }
    }
</style>