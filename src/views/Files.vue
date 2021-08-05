<template>
    <app-layout>
        <template #header>
            <h1>Files</h1>
        </template>
        <header class="flex items-center border-b border-gray-200 mb-4 pb-2">
            <h1>Statements</h1>
            <div class="flex ml-auto">

                <router-link v-if="$route.path !== '/files'" to="/files" class="flex items-center px-2 -mx-2 py-1 hover:text-gray-900 font-bold text-gray-700 text-sm" active-class="text-gray-900">
                    &raquo; Uploaded Statements
                </router-link>

                <router-link v-if="$route.path !== '/files/upload'" to="/files/upload" class="flex items-center px-2 -mx-2 py-1 hover:text-gray-900 font-bold text-gray-700 text-sm" active-class="text-gray-900">
                    <svg class="h-4 w-4 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1 12C1.55228 12 2 12.4477 2 13V17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H17C17.2652 18 17.5196 17.8946 17.7071 17.7071C17.8946 17.5196 18 17.2652 18 17V13C18 12.4477 18.4477 12 19 12C19.5523 12 20 12.4477 20 13V17C20 17.7957 19.6839 18.5587 19.1213 19.1213C18.5587 19.6839 17.7957 20 17 20H3C2.20435 20 1.44129 19.6839 0.87868 19.1213C0.31607 18.5587 0 17.7956 0 17V13C0 12.4477 0.447715 12 1 12Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29289 0.292893C9.68342 -0.0976311 10.3166 -0.0976311 10.7071 0.292893L15.7071 5.29289C16.0976 5.68342 16.0976 6.31658 15.7071 6.70711C15.3166 7.09763 14.6834 7.09763 14.2929 6.70711L10 2.41421L5.70711 6.70711C5.31658 7.09763 4.68342 7.09763 4.29289 6.70711C3.90237 6.31658 3.90237 5.68342 4.29289 5.29289L9.29289 0.292893Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C10.5523 0 11 0.447715 11 1V13C11 13.5523 10.5523 14 10 14C9.44772 14 9 13.5523 9 13V1C9 0.447715 9.44772 0 10 0Z" />
                    </svg>
                    Upload Statement
                </router-link>
            </div>
        </header>

        <router-view></router-view>

    </app-layout>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import {formatMoney} from "../utils/money";
    import AppLayout from "../layouts/AppLayout";

    export default {
        name: 'Files',
        components: {AppLayout},
        computed: {
            ...mapGetters({
                files: 'files/files',
                fileProcessInfo: 'processor/GET_GILE',
                fileTransactions: 'transactions/GET_FILE',
                duplicatesCount: 'files/GET_DUPLICATES_COUNT'
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
                this.selected = this.files[0].id;
            }
        }
    }
</script>