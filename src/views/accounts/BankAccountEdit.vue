<template>
    <app-layout>
        <template #header>
            <h1>Edit Bank Account</h1>
            <p class="ml-auto">

                <router-link :to="{name: 'accounts'}" class="text-bold text-gray-600 hover:text-gray-800">
                    &laquo; Accounts
                </router-link>
            </p>
        </template>

        <main class="">
            <div v-if="error" class="bg-red-100 text-red-800 p-6 w-full text-center">
                {{error}}
            </div>
            <account-form v-else :account="account" @saved="onSave" @error="onError"></account-form>
        </main>
    </app-layout>
</template>

<script>
    import AppLayout from "../../layouts/AppLayout";
    import {mapGetters} from "vuex"
    import AccountForm from "../../components/accounts/AccountForm";

    export default {
        components: {AccountForm, AppLayout},
        created() {
            this.fetch()
        },
        watch: {
            '$route': 'fetch'
        },
        computed: {
            ...mapGetters({
                find: 'accounts/FIND_BY_ID'
            })
        },
        data() {
            return {
                error: null,
                account: null,
            }
        },
        methods: {
            fetch() {
                this.error = this.account = null;
                this.account = this.find(
                    Number.parseInt(this.$route.params.id)
                );

                if(!this.account) {
                    this.error = `Cannot find account with id '${this.$route.params.id}'`;
                }
            },
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