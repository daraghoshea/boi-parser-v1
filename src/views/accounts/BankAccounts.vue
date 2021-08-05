<template>
    <app-layout>
        <template #header>
            <h1>Bank Accounts</h1>
            <p class="ml-auto">
                <router-link :to="{name: 'accounts.new'}" class="inline-flex items-center p-3 bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-lg leading-none text-sm">
                    <svg class="h-3 w-3 mr-2" viewBox="0 0 18 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.87868 0.87868C1.44129 0.31607 2.20435 0 3 0H11C11.2652 0 11.5196 0.105357 11.7071 0.292893L17.7071 6.29289C17.8946 6.48043 18 6.73478 18 7V19C18 19.7957 17.6839 20.5587 17.1213 21.1213C16.5587 21.6839 15.7957 22 15 22H3C2.20435 22 1.44129 21.6839 0.87868 21.1213C0.31607 20.5587 0 19.7957 0 19V3C0 2.20435 0.31607 1.44129 0.87868 0.87868ZM3 2C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20H15C15.2652 20 15.5196 19.8946 15.7071 19.7071C15.8946 19.5196 16 19.2652 16 19V7.41421L10.5858 2H3Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11 0C11.5523 0 12 0.447715 12 1V6H17C17.5523 6 18 6.44772 18 7C18 7.55228 17.5523 8 17 8H11C10.4477 8 10 7.55228 10 7V1C10 0.447715 10.4477 0 11 0Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 12C4 11.4477 4.44772 11 5 11H13C13.5523 11 14 11.4477 14 12C14 12.5523 13.5523 13 13 13H5C4.44772 13 4 12.5523 4 12Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 16C4 15.4477 4.44772 15 5 15H13C13.5523 15 14 15.4477 14 16C14 16.5523 13.5523 17 13 17H5C4.44772 17 4 16.5523 4 16Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 8C4 7.44772 4.44772 7 5 7H7C7.55228 7 8 7.44772 8 8C8 8.55228 7.55228 9 7 9H5C4.44772 9 4 8.55228 4 8Z" />
                    </svg>
                    New Bank Account
                </router-link>
            </p>
        </template>
        <main>
            <div v-if="accounts.length">
                <table class="mx-auto w-full">
                    <thead>
                        <tr class="align-bottom">
                            <th class="p-2 text-left border-gray-300 border-b">Account</th>
                            <th class="p-2 text-left border-gray-300 border-b">Number</th>
                            <th class="p-2 text-left border-gray-300 border-b">Currency</th>
                            <th class="p-2 text-left border-gray-300 border-b"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="account in accounts" :key="account.id">
                            <td class="px-2 py-3 border-gray-300 border-b text-left">
                                <router-link :to="{name: 'accounts.edit', params: {id: account.id}}" class="font-semibold text-indigo-500 hover:text-indigo-700">
                                    {{account.data.bankName}} - {{account.data.accountName}}
                                </router-link>
                            </td>
                            <td class="px-2 py-3 border-gray-300 border-b">{{account.data.accountNumber}}</td>
                            <td class="px-2 py-3 border-gray-300 border-b">{{account.data.accountCurrency}}</td>
                            <td class="px-2 py-3 border-gray-300 border-b">
                                <router-link :to="{name: 'accounts.upload', params: {id: account.id}}" class="inline-flex items-center px-3 py-1 font-bold text-teal-700 text-sm border border-teal-700 rounded-full hover:bg-teal-700 hover:text-white" active-class="text-gray-900">
                                    <svg class="h-3 w-3 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12C1.55228 12 2 12.4477 2 13V17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H17C17.2652 18 17.5196 17.8946 17.7071 17.7071C17.8946 17.5196 18 17.2652 18 17V13C18 12.4477 18.4477 12 19 12C19.5523 12 20 12.4477 20 13V17C20 17.7957 19.6839 18.5587 19.1213 19.1213C18.5587 19.6839 17.7957 20 17 20H3C2.20435 20 1.44129 19.6839 0.87868 19.1213C0.31607 18.5587 0 17.7956 0 17V13C0 12.4477 0.447715 12 1 12Z" />
                                        <path d="M9.29289 0.292893C9.68342 -0.0976311 10.3166 -0.0976311 10.7071 0.292893L15.7071 5.29289C16.0976 5.68342 16.0976 6.31658 15.7071 6.70711C15.3166 7.09763 14.6834 7.09763 14.2929 6.70711L10 2.41421L5.70711 6.70711C5.31658 7.09763 4.68342 7.09763 4.29289 6.70711C3.90237 6.31658 3.90237 5.68342 4.29289 5.29289L9.29289 0.292893Z" />
                                        <path d="M10 0C10.5523 0 11 0.447715 11 1V13C11 13.5523 10.5523 14 10 14C9.44772 14 9 13.5523 9 13V1C9 0.447715 9.44772 0 10 0Z" />
                                    </svg>
                                    Upload PDF
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else class="bg-gray-100 text-center p-16">
                <p class="mb-4 text-gray-300">
                    <svg class="h-16 w-16 mx-auto" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5C9 4.44772 9.44772 4 10 4Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.83989 6.5442C7.36132 6.07017 8.04979 5.81818 8.75 5.81818H12.5C13.0523 5.81818 13.5 6.26589 13.5 6.81818C13.5 7.37046 13.0523 7.81818 12.5 7.81818H8.75C8.52196 7.81818 8.32018 7.90141 8.18524 8.02408C8.05346 8.14388 8 8.28479 8 8.40909C8 8.53338 8.05346 8.67429 8.18524 8.79409C8.32018 8.91676 8.52196 8.99999 8.75 8.99999H11.25C11.9502 8.99999 12.6387 9.25199 13.1601 9.72602C13.6847 10.2029 14 10.8713 14 11.5909C14 12.3105 13.6847 12.9789 13.1601 13.4558C12.6387 13.9298 11.9502 14.1818 11.25 14.1818H7C6.44772 14.1818 6 13.7341 6 13.1818C6 12.6295 6.44772 12.1818 7 12.1818H11.25C11.478 12.1818 11.6798 12.0986 11.8148 11.9759C11.9465 11.8561 12 11.7152 12 11.5909C12 11.4666 11.9465 11.3257 11.8148 11.2059C11.6798 11.0832 11.478 11 11.25 11H8.75C8.04979 11 7.36132 10.748 6.83989 10.274C6.31529 9.79705 6 9.12866 6 8.40909C6 7.68951 6.31529 7.02112 6.83989 6.5442Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 2C2.44772 2 2 2.44772 2 3V17C2 17.5523 2.44772 18 3 18H17C17.5523 18 18 17.5523 18 17V3C18 2.44772 17.5523 2 17 2H3ZM0 3C0 1.34315 1.34315 0 3 0H17C18.6569 0 20 1.34315 20 3V17C20 18.6569 18.6569 20 17 20H3C1.34315 20 0 18.6569 0 17V3Z" />
                    </svg>
                </p>
                <p>There are no bank accounts added yet.</p>
                <p>
                    <router-link :to="{name: 'accounts.new'}" class="font-bold text-indigo-500 hover:text-indigo-700">Add One</router-link>.
                </p>
            </div>
        </main>
    </app-layout>
</template>

<script>
    import {formatMoney} from "../../utils/money";
    import {mapGetters} from 'vuex'
    import AppLayout from "../../layouts/AppLayout";

    export default {
        components: {AppLayout},
        computed: {
            ...mapGetters({
                get: 'accounts/GET',
            }),
            accounts() {
                return this.get({orderBy: 'name', order: 'asc'});
            }
        },
        methods: {
            format(m) {
                return formatMoney(m);
            }
        }
    }
</script>