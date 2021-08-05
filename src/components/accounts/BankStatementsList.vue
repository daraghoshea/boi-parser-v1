<template>
    <app-layout>
        <template #header>
            <h1>
                Statements <span v-if="account"> - {{account.data.accountName}} [{{account.data.accountCurrency}}] ({{account.data.bankName}})</span>
            </h1>
            <p class="ml-auto">
                <router-link :to="{name: 'accounts'}" class="text-bold text-gray-600 hover:text-gray-800">
                    &laquo; Accounts
                </router-link>
            </p>
        </template>
        <div class="md:flex">
            <aside class="flex-0 flex-no-shrink md:mr-6 md:border-r md:border-gray-200">
                <ul v-if="allFiles.length" class="border-t border-gray-200">
                    <li v-for="file in allFiles"
                        :key="file.id"
                        @click="select(file.id)"
                        class="py-3 px-5 bg-gray-100 border-b border-white cursor-pointer hover:bg-gray-200"
                        :class="{'bg-teal-500 text-white hover:bg-teal-500': selected === file.id}">
                        {{file.id}}  - {{file.info.name}}
                    </li>
                </ul>
            </aside>

            <main>
                <section v-if="selectedStatement">
                    <header>
                        <h2 class="text-lg font-bold mt-4 mb-2">File Info</h2>
                        <details>
                            <summary>{{fileProcessInfo(selected).info.name}} ({{fileProcessInfo(selected).info.fileSize}})</summary>
                            <pre>{{fileProcessInfo(selected)}}</pre>
                        </details>
                    </header>

                    <main>
                        <h2 class="text-lg font-bold mt-4 mb-2">File Transactions: {{fileTransactions(selected).length}}</h2>
                        <details v-for="transaction in fileTransactions(selected)" :key="transaction.id">
                            <summary>{{transaction.id}} / {{transaction.data.date}} / {{transaction.data.desc}} / {{formatMoney(transaction.data.value)}} </summary>
                            <pre>{{transaction}}</pre>
                        </details>
                    </main>

                    <footer v-if="! fileTransactions(selected).length">
                        <button type="button"
                                class="px-4 py-2 bg-red-600 text-white hover:bg-red-800 rounded-full"
                                @click="remove({ id: fileProcessInfo(selected).id })">Remove File</button>
                    </footer>
                </section>
                <section v-else>
                    <p>{{statements.length}} PDFs uploaded.</p>
                </section>
            </main>
        </div>
    </app-layout>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { formatMoney } from "../../utils/money";
    import AppLayout from "../../layouts/AppLayout";

    export default {
        name: 'Files',
        components: {AppLayout},
        computed: {
            ...mapGetters({
                get: 'statements/QUERY',
                fileProcessInfo: 'processor/GET_FILE',
                fileTransactions: 'transactions/GET_FILE',
            }),
            statements() {
                return this.get();
            },
            selectedStatement() {
                return this.statements.find( f => f.id === this.selected );
            },
        },
        data() {
            return {
                selected: null
            }
        },
        methods: {
            select(id) {
                this.selected = ( id === this.selected )
                    ? null
                    : id;
            },
            formatMoney(value) {
                return formatMoney(value);
            }
        },
        mounted() {
            if( this.statements.length ) {
                this.selected = this.statements[ this.statements.length -1 ].id;
            }
        }
    }
</script>