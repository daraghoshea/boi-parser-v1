<template>

    <div class="contact-container relative">
        <div v-if="contact" class="flex items-center">
            {{contact.company.name}}
            <button class="ml-auto invisible group-hover:visible h-5 w-5 rounded-full bg-transparent text-teal-500 hover:bg-teal-500 hover:text-white text-sm font-bold focus:bg-teal-500 focus:text-white focus:outline-none ml-2 cursor-pointer"
                    type="button"
                    @click.stop="onDeselect">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        </div>

        <input v-else
               type="text"
               ref="input"
               @keyup.esc="editing=false"
               @keyup.up="highlightPrev"
               @keyup.down="highlightNext"
               @keyup.enter="highlightSelect"
               @keydown.tab="highlightSelect"
               @focus="edit"
               @blur="end"
               @click.stop="()=>{}"
               v-model.trim="text"
               placeholder="No contact"
               class="bg-transparent font-gray-700 italic pb-1 mb-1 w-full outline-none border-b-2 border-transparent transition-all duration-700 ease-linear focus:border-teal-500"
        />

        <transition name="slide-down">
            <dropdown :open="isDropdownOpen">
                <ul class="contact-dropdown-list bg-white h-64 overflow-y-auto">
                    <li @click="editing = false" :class="{highlighted: text.trim() == ''}">
                      None
                    </li>
                    <li v-for="(contact, index) in filteredContacts" :key="contact.id" @click="onSelect(contact.id)" :class="{ highlighted: (text.trim() !== '' && index === highlighted) }">
                        {{contact.company.name}}
                    </li>
                    <li v-if="text.length" @click="onCreate" :class="{highlighted: highlighted === filteredContacts.length}">
                        <em>Create</em> "<span class="font-bold">{{text}}</span>"
                    </li>
                </ul>
            </dropdown>
        </transition>
    </div>

</template>
<script>
    import {mapActions, mapGetters} from 'vuex'
    import {stringRegex} from "../../utils";
    import Dropdown from "../utilities/Dropdown";

    export default {
        components: {Dropdown},
        props: {
            transaction: {
                type: Object,
                required: true
            }
        },
        computed: {
            ...mapGetters({
                findTransaction: 'transactions/FIND_BY_ID',
                contactFind: 'contacts/FIND_BY_ID',
                getContacts: 'contacts/GET'
            }),
            contacts() {
                return this.getContacts()
            },
            isDropdownOpen() {
                return this.editing;
                // return this.text.length && this.editing;
            },
            filteredContacts() {
                if( ! this.text.length ) {
                    return this.contacts;
                }
                return this.contacts.filter( contact => {
                    return contact.company.name && contact.company.name.match( stringRegex(this.text) )
                });
            }
        },
        data() {
            return {
                contact: null,
                text: "",
                timeout: null,
                focusInput: false,
                editing: false,
                highlighted: 0
            }
        },
        watch: {
            transaction: {
                deep: true,
                handler(value) {
                    value.contact && this.fetchContact(value.contact)
                }
            }
        },
        mounted() {
            this.fetchContact();
        },
        updated() {
            if( this.focusInput ) {
                this.$refs.input && this.$refs.input.focus()
                this.focusInput = false;
            }
        },
        methods: {
            ...mapActions({
                create: 'contacts/SAVE_CONTACT',
                select: 'transactions/SET_CONTACT',
            }),
            fetchContact() {
                this.contact = this.transaction.contact && this.contactFind(this.transaction.contact);
            },
            edit() {
                this.editing = true;
                this.timeout && clearTimeout(this.timeout);
                this.highlighted = Math.min(this.highlighted, this.filteredContacts.length );
                this.focusInput = true;
            },
            end() {
                this.timeout = window.setTimeout(() => {
                    this.editing = false;
                    this.text = ""
                }, 2000)
            },
            onCreate() {
                this.create({
                    company: {
                        name: this.text
                    },
                    people: []
                }).then( newId => this.onSelect(newId) )
            },
            onSelect(contactId) {
                this.select({
                    id: this.transaction.id,
                    contact: contactId
                }).then(() => {
                    this.editing = false;
                    this.text = "";
                    this.$emit('transaction-contact-selected', { transaction: this.transaction.id, contact: contactId})
                })
            },
            onDeselect() {
                this.select({
                    id: this.transaction.id,
                    contact: null
                }).then(() => {
                    this.contact = null;
                    this.edit()
                })
            },
            highlightPrev() {
                this.highlighted += (this.highlighted > 0) ? -1 : 0;
            },
            highlightNext() {
                this.highlighted += (this.highlighted >= this.filteredContacts.length) ? 0 : 1;
            },
            highlightSelect() {
                // create
                if(this.text.trim() === '') {
                  this.editing = false;
                  return;
                }

                if( this.highlighted >= this.filteredContacts.length ) {
                    this.onCreate()
                }
                // select
                else {
                    this.onSelect( this.filteredContacts[this.highlighted].id )
                }
            }
        }
    }
</script>

<style scoped>
    .contact-container,
    .contact-dropdown-list {
        min-width: 168px
        @apply w-full bg-white z-10
    }

    .contact-dropdown-list li {
        @apply bg-gray-100 p-2 w-full
    }
    .contact-dropdown-list li:hover {
        @apply bg-gray-300 cursor-pointer
    }

    li.highlighted {
        @apply bg-blue-600 text-white
    }
    li.highlighted:hover {
        @apply bg-blue-800 text-white
    }
</style>