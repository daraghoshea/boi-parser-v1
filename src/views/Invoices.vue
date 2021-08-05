<template>
    <app-layout>
        <template #header>
            <h1>Invoices</h1>
            <p class="ml-auto">
                <router-link :to="{name: 'invoices.new'}" class="inline-flex items-center p-3 bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-lg leading-none text-sm">
                    <svg class="h-3 w-3 mr-2" viewBox="0 0 18 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.87868 0.87868C1.44129 0.31607 2.20435 0 3 0H11C11.2652 0 11.5196 0.105357 11.7071 0.292893L17.7071 6.29289C17.8946 6.48043 18 6.73478 18 7V19C18 19.7957 17.6839 20.5587 17.1213 21.1213C16.5587 21.6839 15.7957 22 15 22H3C2.20435 22 1.44129 21.6839 0.87868 21.1213C0.31607 20.5587 0 19.7957 0 19V3C0 2.20435 0.31607 1.44129 0.87868 0.87868ZM3 2C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20H15C15.2652 20 15.5196 19.8946 15.7071 19.7071C15.8946 19.5196 16 19.2652 16 19V7.41421L10.5858 2H3Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11 0C11.5523 0 12 0.447715 12 1V6H17C17.5523 6 18 6.44772 18 7C18 7.55228 17.5523 8 17 8H11C10.4477 8 10 7.55228 10 7V1C10 0.447715 10.4477 0 11 0Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 12C4 11.4477 4.44772 11 5 11H13C13.5523 11 14 11.4477 14 12C14 12.5523 13.5523 13 13 13H5C4.44772 13 4 12.5523 4 12Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 16C4 15.4477 4.44772 15 5 15H13C13.5523 15 14 15.4477 14 16C14 16.5523 13.5523 17 13 17H5C4.44772 17 4 16.5523 4 16Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 8C4 7.44772 4.44772 7 5 7H7C7.55228 7 8 7.44772 8 8C8 8.55228 7.55228 9 7 9H5C4.44772 9 4 8.55228 4 8Z" />
                    </svg>
                    New Invoice
                </router-link>
            </p>
        </template>
        <main>
            <table v-if="collection.items.length" class="mx-auto w-full">
                <thead>
                    <tr class="align-bottom">
                        <th class="p-2 text-center border-gray-300 border-b">Number</th>
                        <th class="p-2 text-left border-gray-300 border-b">Date</th>
                        <th class="p-2 text-left border-gray-300 border-b">Recipient</th>
                        <th class="p-2 text-right border-gray-300 border-b">Subtotal</th>
                        <th class="p-2 text-right border-gray-300 border-b">Tax</th>
                        <th class="p-2 text-right border-gray-300 border-b">Total</th>
                        <th class="p-2 text-center border-gray-300 border-b">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="invoice in collection.items" :key="invoice.id">
                        <td class="px-2 py-3 border-gray-300 border-b text-center font-number">
                            <router-link :to="{name: 'invoices.edit', params: {id: invoice.id}}" class="font-semibold text-indigo-500 hover:text-indigo-700">
                                {{padStart(invoice.data.number,4,'0')}}
                            </router-link>
                        </td>
                        <td class="px-2 py-3 border-gray-300 border-b">{{invoice.data.date}}</td>
                        <td class="px-2 py-3 border-gray-300 border-b">{{invoice.contact ? invoice.contact.company.name : 'No company' }}</td>
                        <td class="px-2 py-3 border-gray-300 border-b text-right font-number bg-gray-100">{{format(invoice.totals.subtotal)}}</td>
                        <td class="px-2 py-3 border-gray-300 border-b text-right font-number">{{format(invoice.totals.tax)}}</td>
                        <td class="px-2 py-3 border-gray-300 border-b text-right font-semibold font-number bg-gray-100">{{format(invoice.totals.total)}}</td>
                        <td class="px-2 py-3 border-gray-300 border-b text-center">
                            <span class="bg-gray-300 text-gray-700 py-1 px-2 rounded-full text-xs">
                                {{invoice.status}}
                            </span>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3"></td>
                        <td class="px-2 py-3 text-right font-number border-gray-400 border-b-2 bg-gray-100">
                            {{format(collection.subtotal)}}
                        </td>
                        <td class="px-2 py-3 text-right font-number border-gray-400 border-b-2 ">
                            {{format(collection.tax)}}
                        </td>
                        <td class="px-2 py-3 text-right font-number font-bold border-gray-400 border-b-2 bg-gray-100">
                            {{format(collection.total)}}
                        </td>
                    </tr>
                </tfoot>
            </table>

            <section v-else class="p-6 bg-gray-100 text-center">
                <p class="text-center mb-4">
                    <svg class="h-12 w-12 mx-auto text-gray-300" viewBox="0 0 18 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.87868 0.87868C1.44129 0.31607 2.20435 0 3 0H11C11.2652 0 11.5196 0.105357 11.7071 0.292893L17.7071 6.29289C17.8946 6.48043 18 6.73478 18 7V19C18 19.7957 17.6839 20.5587 17.1213 21.1213C16.5587 21.6839 15.7957 22 15 22H3C2.20435 22 1.44129 21.6839 0.87868 21.1213C0.31607 20.5587 0 19.7957 0 19V3C0 2.20435 0.31607 1.44129 0.87868 0.87868ZM3 2C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20H15C15.2652 20 15.5196 19.8946 15.7071 19.7071C15.8946 19.5196 16 19.2652 16 19V7.41421L10.5858 2H3Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11 0C11.5523 0 12 0.447715 12 1V6H17C17.5523 6 18 6.44772 18 7C18 7.55228 17.5523 8 17 8H11C10.4477 8 10 7.55228 10 7V1C10 0.447715 10.4477 0 11 0Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 12C4 11.4477 4.44772 11 5 11H13C13.5523 11 14 11.4477 14 12C14 12.5523 13.5523 13 13 13H5C4.44772 13 4 12.5523 4 12Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 16C4 15.4477 4.44772 15 5 15H13C13.5523 15 14 15.4477 14 16C14 16.5523 13.5523 17 13 17H5C4.44772 17 4 16.5523 4 16Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 8C4 7.44772 4.44772 7 5 7H7C7.55228 7 8 7.44772 8 8C8 8.55228 7.55228 9 7 9H5C4.44772 9 4 8.55228 4 8Z" />
                    </svg>
                </p>
                <p class="my-4">No invoices added yet.</p>
                <p>
                    <router-link :to="{name: 'invoices.new'}" class="inline-flex items-center p-3 bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-lg leading-none text-sm">
                        <svg class="h-3 w-3 mr-2" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C8.55228 0 9 0.447715 9 1V15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15V1C7 0.447715 7.44772 0 8 0Z" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 8C0 7.44772 0.447715 7 1 7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H1C0.447715 9 0 8.55228 0 8Z" />
                        </svg>

                        Add Invoice
                    </router-link>
                </p>
            </section>
        </main>
    </app-layout>
</template>

<script>
    import {formatMoney} from "../utils/money";
    import {padStart} from 'lodash'
    import {mapGetters} from 'vuex'
    import AppLayout from "../layouts/AppLayout";

    export default {
        components: {AppLayout},
        computed: {
            ...mapGetters({
                get: 'invoices/GET',
                getContactsByIds: 'contacts/FIND_BY_IDS'
            }),
            collection() {
                return this.get({orderBy: 'date', order: 'desc', loadContacts: true})
            }
        },
        methods: {
            padStart,
            format(m) {
                return formatMoney(m);
            }
        }
    }
</script>