<template>
    <app-layout>
        <template #header>
            <h1>New Bank Account</h1>
            <p class="ml-auto">

                <router-link :to="{name: 'accounts'}" class="text-bold text-gray-600 hover:text-gray-800">
                    &laquo; Accounts
                </router-link>
            </p>
        </template>

        <main class="">
            <account-form @saved="onSave" @error="onError"></account-form>
        </main>
    </app-layout>
</template>

<script>
    import AppLayout from "../../layouts/AppLayout";
    import {mapActions} from "vuex"
    import AccountForm from "../../components/accounts/AccountForm";

    export default {
        components: {AccountForm, AppLayout},
        methods: {
            ...mapActions({
                saveContact: 'contacts/SAVE_CONTACT'
            }),
            onSave() {
                this.$router.push({name: 'accounts'})
            },
            onError(message) {
                window.alert(message)
            }
        },
    }
</script>

<style scoped>
    h2 {
        @apply text-indigo-600 mb-4
    }
    label {
        @apply uppercase text-xs text-gray-500 block
    }
</style>