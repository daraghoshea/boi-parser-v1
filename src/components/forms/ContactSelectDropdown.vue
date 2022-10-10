<template>
    <div class="relative">
        <label :for="domId" class="form-label text-sm leading-5 font-medium text-gray-600">{{label}}</label>
        <div class="mt-1 relative rounded-md shadow-sm w-full">
            <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <slot name="icon">
                    <svg class="h-3 w-3" :class="[value.length ? 'text-white': 'text-gray-500']" viewBox="0 0 24 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.46447 13.4645C2.40215 12.5268 3.67392 12 5 12H13C14.3261 12 15.5979 12.5268 16.5355 13.4645C17.4732 14.4021 18 15.6739 18 17V19C18 19.5523 17.5523 20 17 20C16.4477 20 16 19.5523 16 19V17C16 16.2044 15.6839 15.4413 15.1213 14.8787C14.5587 14.3161 13.7956 14 13 14H5C4.20435 14 3.44129 14.3161 2.87868 14.8787C2.31607 15.4413 2 16.2044 2 17V19C2 19.5523 1.55228 20 1 20C0.447715 20 0 19.5523 0 19V17C0 15.6739 0.526784 14.4021 1.46447 13.4645Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9 2C7.34315 2 6 3.34315 6 5C6 6.65685 7.34315 8 9 8C10.6569 8 12 6.65685 12 5C12 3.34315 10.6569 2 9 2ZM4 5C4 2.23858 6.23858 0 9 0C11.7614 0 14 2.23858 14 5C14 7.76142 11.7614 10 9 10C6.23858 10 4 7.76142 4 5Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.0318 12.88C19.1698 12.3453 19.7153 12.0237 20.25 12.1618C21.3227 12.4387 22.273 13.0641 22.9517 13.9397C23.6304 14.8152 23.9992 15.8914 24 16.9993L24 19C24 19.5523 23.5523 20 23 20C22.4477 20 22 19.5523 22 19L22 17.0007C22 17.0006 22 17.0008 22 17.0007C21.9994 16.3361 21.7782 15.6902 21.371 15.165C20.9638 14.6396 20.3936 14.2644 19.75 14.0982C19.2153 13.9602 18.8937 13.4148 19.0318 12.88Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0312 0.881962C15.1682 0.346936 15.713 0.0242632 16.248 0.161251C17.3236 0.436628 18.2768 1.06213 18.9576 1.93914C19.6383 2.81615 20.0078 3.89479 20.0078 5.005C20.0078 6.11521 19.6383 7.19385 18.9576 8.07086C18.2768 8.94787 17.3236 9.57337 16.248 9.84875C15.713 9.98574 15.1682 9.66307 15.0312 9.12804C14.8943 8.59301 15.2169 8.04824 15.752 7.91125C16.3973 7.74603 16.9692 7.37073 17.3777 6.84452C17.7861 6.31831 18.0078 5.67113 18.0078 5.005C18.0078 4.33887 17.7861 3.69169 17.3777 3.16548C16.9692 2.63928 16.3973 2.26398 15.752 2.09875C15.2169 1.96176 14.8943 1.41699 15.0312 0.881962Z" />
                    </svg>
                </slot>
            </div>
            <input ref="input"
                   :id="domId"
                   class="form-input block pl-8 pr-16 w-64 sm:text-sm sm:leading-5"
                   :class="{'bg-teal-500 text-white': value.length && ! this.isOpen}"
                   v-model="inputValue"
                   placeholder="All"
                   data-target
                   @keydown.esc="close"
                   @keyup.up="highlightPrev"
                   @keyup.down="highlightNext"
                   @keyup.enter="highlightSelect"
                   @keydown.tab="highlightSelect"
                   @focus="open"
                   @blur="onBlur"
                   autocomplete="off"
            />
            <button v-if="value.length" @click="selectAll" type="button" class="absolute inset-y-0 right-0 pr-3">
                <svg class="h-4 w-4 text-white" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 8L8 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 8L14 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <transition>
            <dropdown :open="isOpen" @close="close" class="w-full relative">
                <div class="py-1 border-b border-gray-200 w-full" v-if="!filter.length">
                    <button type="button"
                            @click="selectAll"
                            class="font-semibold appearance-none outline-none focus:outline-none w-full block px-4 py-2 text-sm leading-5 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">
                        All
                    </button>
                    <button type="button"
                            @click="selectNone"
                            class="font-semibold appearance-none outline-none focus:outline-none w-full block px-4 py-2 text-sm leading-5 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            :class="{selected: value === 'none'}">
                        Blanks
                    </button>
                </div>
                <div class="py-1 h-64 overflow-y-auto overflow-x-hidden">
                    <button v-for="(contact,index) in filteredContacts"
                            :key="contact.id"
                            @click="toggleSelect(contact.id)"
                            class="appearance-none outline-none w-full flex items-center px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            :class="{
                                selected: isSelected(contact.id),
                                highlighted: index === highlighted
                            }"
                    >
                        {{contact.company.name}}
                        <svg v-if="isSelected(contact.id)" class="ml-auto h-2 w-auto" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 1L6 12L1 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </dropdown>
        </transition>
    </div>
</template>

<script>
    import Dropdown from '../utilities/Dropdown';
    import {includes} from 'lodash';
    import {stringRegex} from "../../utils";

    export default {
        components: { Dropdown },
        props: {
            value: {},
            label: {
                type: String,
                default: "Contacts"
            },
            domId: {
                type: String,
                default: "contacts-select"
            },
            icon: {
                type: Boolean,
                default: true
            },
            contacts: {
                type: Array,
                default: () => []
            }
        },
        computed: {
            isSelected() {
                return id => includes(this.selected, id)
            },
            filteredContacts() {
                if( ! this.filter.length ) {
                    return this.contacts;
                }
                return this.contacts.filter(c => {
                    return c.company.name.match(stringRegex(this.filter));
                })
            },
            selectedSummary() {
                if( ! this.value || ! this.value.length ) {
                    return 'All'
                }
                if( this.value === 'none') {
                    return 'Blanks'
                }
                const firstContact = this.contacts.find(cat => cat.id === this.value[0]);

                if( this.value.length > 1 ) {
                    const more = this.value.length -1;
                    return `${firstContact.company.name} and ${more} more`;
                }

                return firstContact.company.name;
            }
        },
        data() {
            return {
                isOpen: false,
                inputValue: this.value,
                filter: "",
                selected: [],
                highlighted: 0
            }
        },
        mounted() {
            this.inputValue = this.selectedSummary;
        },
        watch: {
            inputValue(value) {
                if(this.isOpen) {
                    this.filter = value;
                }
            },
            value() {
                if(!this.isOpen) {
                    this.inputValue = this.selectedSummary;
                }
            },
        },
        methods: {
            selectAll() {
                this.selected = [];
                this.$emit('input', this.selected);
                this.close();
            },
            selectNone() {
                this.selected = [];
                this.close();
                this.$emit('input', 'none');
            },
            toggleSelect(id) {
                this.isSelected(id) ? this.deselect(id) : this.select(id)
            },
            select(id) {
                this.selected.push(id);
            },
            deselect(id) {
                this.selected.splice(this.selected.findIndex(v => v === id), 1);
            },
            open() {
                this.isOpen = true;
                this.$refs.input.select();
                this.$emit('open')
            },
            close() {
                this.isOpen = false;
                this.filter = "";
                this.inputValue = this.selectedSummary;
                this.$emit('input', this.selected);
                this.$emit('close')
            },
            onBlur() {
                if( ! this.isOpen ) {
                    this.inputValue = this.selectedSummary;
                }
            },
            highlightPrev() {
                this.highlighted += (this.highlighted > 0) ? -1 : 0;
            },
            highlightNext() {
                this.highlighted += (this.highlighted >= this.contacts.length) ? 0 : 1;
            },
            highlightSelect() {
                this.select( this.contacts[this.highlighted].id )
            }
        }
    }
</script>

<style scoped>
    .selected {
        @apply text-teal-700;
    }
    .selected:hover {
        @apply text-teal-500;
    }
    .highlighted {
        @apply bg-blue-600 text-white
    }
    .highlighted:hover {
        @apply bg-blue-800 text-white
    }
</style>