<template>
    <app-layout>
        <template #header>
            <h1>Contacts</h1>
            <p class="ml-auto">
                <router-link :to="{name: 'contacts.new'}" class="inline-flex items-center p-3 bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-lg leading-none text-sm">
                    <svg class="h-3 w-3 mr-2" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C8.55228 0 9 0.447715 9 1V15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15V1C7 0.447715 7.44772 0 8 0Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 8C0 7.44772 0.447715 7 1 7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H1C0.447715 9 0 8.55228 0 8Z" />
                    </svg>

                    Add Contact
                </router-link>
            </p>
        </template>
        <main>
            <div class="mt-4">
                <!-- Basic Search -->
                <div class="flex">
                    <!-- Search Input -->
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <input ref="search" v-model="search" @keyup.esc.prevent="resetSearch" class="form-input block w-64 pl-2 pr-12 sm:text-sm sm:leading-5" :class="{'bg-teal-500 text-white font-bold': search.length}" placeholder="Search..." />
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <svg v-if="!search.length" class="h-3 w-3 text-gray-500" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M19 19L14.65 14.65" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <button v-else @click="resetSearch" type="button" class="appearance-none outline-none focus:outline-none">
                                <svg class="h-4 w-4 text-white" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M14 8L8 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M8 8L14 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <table v-if="contacts.length" class="min-w-full">
                <thead>
                    <tr>
                        <th class="lg:sticky bg-white shadow-md-bottom z-10 text-left p-3 border-b border-gray-300">Company Name</th>
                        <th class="lg:sticky bg-white shadow-md-bottom z-10 text-left p-3 border-b border-gray-300">People</th>
                        <th class="lg:sticky bg-white shadow-md-bottom z-10 text-center p-3 border-b border-gray-300">Invoices</th>
                        <th class="lg:sticky bg-white shadow-md-bottom z-10 text-right p-3 border-b border-gray-300">Invoices Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="contact in contacts"
                        :key="contact.id"
                        class="align-top">
                            <td class="p-3 border-b border-gray-300">
                                <router-link :to="{name: 'contacts.edit', params: { id: contact.id } }" class="font-semibold text-indigo-500 hover:text-indigo-700">
                                    {{contact.company.name}}
                                </router-link>
                            </td>
                            <td class="p-3 border-b border-gray-300">
                                <span v-if="contact.people.length">
                                    {{contact.people[0].name || contact.people[0]}} <br>
                                    <small v-if="contact.people[0].email" class="text-gray-500">{{contact.people[0].email}}</small>
                                </span>
                                <span v-else class="text-gray-500">No people</span>
                            </td>
                            <td class="p-3 border-b border-gray-300 text-center">
                                {{contactInvoices(contact.id).length}}
                            </td>
                            <td class="p-3 border-b border-gray-300 text-right">
                                {{formatMoney(contactInvoices(contact.id).subtotal)}}
                            </td>
                    </tr>
                </tbody>
            </table>
            <section v-else class="p-6 bg-gray-100 text-center">
                <p class="text-center mb-4">
                    <svg class="h-12 w-12 mx-auto text-gray-300" viewBox="0 0 24 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.46447 13.4645C2.40215 12.5268 3.67392 12 5 12H13C14.3261 12 15.5979 12.5268 16.5355 13.4645C17.4732 14.4021 18 15.6739 18 17V19C18 19.5523 17.5523 20 17 20C16.4477 20 16 19.5523 16 19V17C16 16.2044 15.6839 15.4413 15.1213 14.8787C14.5587 14.3161 13.7956 14 13 14H5C4.20435 14 3.44129 14.3161 2.87868 14.8787C2.31607 15.4413 2 16.2044 2 17V19C2 19.5523 1.55228 20 1 20C0.447715 20 0 19.5523 0 19V17C0 15.6739 0.526784 14.4021 1.46447 13.4645Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9 2C7.34315 2 6 3.34315 6 5C6 6.65685 7.34315 8 9 8C10.6569 8 12 6.65685 12 5C12 3.34315 10.6569 2 9 2ZM4 5C4 2.23858 6.23858 0 9 0C11.7614 0 14 2.23858 14 5C14 7.76142 11.7614 10 9 10C6.23858 10 4 7.76142 4 5Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.0318 12.88C19.1698 12.3453 19.7153 12.0237 20.25 12.1618C21.3227 12.4387 22.273 13.0641 22.9517 13.9397C23.6304 14.8152 23.9992 15.8914 24 16.9993L24 19C24 19.5523 23.5523 20 23 20C22.4477 20 22 19.5523 22 19L22 17.0007C22 17.0006 22 17.0008 22 17.0007C21.9994 16.3361 21.7782 15.6902 21.371 15.165C20.9638 14.6396 20.3936 14.2644 19.75 14.0982C19.2153 13.9602 18.8937 13.4148 19.0318 12.88Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0312 0.881962C15.1682 0.346936 15.713 0.0242632 16.248 0.161251C17.3236 0.436628 18.2768 1.06213 18.9576 1.93914C19.6383 2.81615 20.0078 3.89479 20.0078 5.005C20.0078 6.11521 19.6383 7.19385 18.9576 8.07086C18.2768 8.94787 17.3236 9.57337 16.248 9.84875C15.713 9.98574 15.1682 9.66307 15.0312 9.12804C14.8943 8.59301 15.2169 8.04824 15.752 7.91125C16.3973 7.74603 16.9692 7.37073 17.3777 6.84452C17.7861 6.31831 18.0078 5.67113 18.0078 5.005C18.0078 4.33887 17.7861 3.69169 17.3777 3.16548C16.9692 2.63928 16.3973 2.26398 15.752 2.09875C15.2169 1.96176 14.8943 1.41699 15.0312 0.881962Z" />
                    </svg>
                </p>
                <p class="my-4">No contacts added yet.</p>
                <p>
                    <router-link :to="{name: 'contacts.new'}" class="inline-flex items-center p-3 bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-lg leading-none text-sm">
                        <svg class="h-3 w-3 mr-2" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C8.55228 0 9 0.447715 9 1V15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15V1C7 0.447715 7.44772 0 8 0Z" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 8C0 7.44772 0.447715 7 1 7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H1C0.447715 9 0 8.55228 0 8Z" />
                        </svg>

                        Add Contact
                    </router-link>
                </p>
            </section>
        </main>
    </app-layout>
</template>
<script>
    import AppLayout from "../layouts/AppLayout";
    import {mapGetters} from 'vuex';
    import {formatMoney} from '../utils/money'

    export default {
        components: {AppLayout},
        computed: {
            ...mapGetters({
                getContacts: 'contacts/GET',
                getContactInvoices: 'invoices/FIND_BY_CONTACT_ID',

            }),
            contacts() {
                return this.search.length
                    ? this.getContacts({search: this.search})
                    : this.getContacts();
            }
        },
        data() {
            return {
                search: "",
                invoices: {}
            }
        },
        methods: {
            formatMoney,
            resetSearch() {
                this.search = ""
            },
            contactInvoices(id) {
                if( ! this.invoices[id] ) {
                    this.invoices[id] = this.getContactInvoices(id)
                }
                debugger // eslint-disable-line
                return this.invoices[id];
            }
        }
    }
</script>