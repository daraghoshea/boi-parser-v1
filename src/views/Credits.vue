<template>
    <app-layout>
        <template #header>
            <h1>Income</h1>
            <div class="ml-auto">
                <span class="mx-3 text-gray-600 uppercase text-sm tracking-wide">Total Transactions</span>
                <span class="font-number mr-3">{{formatNumber(allCount)}}</span> /
                <span class="mx-3 text-gray-600 uppercase text-sm tracking-wide">Total Sum</span>
                <span class="font-number">{{formatMoney(allSum)}}</span>
            </div>
        </template>
        <main class="">
            <!-- Month Selector -->
            <div v-if="allCount > 0" class="flex items-center lg:sticky lg:top-0 bg-white py-2 z-10">
                <!-- Month Selector-->
                <div class="inline-flex items-center" v-if="!filtering && basicSearch">
                    <!--  Prev Month  -->
                    <button type="button" @click="backMonth" :disabled="!canGoBack" class="appearance-none outline-none focus:outline-none px-2 py-1 text-white rounded-full inline-flex items-center" :class="[canGoBack ? 'bg-teal-500 hover:bg-teal-700' : 'bg-gray-400 cursor-default']">
                        <svg class="h-3 w-4" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 13L1 7L7 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <p class="font-bold text-xl mx-3 font-number">
                        {{moment(routeMonth, "YYYY-MM-DD", 'YYYY-MM-DD').format('MMM \'YY')}}
                    </p>
                    <!--  Next Month  -->
                    <button type="button" @click="forwardMonth" :disabled="!canGoForward" class="appearance-none outline-none focus:outline-none px-2 py-1 text-white rounded-full inline-flex items-center" :class="[canGoForward ? 'bg-teal-500 hover:bg-teal-700' : 'bg-gray-400 cursor-default']">
                        <svg class="h-3 w-4" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 13L7 7L1 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div v-else-if="!filtering" class="font-bold text-xl mr-3 text-teal-500">
                    Search
                </div>
                <div v-else class="font-bold text-xl mr-3 text-teal-500">Search Results</div>
                <!-- Summary Numbers -->
                <div class="ml-auto text-gray-700">
                    <!-- Download Button -->
                    <button type="button"
                            v-if="credits.length"
                            class="px-4 py-2 rounded-lg bg-teal-500 text-white font-semibold mr-6 text-sm hover:bg-teal-700"
                            :disabled="downloading"
                            @click="!downloading && download()"
                    >
                        {{downloading ? `Downloading...` : `Download ${formatNumber(credits.length)} Transactions`}}
                    </button>

                    <span class="mx-3 text-gray-600 uppercase text-sm tracking-wide">Showing</span>
                    <span class="font-number mr-3">{{formatNumber(credits.length)}}</span> /
                    <span class="font-number ml-3">{{formatMoney(creditsSum)}}</span>
                </div>
            </div>

            <div v-if="allCount > 0" class="mt-4">
                <!-- Basic Search -->
                <div v-if="basicSearch" class="flex">
                    <!-- Search Input -->
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <svg class="h-3 w-3" :class="[filters.query.text ? 'text-white' : 'text-gray-500']" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M19 19L14.65 14.65" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <input ref="search" v-model="filters.query.text" @keyup.esc.prevent="resetBasicFilter" class="form-input border-gray-500 rounded-full block w-64 pl-8 pr-16 sm:text-sm sm:leading-5" :class="{'bg-teal-500 text-white font-bold': filters.query.text.length}" placeholder="Search..." />
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button @click="resetBasicFilter" type="button" class="appearance-none outline-none focus:outline-none">
                                <svg class="h-4 w-4 text-white" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M14 8L8 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M8 8L14 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <button type="button" @click="basicSearch=false" class="appearance-none outline-none focus:outline-none inline-flex items-center px-3 py-2 ml-6 font-semibold text-sm uppercase tracking-wide text-gray-700 hover:text-teal-700">
                        Advanced
                        <svg class="h-2 w-auto ml-2" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 8L6 13L11 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div v-else class="bg-gray-100 border-gray-300 p-3 border-t-2 border-teal-500">
                    <div class="flex flex-wrap">
                        <!-- Search -->
                        <div class="mr-4">
                            <label for="advanced-search" class="form-label text-sm leading-5 font-medium text-gray-600">Text Search</label>
                            <div class="mt-1 relative rounded-md shadow-sm">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-3 w-3" :class="[filters.query.text.length ? 'text-white' : 'text-gray-500']" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M19 19L14.65 14.65" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <input ref="advancedSearch" id="advanced-search" v-model="filters.query.text" class="form-input block w-48 pl-8 pr-12 sm:text-sm sm:leading-5" :class="{'bg-teal-500 text-white font-bold': filters.query.text.length}" placeholder="Search..." />
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button v-if="filters.query.text.length" @click="resetAdvancedSearch" type="button" class="appearance-none outline-none focus:outline-none">
                                        <svg class="h-4 w-4 text-white" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M14 8L8 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M8 8L14 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <!-- Date - Select Date Range -->
                        <div class="mr-4" v-if="!dateSearchByMonth">
                            <div class="flex items-center mt-1">
                                <label for="date" class="form-label text-sm leading-5 font-medium text-gray-600">Date Range</label>
                                <button type="button" @click="dateSearchByMonth=true" class="ml-auto form-label text-sm text-teal-600 hover:text-teal-800 outline-none appearance-none focus:outline-none">
                                    By Month
                                </button>
                            </div>

                            <div class="mt-1 relative rounded-md shadow-sm">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-3 w-3" :class="[filters.query.dates.from ? 'text-white' : 'text-gray-500']" viewBox="0 0 20 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 4C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H17C17.5523 20 18 19.5523 18 19V5C18 4.44772 17.5523 4 17 4H3ZM0 5C0 3.34315 1.34315 2 3 2H17C18.6569 2 20 3.34315 20 5V19C20 20.6569 18.6569 22 17 22H3C1.34315 22 0 20.6569 0 19V5Z" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14 0C14.5523 0 15 0.447715 15 1V5C15 5.55228 14.5523 6 14 6C13.4477 6 13 5.55228 13 5V1C13 0.447715 13.4477 0 14 0Z" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6 0C6.55228 0 7 0.447715 7 1V5C7 5.55228 6.55228 6 6 6C5.44772 6 5 5.55228 5 5V1C5 0.447715 5.44772 0 6 0Z" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 9C0 8.44772 0.447715 8 1 8H19C19.5523 8 20 8.44772 20 9C20 9.55228 19.5523 10 19 10H1C0.447715 10 0 9.55228 0 9Z" />
                                    </svg>
                                </div>
                                <date-input :options="dateRangeOptions" @onValueUpdate="onDateFilterChange">
                                    <input ref="dateRangeInput"
                                           id="date"
                                           class="form-input block pl-8 pr-8 w-64 sm:text-sm sm:leading-5"
                                           :class="{'bg-teal-500 text-white': filters.query.dates.from}"
                                           placeholder="Date Range"
                                    />
                                </date-input>
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button v-if="filters.query.dates.from" @click="resetDateFilter" type="button" class="appearance-none outline-none focus:outline-none">
                                        <svg class="h-4 w-4 text-white" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M14 8L8 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M8 8L14 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <!-- Date - Select Month -->
                        <div class="mr-4" v-else>
                            <div class="flex items-center mt-1">
                                <label for="date-month" class="form-label text-sm leading-5 font-medium text-gray-600">Month</label>
                                <button type="button" @click="dateSearchByMonth=false" class="ml-auto form-label text-sm text-teal-600 hover:text-teal-800 outline-none appearance-none focus:outline-none">
                                    Choose Dates
                                </button>
                            </div>
                            <div class="mt-1 relative rounded-md shadow-sm">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-3 w-3" :class="[filters.query.dates.from ? 'text-white' : 'text-gray-500']" viewBox="0 0 20 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 4C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H17C17.5523 20 18 19.5523 18 19V5C18 4.44772 17.5523 4 17 4H3ZM0 5C0 3.34315 1.34315 2 3 2H17C18.6569 2 20 3.34315 20 5V19C20 20.6569 18.6569 22 17 22H3C1.34315 22 0 20.6569 0 19V5Z" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14 0C14.5523 0 15 0.447715 15 1V5C15 5.55228 14.5523 6 14 6C13.4477 6 13 5.55228 13 5V1C13 0.447715 13.4477 0 14 0Z" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6 0C6.55228 0 7 0.447715 7 1V5C7 5.55228 6.55228 6 6 6C5.44772 6 5 5.55228 5 5V1C5 0.447715 5.44772 0 6 0Z" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 9C0 8.44772 0.447715 8 1 8H19C19.5523 8 20 8.44772 20 9C20 9.55228 19.5523 10 19 10H1C0.447715 10 0 9.55228 0 9Z" />
                                    </svg>
                                </div>
                                <div class="inline-block relative w-48">
                                    <select id="date-month" v-model="dateSearchByMonthValue" @change="onDateFilterMonthChange($event.target.value)"
                                            class="block appearance-none w-full text-sm border border-gray-300 px-4 py-2 pr-8 rounded leading-5 focus:outline-none focus:shadow-outline"
                                            :class="[filters.query.dates.from ? 'bg-teal-500 text-white' : 'bg-white text-gray-500']"
                                    >
                                        <option value="">All</option>
                                        <option v-for="(m, index) in months" :key="index" :value="m">
                                            {{moment(m, 'YYYY-MM-DD').format('MMM YYYY')}}
                                        </option>
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button v-if="filters.query.dates.from" @click="resetDateFilter" type="button" class="appearance-none outline-none focus:outline-none">
                                        <svg class="h-4 w-4 text-white" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M14 8L8 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M8 8L14 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <!-- Contact -->
                        <div class="mr-4">
                            <contact-select-dropdown v-model="filters.query.contacts" :contacts="contactFilterOptions"></contact-select-dropdown>
                        </div>
                        <!-- Category -->
                        <div class="mr-4">
                            <category-select-dropdown v-model="filters.query.categories" :categories="categoryFilterOptions"></category-select-dropdown>
                        </div>
                    </div>
                    <div class="mt-2 text-center">
                        <button type="button" @click="hideAdvanced" class="appearance-none outline-none focus:outline-none inline-flex items-center px-3 py-2 font-semibold text-sm uppercase tracking-wide text-gray-700 hover:text-teal-700">
                            Basic
                            <svg class="h-2 w-auto ml-2" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 6L6 1L1 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M11 13L6 8L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <credits-table :credits="credits"></credits-table>
        </main>
    </app-layout>
</template>
<script>
    import {mapGetters} from 'vuex'
    import moment from 'moment'
    import {cloneDeep, isEqual} from 'lodash'
    import CreditsTable from "../components/CreditsTable";
    import AppLayout from "../layouts/AppLayout";
    import { formatNumber} from "../utils/numbers";
    import {formatMoney, sumAmounts} from "../utils/money";
    import DateInput from "../components/utilities/DateInput";
    import CategorySelectDropdown from "../components/forms/CategorySelectDropdown";
    import ContactSelectDropdown from "../components/forms/ContactSelectDropdown";
    import {downloadCsv} from "@/utils";

    const defaultFilters = {
        query: {
            text: '',
            description: '',
            note: '',
            amount: '',
            categories: [],
            contacts: [],
            dates: {
                from: null,
                to: null
            }
        },
        orderBy: 'date',
        order: 'desc',
        type: 'cr',
        deleted: 'exclude',
        month: null,
        category: null,
        accountId: null,
        fileId: null
    };

    export default {
        components: {ContactSelectDropdown, CategorySelectDropdown, AppLayout, CreditsTable, DateInput},

        watch: {
            routeMonth() {
                this.parseMonthFromUrl();
                this.setMonth(this.month);
            },
        },
        computed: {
            ...mapGetters({
                query: 'transactions/QUERY',
                months: 'transactions/CREDITS_MONTHS',
                allCount: 'transactions/CREDITS_COUNT',
                allSum: 'transactions/CREDITS_SUM',
                earliestDate: 'transactions/CREDITS_EARLIEST_DATE',
                latestDate: 'transactions/CREDITS_LATEST_DATE',
                allCategories: 'categories/ALL',
                allContacts: 'contacts/ALL'
            }),
            canGoBack() {
                // Months are in desc order
                return this.monthIndex < (this.months.length -1);
            },
            canGoForward() {
                // Months are in desc order
                return this.monthIndex > 0;
            },
            creditsSum() {
                return sumAmounts(this.credits.map(c => c.data.value));
            },
            filtering() {
                if( this.basicSearch ) {
                    return !! this.filters.query.text.length;
                }

                const defaults = {
                    text: '',
                    description: '',
                    note: '',
                    amount: '',
                    categories: [],
                    contacts: [],
                    dates: {
                        from: null,
                        to: null
                    }
                };

                return Object.keys(this.filters.query).reduce((active, key) => {
                    const dirty = !isEqual(this.filters.query[key],defaults[key]);
                    return dirty || active;
                }, false);
            },
            routeMonth() {
                // Just used to make the watch easier below
                return this.$route.query.month;
            },
            credits() {
                return this.query(this.filters);
            },
            categoryFilterOptions() {
                return Array.from(this.allCategories).sort( (a,b) => {
                    return (a.name + "").toUpperCase().localeCompare( (b.name + "").toUpperCase() );
                })
            },
            contactFilterOptions() {
                return Array.from(this.allContacts).sort( (a,b) => {
                    return (a.company.name + "").toUpperCase().localeCompare( (b.company.name + "").toUpperCase() );
                })
            },
            dateRangeOptions() {
              return {
                mode: 'range',
                dateFormat: 'j M y',
                minDate: this.earliestDate ? new Date(this.earliestDate) : null,
                maxDate: this.latestDate ? new Date(this.latestDate) : null,
                showMonths: 2
              }
            },
        },
        data() {
            return {
                month: null, // Main one to be used to display transactions
                monthIndex: 0,
                basicSearch: true,
                dateSearchByMonth: true,
                dateSearchByMonthValue: "",
                filters: cloneDeep(defaultFilters),
                selected: [],
                bulkEdit: {
                    open: false,
                    submitting: false,
                    contact: "",
                    category: "",
                    note: ""
                },
                downloading: false
            }
        },
        methods: {
            moment,
            formatNumber,
            formatMoney,
            backMonth() {
                if( this.monthIndex < ( this.months.length -1 ) ) {
                    window.console.log('backMonth');
                    this.monthIndex++;      // Increasing as months are in desc order
                    this.updateRouterToMonth(this.monthIndex)
                }
            },
            forwardMonth() {
                if( this.monthIndex >= 0 ) {
                    window.console.log('forwardMonth');
                    this.monthIndex--;      // Decreasing as months are in desc order
                    this.updateRouterToMonth(this.monthIndex);
                }
            },
            updateRouterToMonth(index) {
                if( this.months[index] ) {
                    this.$router.replace({name: 'transactions.credits', query: {month: this.months[index]}})
                }
                else {
                    window.console.log(`index ${index} not found in months`)
                }
            },
            parseMonthFromUrl() {
                if( ! this.$route.query.month ) {
                    this.month = null;
                    return;
                }
                const m = this.$route.query.month;
                const index = this.months.findIndex(month => month === m);

                if( index < 0 ) {
                    this.month = null;
                    return;
                }

                this.monthIndex = index;
                this.month = this.months[index];
            },
            showAdvanced() {
                this.basicSearch = false;
            },
            hideAdvanced() {
                this.basicSearch = true;
                if( ! this.filtering ) {
                    this.updateRouterToMonth(0);
                }
            },
            setMonth(value) {
                const month = value ? moment(value, 'YYYY-MM-DD') : null;
                if( ! month ) {
                    this.filters.query.dates = {
                        from: null,
                        to: null
                    }
                }
                else {
                    this.filters.query.dates = {
                        from: month.startOf('month').toDate(),
                        to: month.endOf('month').toDate()
                    }
                }
            },
            resetBasicFilter() {
                this.filters.query.text = "";
                this.$refs.search.focus()
            },
            resetAdvancedSearch() {
                this.filters.query.text = "";
                this.$refs.advancedSearch.focus()
            },
            onDateFilterChange(dates) {
                if(dates[0] && dates[1]) {
                    this.filters.query.dates = {
                        from: dates[0],
                        to: dates[1]
                    };
                }
            },
            onDateFilterMonthChange(value) {
                if( ! value ) {
                    this.resetDateFilter();
                    return;
                }

                this.setMonth(value);
                this.dateSearchByMonthValue = value;
                this.dateSearchByMonth = true;
            },
            resetDateFilter() {
                this.setMonth(null);
                this.$refs.dateRangeInput && this.$refs.dateRangeInput._flatpickr && this.$refs.dateRangeInput._flatpickr.clear();
                this.dateSearchByMonthValue = "";
            },
          download() {
            this.downloading = true;
            const name = window.prompt('What would you like to name the file?', `Income.csv`) || 'Income.csv';
            const credits = this.credits.map(d => {
              const contact = d.contact ? this.allContacts.find(c => c.id === d.contact) : null;
              const category = d.category ? this.allCategories.find(c => c.id === d.category) : null;
              return {
                Date: moment(d.data.date, moment.ISO_8601).format('YYYY-MM-DD'),
                Description: d.data.desc,
                Amount: formatMoney(d.data.value),
                Tax: d.tax ? formatMoney(d.tax) : '',
                Contact: contact ? contact.company.name : "",
                Category: category ? category.name : "",
                Note: d.data.note ? d.data.note : ""
              };
            });

            credits.push({
              Date: '',
              Description: '',
              Amount: formatMoney(sumAmounts(this.credits.map(d => d.data.value))),
              Tax: formatMoney(sumAmounts(this.credits.map(d => d.tax).filter(v => !!v))),
              Contact: '',
              Category: '',
              Note: '',
            })

            downloadCsv(credits, name);
            this.downloading = false;
          }
        },
        created() {
            this.parseMonthFromUrl();
            if( ! this.month ) {
                this.updateRouterToMonth(0);
            }
        },
    }
</script>