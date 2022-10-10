<template>
    <div class="relative">
        <label :for="domId" class="form-label text-sm leading-5 font-medium text-gray-600">{{label}}</label>
        <div class="mt-1 relative rounded-md shadow-sm w-full">
            <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <slot name="icon">
                    <svg class="h-3 w-3" :class="[value?.length ? 'text-white': 'text-gray-500']" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 6V19H3V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M23 1H1V6H23V1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 10H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </slot>
            </div>
            <input ref="input"
                   :id="domId"
                   class="form-input block pl-8 pr-16 w-64 sm:text-sm sm:leading-5"
                   :class="{'bg-teal-500 text-white': value.length > 0}"
                   :value="inputValue"
                   placeholder="All"
                   data-target
                   @keydown.esc="close"
                   @focus="open"
            />
            <button v-if="value.length" @click="selectAll" type="button" class="absolute inset-y-0 right-0 pr-3">
                <svg class="h-4 w-4 text-white" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 8L8 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 8L14 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <transition name="slide-down">
            <dropdown :open="isOpen" @close="close" class="w-full">
                <div class="py-2 border-b border-gray-200 w-full">
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
                <div class="py-2 h-64 overflow-y-auto overflow-x-hidden">
                    <button v-for="category in categories"
                            :key="category.id"
                            @click="toggleSelect(category.id)"
                            class="appearance-none outline-none w-full flex items-center px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            :class="{selected: isSelected(category.id)}"
                    >
                        {{category.name}}
                        <svg v-if="isSelected(category.id)" class="ml-auto h-2 w-auto" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
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

    export default {
        components: { Dropdown },
        props: {
            value: {},
            label: {
                type: String,
                default: "Categories"
            },
            domId: {
                type: String,
                default: "categories-select"
            },
            icon: {
                type: Boolean,
                default: true
            },
            categories: {
                type: Array,
                default: () => []
            }
        },
        computed: {
            isSelected() {
                return id => includes(this.selected, id)
            },
            inputValue() {
                if( ! this.value || ! this.value.length ) {
                    return 'All'
                }
                if( this.value === 'none') {
                    return 'Blanks'
                }
                const firstCategory = this.categories.find(cat => cat.id === this.value[0]);

                if( this.value?.length > 1 ) {
                    const more = this.value.length -1;
                    return `${firstCategory.name} and ${more} more`;
                }

                return firstCategory.name;
            }
        },
        data() {
            return {
                isOpen: false,
                selected: []
            }
        },
        created() {
          window.console.log(this.value)
        },
        methods: {
            selectAll() {
                this.selected = [];
                this.$emit('input', this.selected);
                this.close();
            },
            selectNone() {
                this.selected = [];
                this.$emit('input', 'none');
                this.close();
            },
            toggleSelect(id) {
                this.isSelected(id) ? this.deselect(id) : this.select(id)
            },
            select(id) {
                this.selected.push(id);
                this.$emit('input', this.selected);
            },
            deselect(id) {
                this.selected.splice(this.selected.findIndex(v => v === id), 1);
                this.$emit('input', this.selected);
            },
            open() {
                this.isOpen = true;
                this.$emit('open')
            },
            close() {
                this.isOpen = false;
                this.$emit('close')
            },
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
</style>