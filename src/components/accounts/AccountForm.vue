<template>
    <form @submit.prevent="onSubmit" class="max-w-md mx-auto">
        <fieldset :disabled="saving">

            <h2 class="mb-12">Account Details</h2>

            <label for="bank-name">Bank Name</label>
            <input id="bank-name"
                   v-model.trim="form.data.bankName"
                   class="mb-6 appearance-none bg-transparent border-none w-full bg-gray-100 text-gray-700 my-1 p-2 leading-tight focus:outline-none" type="text" placeholder="Company Name" aria-label="Company Name">

            <label for="account-name">Account Name</label>
            <input id="account-name"
                   v-model.trim="form.data.accountName"
                   class="mb-6 appearance-none bg-transparent border-none w-full bg-gray-100 text-gray-700 my-1 p-2 leading-tight focus:outline-none" type="text" placeholder="Account Name" aria-label="Account Name">

            <label for="account-number">Account Number</label>
            <input id="account-number"
                   v-model.trim="form.data.accountNumber"
                   class="mb-6 appearance-none bg-transparent border-none w-full bg-gray-100 text-gray-700 my-1 p-2 leading-tight focus:outline-none" type="text" placeholder="Account Number" aria-label="Account Number">

            <label for="account-currency">Account Currency</label>
            <input id="account-currency"
                   v-model.trim="form.data.accountCurrency"
                   class="mb-6 appearance-none bg-transparent border-none w-24 bg-gray-100 text-gray-700 my-1 p-2 leading-tight focus:outline-none" type="text" placeholder="Account Currency" aria-label="Account Currency">


        </fieldset>
        <div class="flex items-center justify-end border-t border-gray-300 mt-12 pt-12">
            <router-link v-if="!saving" :to="{name: 'accounts'}" class="text-bold text-gray-600 hover:text-gray-800 mr-12">
                Cancel
            </router-link>
            <button
                type="submit"
                class="inline-flex items-center px-5 py-3 text-white font-bold rounded-lg" :class="[saving ? 'bg-indigo-300 cursor-default' : 'bg-indigo-600 hover:bg-indigo-700']" :disabled="saving">
                    <span v-if="saving">
                        <svg class="h-4 w-4 loading-spinner my-1 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                    </span>
                    <span v-else>{{this.button}}</span>
            </button>
        </div>
    </form>
</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        props: {
            account: {
                type: Object,
                default: () => {
                    return {
                        id: null,
                        data: {
                            bankName: "",
                            accountName: "",
                            accountNumber: "",
                            accountCurrency: ""
                        }
                    }
                }
            },
            button: {
                type: String,
                default: "Save Account"
            }
        },
        created() {
            this.form = {...this.account};
        },
        data() {
            return {
                form: {},
                saving: false
            }
        },
        methods: {
            ...mapActions({
                save: 'accounts/SAVE'
            }),
            onSubmit() {
                if( this.saving ) {
                    return;
                }

                const account = {...this.form};
                this.saving = true;

                this.save({ id: account.id, account })
                    .then(response => this.$emit('saved', response))
                    .catch(reason => this.$emit('error', reason))
                    .finally( () => this.saving = false )
            }
        }
    }
</script>

<style scoped>
    h2 {
        @apply text-indigo-600 mb-4
    }
    label {
        @apply uppercase text-xs text-gray-600 block
    }
    .loading-spinner {
        animation:spin 2s linear infinite;
    }
</style>