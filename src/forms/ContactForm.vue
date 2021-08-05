<template>
    <form @submit.prevent="onSubmit" class="max-w-2xl">
        <fieldset :disabled="saving">
            <div class="grid grid-cols-2 gap-16">
                <div>
                    <h2>Company</h2>
                    <label for="company-name">Contact Name</label>
                    <input id="company-name"
                           v-model.trim="form.company.name"
                           class="appearance-none bg-transparent border-none w-full bg-gray-100 text-gray-700 my-1 p-2 leading-tight focus:outline-none" type="text" placeholder="Company Name" aria-label="Company Name">

                    <label for="company-address" class="mt-6">Address</label>
                    <resizeable-textarea>
                        <textarea id="company-address"
                                  v-model="form.company.address"
                                  rows="3"
                                  class="resize-none appearance-none bg-transparent border-none w-full bg-gray-100 text-gray-700 my-1 p-2 leading-tight focus:outline-none" type="text" placeholder="Company Address" aria-label="Company Address"></textarea>
                    </resizeable-textarea>

                    <h2 class="mt-6">Financial</h2>
                    <label for="tax-rate">Default Tax Rate</label>
                    <input id="tax-rate"
                           v-model="form.company.tax"
                           class="inline-block w-16 rounded-l text-right appearance-none bg-transparent border-none bg-gray-100 text-gray-700 my-1 p-2 leading-tight focus:outline-none" type="text" placeholder="0" aria-label="Tax Rate">
                    <span class="bg-gray-300 text-gray-800 rounded-r p-2 leading-none">%</span>


                </div>

                <div class="">
                    <h2>People</h2>
                    <label for="person-name">Primary Contact</label>
                    <div class="mb-6" v-for="(person, ix) in form.people" :key="ix">
                        <input :id="`person-name-${ix}`" v-model="person.name" class="appearance-none bg-transparent border-none w-full bg-gray-100 text-gray-700 my-1 p-2 leading-tight focus:outline-none" type="text" placeholder="Person Name" aria-label="Person Name">
                        <input :id="`person-email-${ix}`" v-model="person.email" class="appearance-none bg-transparent border-none w-full bg-gray-100 text-gray-700 my-1 p-2 leading-tight focus:outline-none" type="text" placeholder="Person Email" aria-label="Person Email">
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-end border-t border-gray-300 mt-12 pt-12">
                <router-link v-if="!saving" :to="{name: 'contacts'}" class="text-bold text-gray-600 hover:text-gray-800 mr-12">
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
        </fieldset>
    </form>
</template>

<script>
    import ResizeableTextarea from "../components/forms/ResizeableTextarea";

    export default {
        components: {ResizeableTextarea},
        props: {
            contact: {
                type: Object,
                default: () => {
                    return {
                        id: null,
                        company: {
                            name: "",
                            address: "",
                            tax: ""
                        },
                        people: []
                    }
                }
            },
            button: {
                type: String,
                default: "Save"
            },
            save: {
                type: Function
            }
        },
        data() {
            return {
                form: {},
                saving: false
            }
        },
        methods: {
            addPerson() {
                this.form.people.push({
                    name: "",
                    email: ""
                })
            },
            onSubmit() {
                if( this.saving ) {
                    return;
                }

                const contact = {...this.form};
                this.saving = true;

                contact.people = contact.people.filter( p => {
                    return p.name !== ""
                });

                // this.$emit('save', contact);
                this.save(contact)
                    .then(() => {
                        this.$router.push({name: 'contacts'})
                    })
            },
            saved() {

            }
        },
        created() {
            this.form = {...this.contact};
            if( ! this.form.people.length ) {
                this.addPerson()
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