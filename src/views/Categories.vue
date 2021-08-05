<template>
    <app-layout>
        <template #header>
            <h1>Debit Categories</h1>
        </template>
        <main>
            <table class="mx-auto">
                <thead>
                    <tr>
                        <th class="p-2 text-left">
                            <filter-sort v-model="filter.sort" label="Category" asc="category-asc" desc="category-desc"></filter-sort>
                        </th>
                        <th class="p-2 text-center">
                            <filter-sort v-model="filter.sort" label="Transactions" asc="transaction-asc" desc="transaction-desc"></filter-sort>
                        </th>
                        <th class="p-2 text-right">
                            <filter-sort v-model="filter.sort" label="Subtotal" asc="subtotal-asc" desc="subtotal-desc"></filter-sort>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, i) in sorted" :key="i">
                        <td class="p-2 text-left border-gray-400 border">
                            <span v-if="row.category" class="flex">
                                {{row.category.name}}
                                <span class="text-gray-400 ml-auto pl-8">{{row.category.id}}</span>
                            </span>
                            <span v-else>None</span>
                        </td>
                        <td class="p-2 text-center border-gray-400 border">{{row.transactions.length}}</td>
                        <td class="p-2 pl-8 text-right border-gray-400 border">
                            {{format(row.subtotal)}}
                        </td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr class="font-bold">
                        <td class="p-2 text-left bg-gray-100">Total</td>
                        <td class="p-2 text-left bg-gray-100 text-center">
                            {{transactionsCount}}
                        </td>
                        <td class="p-2 text-left bg-gray-100 text-right">
                            {{format(total)}}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </main>
    </app-layout>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {formatMoney, money} from "../utils/money";
    import FilterSort from "../components/FilterSort";
    import AppLayout from "../layouts/AppLayout";

    function subtotal(transactions) {
        return transactions.reduce((subtotal, t) => {
            return subtotal.add( money(t.data.value) );
        }, money());
    }

    function sortCategoryName(a, b) {
        const aU = a.category ? a.category.name.toUpperCase() : 'NONE',
            bU = b.category ? b.category.name.toUpperCase() : 'NONE';

        if( aU === bU ) return 0;
        if( aU < bU ) return -1;
        return 1;
    }

    const sortCategories = (type) => (a, b) => {
        switch(type) {
            case 'category-asc':
                return sortCategoryName(a,b);

            case 'category-desc':
                return sortCategoryName(b,a);

            case 'transaction-asc':
                return a.transactions.length - b.transactions.length;

            case 'transaction-desc':
                return b.transactions.length - a.transactions.length;

            case 'subtotal-asc':
                return a.subtotal.subtract( b.subtotal ).getAmount();

            case 'subtotal-desc':
                return b.subtotal.subtract( a.subtotal ).getAmount();

            default:
                return 0;
        }
    };

    export default {
        components: {AppLayout, FilterSort},
        computed: {
            ...mapGetters({
                category: 'categories/FIND_BY_ID',
                transactions: 'categories/DEBITS'
            }),
            sorted() {
                if( ! this.filter.sort ) {
                    return this.all;
                }
                const all = this.all;
                return all.sort(sortCategories(this.filter.sort));
            },
            transactionsCount() {
                return Object.values(this.transactions).reduce( (total,cat) => {
                    return total += cat.length;
                }, 0)
            },
            total() {
                return this.all.reduce( (total, line) => {
                    return total.add( line.subtotal );
                }, money());
            }
        },
        data() {
            return {
                all: null,
                filter: {
                    sort: null
                }
            }
        },
        mounted() {
            this.all = Object.values(this.transactions).map( transactions => {
                return {
                    category: transactions[0].category === 'none' ? null : this.category(transactions[0].category),
                    transactions,
                    subtotal: subtotal(transactions)
                }
            })
        },
        methods: {
            format(m) {
                return formatMoney(m);
            }
        }
    }
</script>