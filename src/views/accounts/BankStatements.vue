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
            <aside class="flex-0 flex-no-shrink md:mr-6 ">
                <p>
                  <router-link :to="{name: 'accounts.upload', params: {id: account.id}}" class="w-full inline-flex items-center px-3 py-1 font-bold text-teal-700 text-sm border border-teal-700 rounded-full hover:bg-teal-700 hover:text-white" active-class="text-gray-900">
                    <svg class="h-3 w-3 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1.55228 12 2 12.4477 2 13V17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H17C17.2652 18 17.5196 17.8946 17.7071 17.7071C17.8946 17.5196 18 17.2652 18 17V13C18 12.4477 18.4477 12 19 12C19.5523 12 20 12.4477 20 13V17C20 17.7957 19.6839 18.5587 19.1213 19.1213C18.5587 19.6839 17.7957 20 17 20H3C2.20435 20 1.44129 19.6839 0.87868 19.1213C0.31607 18.5587 0 17.7956 0 17V13C0 12.4477 0.447715 12 1 12Z" />
                      <path d="M9.29289 0.292893C9.68342 -0.0976311 10.3166 -0.0976311 10.7071 0.292893L15.7071 5.29289C16.0976 5.68342 16.0976 6.31658 15.7071 6.70711C15.3166 7.09763 14.6834 7.09763 14.2929 6.70711L10 2.41421L5.70711 6.70711C5.31658 7.09763 4.68342 7.09763 4.29289 6.70711C3.90237 6.31658 3.90237 5.68342 4.29289 5.29289L9.29289 0.292893Z" />
                      <path d="M10 0C10.5523 0 11 0.447715 11 1V13C11 13.5523 10.5523 14 10 14C9.44772 14 9 13.5523 9 13V1C9 0.447715 9.44772 0 10 0Z" />
                    </svg>
                    Upload PDF
                  </router-link>
                </p>

                <ul v-if="statements.length" class="mt-6 border-t border-gray-200 md:border-r md:border-gray-200">
                    <li v-for="s in statements"
                        :key="s.id"
                        @click="select(s.id)"
                        class="py-3 px-5 bg-gray-100 border-b border-white cursor-pointer hover:bg-gray-200"
                        :class="{'bg-teal-500 text-white hover:bg-teal-500': selected === s.id}">
                        <div>{{s.id}}  - {{s.info.name}}</div>
                        <div class="text-sm">{{s.transactionCount}} transactions</div>
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
        created() {
          this.account = this.fetchAccount(
              Number.parseInt(this.$route.params.id)
          );

          if( ! this.account ) {
            this.error = `Could not find account with id ${this.$route.params.id}`
          }
        },
        computed: {
            ...mapGetters({
                all: 'statements/ALL',
                query: 'statements/QUERY',
                getTransactions: 'transactions/GET_FILE',
                getTransactionsCount: 'transactions/GET_FILE_COUNT',
                fetchAccount: 'accounts/FIND_BY_ID'
            }),
            statements() {
                return Array.from(this.query({
                    orderBy: 'id',
                    order: 'desc',
                    account: this.account.id,
                })).map(statement => {
                  statement.transactionCount = this.getTransactionsCount(statement.id);
                  return statement;
                });
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
                selected: 0,
                error: null,
                account: null
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