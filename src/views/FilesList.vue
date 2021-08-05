<template>
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
            <section v-if="selectedFile">
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
                        <summary>{{transaction.id}} / {{transaction.data.date}} / {{transaction.data.desc}} / {{moneyFormat(transaction.data.value)}} </summary>
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
                <p>{{files.length}} PDFs uploaded.</p>
                <p>{{duplicatesCount}} duplicate detected</p>
            </section>
        </main>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import {formatMoney} from "../utils/money";

    export default {
        name: 'Files',
        computed: {
            ...mapGetters({
                files: 'files/files',
                fileProcessInfo: 'processor/GET_FILE',
                fileTransactions: 'transactions/GET_FILE',
                duplicatesCount: 'files/getDuplicatesCount'
            }),
            allFiles() {
                return Array.from(this.files)
                    .sort( (a,b) => a.id < b.id ? -1 : 1)
                    .reverse();
            },
            selectedFile() {
                return this.files.find( (f) => f.id === this.selected );
            },
        },
        data() {
            return {
                selected: 0
            }
        },
        methods: {
            ...mapActions({
                remove: 'files/DELETE_FILE'
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
            if( this.files.length ) {
                this.selected = this.files[ this.files.length -1 ].id;
            }
        }
    }
</script>