<template>
    <app-layout>
        <template #header>
            <h1>New Contact</h1>
            <p class="ml-auto">

                <router-link :to="{name: 'contacts'}" class="text-bold text-gray-600 hover:text-gray-800">
                    &laquo; Contacts
                </router-link>
            </p>
        </template>

        <main class="">
            <contact-form :save="onSave"></contact-form>
        </main>
    </app-layout>
</template>

<script>
    import AppLayout from "../layouts/AppLayout";
    import ContactForm from "../forms/ContactForm";
    import {mapActions} from "vuex"

    export default {
        components: {ContactForm, AppLayout},
        methods: {
            ...mapActions({
                saveContact: 'contacts/SAVE_CONTACT'
            }),
            onSave(contact) {
                this.saveContact(contact)
                    .then(() => {
                        this.$router.push({name: 'contacts'})
                    })
                    .catch( message => window.alert(message) )
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