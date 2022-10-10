<template>

    <div class="category-container relative">
        <span v-if="category" class="flex items-center">
            {{category.name}}
            <button class="ml-auto invisible group-hover:visible h-5 w-5 rounded-full bg-transparent text-teal-500 hover:bg-teal-500 hover:text-white text-sm font-bold focus:bg-teal-500 focus:text-white focus:outline-none ml-2 cursor-pointer"
                    type="button"
                    @click.stop="onDeselect">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        </span>

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
               placeholder="No category"
               class="bg-transparent font-gray-700 italic pb-1 mb-1 w-full outline-none border-b-2 border-transparent transition-all duration-700 ease-linear focus:border-teal-500"
        />

        <transition name="fade">
            <p v-if="error" class="text-sm text-red-500">
                {{error}}
            </p>
        </transition>

        <transition name="slide-down">
            <dropdown :open="isDropdownOpen">
                <ul class="category-dropdown-list">
                    <li v-for="(cat, index) in filteredCategories" :key="cat.id" @click="onSelect(cat.id)" :class="{highlighted: index === highlighted}">
                        {{cat.name}} <span v-if="cat.code" class="text-gray-300 ml-2">{{cat.code}}</span>
                    </li>
                    <li v-if="text.length" @click="onCreate" :class="{highlighted: highlighted === filteredCategories.length}">
                        <em>Create</em> "<span class="font-bold">{{text}}</span>"
                    </li>
                </ul>
            </dropdown>
        </transition>
    </div>

</template>
<script>
    import {mapActions, mapGetters} from 'vuex'
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
                categoryFind: 'categories/FIND_BY_ID',
                categoryFindByName: 'categories/FIND_BY_NAME',
                categories: 'categories/ALL'
            }),
            isDropdownOpen() {
                return this.editing;
            },
            filteredCategories() {
                if( ! this.text.length ) {
                    return [];
                }
                return this.categories.filter( (cat) => {
                    let regex = new RegExp(this.text, 'gi'),
                        nameMatch = cat.name && cat.name.match(regex),
                        codeMatch = cat.code && cat.code.match(regex);

                    return nameMatch || codeMatch;
                });
            }
        },
        data() {
            return {
                category: null,
                text: "",
                timeout: null,
                focusInput: false,
                editing: false,
                highlighted: 0,
                error: ""
            }
        },
        watch: {
            transaction: {
                deep: true,
                handler(value) {
                    this.fetchCategory(value.category)
                }
            },
            error(newVal) {
                newVal && setTimeout(() => {
                    this.error = ""
                }, 2500)
            }
        },
        mounted() {
            this.fetchCategory(this.transaction.category);
        },
        updated() {
            if( this.focusInput ) {
                this.$refs.input && this.$refs.input.focus()
                this.focusInput = false;
            }
        },
        methods: {
            ...mapActions({
                create: 'categories/ADD',
                select: 'transactions/SET_CATEGORY',
                deselect: 'transactions/DELETE_CATEGORY'
            }),
            fetchCategory() {
                this.category = this.transaction.category && this.categoryFind(this.transaction.category);
            },
            edit() {
                this.editing = true;
                this.timeout && clearTimeout(this.timeout);
                this.highlighted = Math.min(this.highlighted, this.filteredCategories.length );
                this.focusInput = true;
            },
            end() {
                this.timeout = window.setTimeout(() => {
                    this.editing = false;
                }, 2000)
            },
            onCreate() {
                const _this = this;
                this.create({
                    name: this.text
                }).then(() => {
                    const category = _this.categoryFindByName(_this.text);
                    _this.onSelect(category.id);
                }).catch((reason) => {
                    this.error = reason;
                    this.text = "";
                    _this.editing = false;
                })
            },
            onSelect(categoryId) {
                const _this = this;
                this.select({
                    id: this.transaction.id,
                    category: categoryId
                }).then(() => {
                    _this.editing = false;
                    _this.text = "";
                })
            },
            onDeselect() {
                const _this = this;
                this.select({
                    id: this.transaction.id,
                    category: null
                }).then(() => _this.edit() )
            },
            highlightPrev() {
                this.highlighted += (this.highlighted > 0) ? -1 : 0;
            },
            highlightNext() {
                this.highlighted += (this.highlighted >= this.filteredCategories.length) ? 0 : 1;
            },
            highlightSelect() {
                // create
                if( this.highlighted >= this.filteredCategories.length ) {
                    this.onCreate()
                }
                // select
                else {
                    this.onSelect( this.filteredCategories[this.highlighted].id )
                }
            },
            focus() {
              this.$refs.input.focus()
            }
        }
    }
</script>

<style scoped>
    .category-container,
    .category-dropdown-list {
        min-width: 168px
    }

    .category-dropdown-list li {
        @apply bg-gray-100 p-2 w-full
    }
    .category-dropdown-list li:hover {
        @apply bg-gray-300 cursor-pointer
    }

    li.highlighted {
        @apply bg-blue-600 text-white
    }
    li.highlighted:hover {
        @apply bg-blue-800 text-white
    }
</style>