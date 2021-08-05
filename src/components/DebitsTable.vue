<template>
    <section class="">
        <table class="transactions-table min-w-full mt-6">
            <thead class="">
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
                        Category
                    </th>
                    <th class="lg:sticky bg-white shadow-md-bottom z-10 px-2 py-3 border-gray-300 text-base border-b text-left" style="top:45px">
                        Notes
                    </th>
                </tr>
            </thead>

            <tbody v-if="sorted.length">
                <tr v-for="debit in sorted" :key="debit.id" @click="toggleSelect(debit.id)" class="cursor-pointer group align-top" :class="[isSelected(debit.id) ? 'bg-gray-100 ' : 'hover:bg-gray-100']">
                    <td class="px-2 py-3 border-gray-300 border-b text-center text-base">
                        <input type="checkbox" class="form-checkbox text-indigo-500" :checked="isSelected(debit.id)" @click.stop="toggleSelect(debit.id)">
                    </td>
                    <td class="px-2 py-3 border-gray-300 border-b text-left text-base">
                        {{moment(debit.data.date, moment.ISO_8601).format('Do MMM \'YY')}}
                    </td>
                    <td class="px-2 py-3 border-gray-300 border-b text-left text-base">
                        <transaction-contact :transaction="debit"></transaction-contact>
                        <p class="text-gray-600">{{debit.data.desc}}</p>
                    </td>
                    <td class="px-2 py-3 pl-6 border-gray-300 border-b text-right font-number group-hover:bg-gray-200 text-base" :class="[isSelected(debit.id) ? 'bg-gray-200' : 'bg-gray-100']">
                        {{formatMoney(debit.data.value)}}
                    </td>
                    <td class="px-2 py-3 border-gray-300 border-b text-base">
                        <transaction-category :transaction="debit"></transaction-category>
                    </td>
                    <td class="px-2 py-3 border-gray-300 border-b text-base">
                        <transaction-note :transaction="debit"></transaction-note>
                    </td>
                </tr>
            </tbody>

            <tbody v-else>
                <tr>
                    <td colspan="6" class="px-3 py-8 text-center text-gray-600 text-base">
                        No transactions
                    </td>
                </tr>
            </tbody>

            <tfoot v-if="debits.length">
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
import { mapGetters } from 'vuex';
import { uniq, includes } from 'lodash';
import moment from 'moment';
import TransactionCategory from "../components/transactions/TransactionCategory";
import TransactionContact from "../components/transactions/TransactionContact";
import TransactionNote from "../components/transactions/TransactionNote";

/**
 * TODO - Bulk edit of contact
 * TODO - Bulk edit of category
 */

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
    components: {TransactionContact, TransactionCategory, TransactionNote },
    props: {
        value: Array,   // selected array usable with v-model
        debits: Array
    },
    watch: {
        debits() {
            this.deselectAll()
        },
        selected(newVal) {
            this.$emit('input', newVal)
        }
    },
    computed: {
        ...mapGetters({
            category: 'categories/FIND_BY_ID'
        }),
        sorted() {
            if( ! this.sortBy ) {
                return this.debits;
            }

            if( this.sortBy === 'date' ) {
                return Array.from(this.debits).sort( orderByTransactionDate(this.sortDir) )
            }

            if( this.sortBy === 'amount' ) {
                return Array.from(this.debits).sort( orderByAmount(this.sortDir) )
            }

            return this.debits;
        },
        subtotal() {
            return this.debits.reduce( (subtotal, debit) => {
                return subtotal.add( money(debit.data.value) )
            }, money() ).toJSON();
        },
        categoryFilterOptions() {
            return uniq( this.debits.map( debit => debit.category ) )
                .map( catId => this.category(catId) )
                .map( cat => {
                    return {
                        value: cat ? cat.id : '',
                        name: cat ? cat.name : 'None'
                    }
                })
                .sort( (a,b) => {
                    return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
                })
        },
        isSelected() {
            return (id) => {
                return includes(this.selected,id)
            }
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
        moment,
        formatMoney,
        selectAll() {
            this.allSelected = true;
            this.debits.forEach(d => this.select(d.id))
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
            if( this.selected.length === this.debits.length ) {
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