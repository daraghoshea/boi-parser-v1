<template>
    <app-layout>
        <template #header>
            <h1>
                Statements
            </h1>
            <p class="ml-auto">
                <router-link :to="{name: 'accounts'}" class="text-bold text-gray-600 hover:text-gray-800">
                    &laquo; Accounts
                </router-link>
            </p>
        </template>
        <div class="md:flex">
            <aside class="flex-0 flex-no-shrink md:mr-6 md:border-r md:border-gray-200">
                <ul v-if="statements.length" class="border-t border-gray-200">
                    <li v-for="statement in statements"
                        :key="statement.id"
                        @click="select(statement.id)"
                        class="py-3 px-5 bg-gray-100 border-b border-white cursor-pointer hover:bg-gray-200"
                        :class="{'bg-teal-500 text-white hover:bg-teal-500': selected === statement.id}">
                        {{statement.id}}  - {{statement.info.name}}
                    </li>
                </ul>
            </aside>

            <main>
                <section v-if="statement">
                    <header>
                        <h2 class="text-lg font-bold mt-4 mb-2">File Info</h2>
                        <details>
                            <summary>{{statement.info.name}} ({{statement.info.fileSize}})</summary>
                            <pre>{{statement}}</pre>
                        </details>
                    </header>

                    <main>
                        <h2 class="text-lg font-bold mt-4 mb-2">File Transactions: {{transactions.length}}</h2>
                        <details v-for="transaction in transactions" :key="transaction.id">
                            <summary>{{transaction.id}} / {{transaction.data.date}} / {{transaction.data.desc}} / {{moneyFormat(transaction.data.value)}} </summary>
                            <pre>{{transaction}}</pre>
                        </details>
                    </main>

                    <footer v-if="! transactions.length">
                        <button type="button"
                                class="px-4 py-2 bg-red-600 text-white hover:bg-red-800 rounded-full"
                                @click="remove({ id: statement.id })">Delete File</button>
                    </footer>
                </section>
                <section v-else>
                    <p>{{statements.length}} Statements uploaded.</p>
                </section>
            </main>
        </div>
    </app-layout>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import {formatMoney} from "../../utils/money";
    import AppLayout from "../../layouts/AppLayout";

    export default {
        name: 'Files',
        components: {AppLayout},
        computed: {
            ...mapGetters({
                all: 'statements/ALL',
                query: 'statements/QUERY',
                getTransactions: 'transactions/GET_FILE',
            }),
            statements() {
                return Array.from(this.query({
                    orderBy: 'id',
                    order: 'desc'
                }));
            },
            transactions() {
                return this.statement
                    ? this.getTransactions(this.statement.id)
                    : [];
            },
            statement() {
                return this.statements.find( (f) => f.id === this.selected );
            },
        },
        data() {
            return {
                selected: 0
            }
        },
        methods: {
            ...mapActions({
                remove: 'statements/DELETE_FILE'
            }),
            select(id) {
                this.selected = ( id === this.selected )
                    ? null
                    : id;
            },
            moneyFormat(value) {
                return formatMoney(value);
            }
        },
        mounted() {
            if( this.statements.length ) {
                this.selected = 0;
            }
        }
    }
</script>