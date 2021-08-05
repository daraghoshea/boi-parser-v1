<template>
    <section class="">
        <table class="transactions-table min-w-full mt-6">
            <thead>
                <tr>
                    <th class="lg:sticky bg-white shadow-md-bottom z-10 px-2 py-3 border-gray-300 text-base text-center w-6" style="top:45px;">
                        <input type="checkbox" class="form-checkbox" @click="toggleSelectAll" :checked="allSelected">
                    </th>
                    <th class="lg:sticky bg-white shadow-md-bottom z-10 px-2 py-3 border-gray-300 text-base border-b text-left" style="top:45px">
                        <button type="button" @click="sort('date')" class="appearance-none outline-none focus:outline-none font-bold inline-flex items-center">
                            Date
                            <svg v-if="sortBy === 'date'" :style="{transform: 'rotate('+ (sortDir === 'desc' ? 180 : 0 ) + 'deg)'}" class="w-3 h-auto ml-1 text-teal-700" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 7L7 1L1 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </th>
                    <th class="lg:sticky bg-white shadow-md-bottom z-10 px-2 py-3 border-gray-300 text-base border-b text-left" style="top:45px">
                        Details
                    </th>
                    <th class="lg:sticky bg-white shadow-md-bottom z-10 px-2 py-3 border-gray-300 text-base border-b text-right" style="top:45px">
                        <button type="button" @click="sort('amount')" class="appearance-none outline-none focus:outline-none font-bold inline-flex items-center">
                            <svg v-if="sortBy === 'amount'" :style="{transform: 'rotate('+ (sortDir === 'desc' ? 180 : 0 ) + 'deg)'}" class="w-3 h-auto mr-1 text-teal-700" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 7L7 1L1 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Amount
                        </button>
                    </th>
                    <th class="lg:sticky bg-white shadow-md-bottom z-10 px-2 py-3 border-gray-300 text-base border-b text-left" style="top:45px">
                        Allocated To
                    </th>
                    <th class="lg:sticky bg-white shadow-md-bottom z-10 px-2 py-3 border-gray-300 text-base border-b text-left" style="top:45px">
                        Notes
                    </th>

                </tr>
            </thead>
            <tbody v-if="sorted.length">
                <tr v-for="credit in sorted" :key="credit.id" @click="toggleSelect(credit.id)" class="cursor-pointer group align-top" :class="[isSelected(credit.id) ? 'bg-gray-100 ' : 'hover:bg-gray-100']">
                    <td class="px-2 py-3 border-gray-300 border-b text-center text-base">
                        <input type="checkbox" class="form-checkbox text-indigo-500" :checked="isSelected(credit.id)" @click.stop="toggleSelect(credit.id)">
                    </td>
                    <td class="px-2 py-3 border-gray-300 border-b text-left text-base">
                        {{credit.data.date}}
                    </td>
                    <td class="px-2 py-3 border-gray-300 border-b text-left text-base">
                        <transaction-contact :transaction="credit"></transaction-contact>
                        <p class="text-gray-600">{{credit.data.desc}}</p>
                    </td>
                    <td class="px-2 py-3 pl-6 border-gray-300 border-b text-right font-number group-hover:bg-gray-200 text-base" :class="[isSelected(credit.id) ? 'bg-gray-200' : 'bg-gray-100']">
                        {{formatMoney(credit.data.value)}}
                    </td>
                    <td class="px-2 py-3 border-gray-300 border-b text-left text-base">
                        <assign-invoice :transaction="credit"></assign-invoice>
                    </td>
                    <td class="px-2 py-3 border-gray-300 border-b text-base">
                        <transaction-note :transaction="credit"></transaction-note>
                    </td>
                </tr>
            </tbody>

            <tbody v-else>
                <tr>
                    <td colspan="6" class="px-3 py-8 text-center text-gray-600 text-base">
                        No credit transactions found.
                    </td>
                </tr>
            </tbody>

            <tfoot v-if="credits.length">
            <tr>
                <td class="px-2 py-3 font-bold text-left text-gray-600 text-base"></td>
                <td class="px-2 py-3 font-bold text-left text-gray-600 text-base"></td>
                <td class="px-2 py-3 font-bold text-left text-gray-600 text-base"></td>
                <td class="px-2 py-3 pl-6 border-gray-300 border-b-2 bg-gray-100 font-bold text-right font-number text-base">
                    {{formatMoney(subtotal)}}
                </td>
                <td class="px-2 py-3 font-bold text-left text-gray-600 text-base"></td>
                <td class="px-2 py-3 font-bold text-left text-gray-600 text-base"></td>
            </tr>
            </tfoot>
        </table>

    </section>
</template>

<script>
import {money, formatMoney} from "../utils/money";
import {includes} from 'lodash'
import moment from 'moment'
import TransactionContact from "../components/transactions/TransactionContact";
import TransactionNote from "./transactions/TransactionNote";
import AssignInvoice from "./transactions/AssignInvoice";

const orderByTransactionDate = (dir) => (a,b) => {
    const aVal = moment(a.data.date,moment.ISO_8601).unix(),
        bVal = moment(b.data.date,moment.ISO_8601).unix();

    return dir === 'desc' ? bVal - aVal : aVal - bVal;
};

const orderByAmount = (dir) => (a,b) => {
    return dir === 'desc'
        ? b.data.value.amount - a.data.value.amount
        : a.data.value.amount - b.data.value.amount;
};

export default {
    components: {AssignInvoice, TransactionNote, TransactionContact},
    props: {
        credits: Array
    },
    computed: {
        filteredCredits() {
            return this.credits.filter(() => {
                return true;
            })
        },
        subtotal() {
            return this.filteredCredits.reduce( (subtotal, credit) => {
                return subtotal.add( money(credit.data.value) )
            }, money() ).toJSON();
        },
        isSelected() {
            return (id) => {
                return includes(this.selected,id)
            }
        },
        sorted() {
            if( ! this.sortBy ) {
                return this.credits;
            }

            if( this.sortBy === 'date' ) {
                return Array.from(this.credits).sort( orderByTransactionDate(this.sortDir) )
            }

            if( this.sortBy === 'amount' ) {
                return Array.from(this.credits).sort( orderByAmount(this.sortDir) )
            }

            return this.credits;
        },
    },
    data() {
        return {
            sortBy: null,
            sortDir: 'asc',
            allSelected: false,
            selected: []
        }
    },
    methods: {
        formatMoney,

        selectAll() {
            this.allSelected = true;
            this.credits.forEach(d => this.select(d.id))
        },
        deselectAll() {
            this.allSelected = false;
            this.selected = [];
        },
        toggleSelectAll() {
            this.allSelected ? this.deselectAll() : this.selectAll()
        },

        select(id) {
            this.selected.push(id)
            if( this.selected.length === this.credits.length ) {
                this.allSelected = true;
            }
        },
        deselect(id) {
            const ix = this.selected.findIndex(i => i === id)
            if( ix > -1 ) {
                this.selected.splice(ix, 1);
                this.allSelected = false;
            }
        },
        toggleSelect(id) {
            this.isSelected(id) ? this.deselect(id) : this.select(id)
        },
        sort(by) {
            if( this.sortBy === by ) {
                if( this.sortDir === 'asc' ) {
                    this.sortDir = 'desc'
                }
                else {
                    this.sortBy = null
                }
            }
            else {
                this.sortBy = by;
                this.sortDir = 'asc';
            }
        }
    }
}
</script>