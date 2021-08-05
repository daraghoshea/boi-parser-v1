<template>
    <app-layout>
        <template #header>
            <h1>New Invoice</h1>
            <p class="ml-auto">

                <router-link :to="{name: 'invoices'}" class="text-bold text-gray-600 hover:text-gray-800 mr-3">
                    &laquo; Invoices
                </router-link>

                <button href="#0" class="inline-flex items-center px-3 py-2 border border-teal-600 text-teal-600 font-bold hover:text-teal-700 hover:border-teal-700 rounded-lg text-sm" @click.prevent="print">
                    <svg class="h-3 w-3 mr-2" viewBox="0 0 22 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 1C4 0.447715 4.44772 0 5 0H17C17.5523 0 18 0.447715 18 1V8C18 8.55228 17.5523 9 17 9C16.4477 9 16 8.55228 16 8V2H6V8C6 8.55228 5.55228 9 5 9C4.44772 9 4 8.55228 4 8V1Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 9C2.73478 9 2.48043 9.10536 2.29289 9.29289C2.10536 9.48043 2 9.73478 2 10V15C2 15.2652 2.10536 15.5196 2.29289 15.7071C2.48043 15.8946 2.73478 16 3 16H5C5.55228 16 6 16.4477 6 17C6 17.5523 5.55228 18 5 18H3C2.20435 18 1.44129 17.6839 0.87868 17.1213C0.31607 16.5587 0 15.7956 0 15V10C0 9.20435 0.31607 8.44129 0.87868 7.87868C1.44129 7.31607 2.20435 7 3 7H19C19.7957 7 20.5587 7.31607 21.1213 7.87868C21.6839 8.44129 22 9.20435 22 10V15C22 15.7957 21.6839 16.5587 21.1213 17.1213C20.5587 17.6839 19.7957 18 19 18H17C16.4477 18 16 17.5523 16 17C16 16.4477 16.4477 16 17 16H19C19.2652 16 19.5196 15.8946 19.7071 15.7071C19.8946 15.5196 20 15.2652 20 15V10C20 9.73478 19.8946 9.48043 19.7071 9.29289C19.5196 9.10536 19.2652 9 19 9H3Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 13C4 12.4477 4.44772 12 5 12H17C17.5523 12 18 12.4477 18 13V21C18 21.5523 17.5523 22 17 22H5C4.44772 22 4 21.5523 4 21V13ZM6 14V20H16V14H6Z" />
                    </svg>

                    Print
                </button>
            </p>
        </template>
        <main class="-mt-8 -mx-6 lg:-mt-12 lg:-mx-12 pt-12 pb-24 px-8 mx-auto pdf-wrapper h-full">
            <invoice-form :populate="populate" @saved="onSave"></invoice-form>
        </main>
        <toast v-if="toast.show" @hidden="toast.show = false">
            <div v-if="toast.type === 'success'" class="bg-teal-700 text-white p-8">
                {{toast.message}}
            </div>
        </toast>

    </app-layout>
</template>

<script>
    import Vue from 'vue'
    import moment from 'moment'
    import {mapActions} from 'vuex'
    import AppLayout from "../layouts/AppLayout";
    import InvoiceForm from "../components/invoices/InvoiceForm";
    import Toast from "../components/Toast";

    export default {
        components: {Toast, InvoiceForm, AppLayout },
        created() {
            this.populate = {
                number: this.$store.getters['invoices/NEXT_NUMBER'],
                date: moment().format('Do MMM YYYY'),
                due: moment().add(30, 'days').format('Do MMM YYYY')
            };
        },
        data() {
            return {
                toast: {
                    show: false,
                    message: true,
                    type: "success"
                }
            }
        },
        methods: {
            ...mapActions({
                saveInvoice: 'invoices/SAVE'
            }),
            onSave(newId) {
                this.toast.message = 'Saved'
                this.toast.show = true;
                Vue.nextTick(() => {
                    setTimeout(() => {
                        this.$router.push({name: 'invoices.edit', params: {id: newId}})
                    })
                })
            },
            onError(message) {
                window.alert(message)
            }
        }
    }
</script>

<style scoped>
    @media screen {
        input:not([disabled]), textarea:not([disabled]) {
            @apply bg-indigo-100 p-2
        }

        .pdf-wrapper {
            @apply bg-gray-100
        }

        .pdf-paper {
            @apply bg-white shadow-lg max-w-3xl p-8 mx-auto
        }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        .hide-screen {
            @apply hidden
        }
    }

    @media print {
        input:not([disabled]), textarea:not([disabled]) {
            @apply bg-transparent px-0
        }
        .pdf-paper {
            @apply p-16
        }
        .hide-print {
            @apply hidden
        }
    }
</style>