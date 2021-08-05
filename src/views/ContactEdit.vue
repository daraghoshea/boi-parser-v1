<template>
    <app-layout>
        <template #header>
            <h1>Edit Contact</h1>
            <p class="ml-auto">

                <router-link :to="{name: 'contacts'}" class="text-bold text-gray-600 hover:text-gray-800">
                    &laquo; Contacts
                </router-link>
            </p>
        </template>

        <main class="">
            <div v-if="error" class="bg-red-100 text-red-800 p-6 w-full text-center">
                {{error}}
            </div>
            <contact-form v-else :contact="contact" :save="save"></contact-form>
        </main>
    </app-layout>
</template>

<script>
    import AppLayout from "../layouts/AppLayout";
    import ContactForm from "../forms/ContactForm";
    import {mapGetters, mapActions} from "vuex"

    export default {
        components: {ContactForm, AppLayout},
        created() {
            this.fetch()
        },
        watch: {
            '$route': 'fetch'
        },
        computed: {
            ...mapGetters({
                find: 'contacts/FIND_BY_ID'
            })
        },
        data() {
            return {
                error: null,
                contact: null
            }
        },
        methods: {
            ...mapActions({
                saveContact: 'contacts/SAVE_CONTACT'
            }),
            fetch() {
                this.error = this.contact = null;
                this.contact = this.find(
                    Number.parseInt(this.$route.params.id)
                );
                this.contact.company = this.contact.company || {};

                if(!this.contact) {
                    this.error = `Cannot find contact with id '${this.$route.params.id}'`;
                }
            },
            save(contact) {
                return this.saveContact(contact)
                    .then( () => {
                        return 'Saved'
                    })
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