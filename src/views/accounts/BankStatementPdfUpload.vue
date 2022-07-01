<template>
    <app-layout>
        <template #header>
            <h1>
                Statement Upload <span v-if="account"> - {{account.data.accountName}}</span>
            </h1>
            <p class="ml-auto">

                <router-link :to="{name: 'accounts'}" class="text-bold text-gray-600 hover:text-gray-800">
                    &laquo; Accounts
                </router-link>
            </p>
        </template>

        <main class="">
            <section v-if="error" class="p-6 bg-red-100">
                {{error}}

                <button type="button" @click="error = null">Try Again</button>
            </section>
            <section v-else class="p-6 bg-gray-100">
                <p class="text-gray-700 text-center mb-8 text-lg">Here you can upload a PDF statement from <br><strong>{{account.data.bankName}}</strong> for your
                    <strong>{{account.data.accountName}}</strong> account which is in <strong>{{account.data.accountCurrency}}</strong> currency.

                </p>
                <pdf-input class="text-center" @uploaded="onUpload"></pdf-input>
                <p class="text-gray-500 text-center pt-6">
                    You can select more than one file at a time.
                </p>
            </section>
        </main>
    </app-layout>
</template>

<script>
    import PdfInput from "../../components/forms/PdfInput";
    import {mapGetters,mapActions} from 'vuex'
    import AppLayout from "../../layouts/AppLayout";

    export default {
        components: {AppLayout, PdfInput},
        data() {
            return {
                uploading: true,
                processing: false,
                error: null,
                account: null
            }
        },
        computed: {
            ...mapGetters({
                fetchAccount: 'accounts/FIND_BY_ID'
            }),
        },
        created() {
            this.account = this.fetchAccount(
                Number.parseInt(this.$route.params.id)
            );

            if( ! this.account ) {
                this.error = `Could not find account with id ${this.$route.params.id}`
            }
        },
        methods: {
            ...mapActions({
                addFiles: 'statements/ADD_MULTIPLE'
            }),
            onUpload(files) {
                this.processing = true;

                // TODO - show progress of upload (reader)

                this.addFiles({
                    files,
                    accountId: this.account.id
                })
                    .then(() => {
                        // TODO - stay and show progress?
                        this.$router.push({name: 'accounts.statements', params: {id: this.account.id}});
                    })
                    .catch((reason) => {
                        this.error = reason.message;
                    })
            }
        }
    }
</script>