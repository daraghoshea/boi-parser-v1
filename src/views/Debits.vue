<template>
    <app-layout>
        <template #header>
            <h1>Expenditure</h1>
            <div class="ml-auto">
                <span class="mx-3 text-gray-600 uppercase text-sm tracking-wide">Total Transactions</span>
                <span class="font-number mr-3">{{formatNumber(allCount)}}</span> /
                <span class="mx-3 text-gray-600 uppercase text-sm tracking-wide">Total Sum</span>
                <span class="font-number">{{formatMoney(allSum)}}</span>
            </div>
        </template>
        <main>

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
                            v-if="debits.length"
                            class="px-4 py-2 rounded-lg bg-teal-500 text-white font-semibold mr-6 text-sm hover:bg-teal-700"
                            :disabled="downloading"
                            @click="!downloading && download()"
                    >
                        {{downloading ? `Downloading...` : `Download ${formatNumber(debits.length)} Debits`}}
                    </button>

                    <span class="mx-3 text-gray-600 uppercase text-sm tracking-wide">Showing</span>
                    <span class="font-number mr-3">{{formatNumber(debits.length)}}</span> /
                    <span class="font-number ml-3">{{formatMoney(debitsSum)}}</span>
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
                        <input ref="search" v-model="queryTextComputed" @keyup.esc.prevent="resetBasicFilter" class="form-input border-gray-500 rounded-full block w-64 pl-8 pr-16 sm:text-sm sm:leading-5" :class="{'bg-teal-500 text-white font-bold': filters.query.text.length}" placeholder="Search..." />
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
                <!-- Advanced Search -->
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
                                <input ref="advancedSearch" id="advanced-search" v-model="queryTextComputed" class="form-input block w-48 pl-8 pr-12 sm:text-sm sm:leading-5" :class="{'bg-teal-500 text-white font-bold': filters.query.text.length}" placeholder="Search..." />
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
                        <!-- Tax -->
                        <div class="mr-4">
                          <label><input type="checkbox" v-model="filters.query.hasTax"> Has tax</label>
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

            <!-- Bulk Edit -->
            <transition name="slide-down">
                <div v-if="selected.length > 1" class="bg-gray-100 mt-2 border-t-2 border-indigo-500 mt-4">
                    <button class="text-gray-500 p-3 form-label text-indigo-700 w-full outline-none text-left focus:outline-none hover:bg-gray-200" @click="bulkEdit.open = !bulkEdit.open">
                        Bulk edit <span class="font-number font-bold">{{selected.length}}</span> <strong>Debits</strong>
                    </button>
                    <transition name="slide-down">
                        <form v-if="bulkEdit.open" @submit.prevent="onBulkEditSubmit" :disabled="bulkEdit.submitting" class="p-3">
                        <fieldset :disabled="bulkEdit.submitting">
                            <div class="flex items-start">
                                <!-- Bulk Contact -->
                                <div class="mr-4">
                                    <label for="bulk-contact" class="form-label text-sm leading-5 font-medium text-gray-600">Contact</label>
                                    <div class="mt-1 relative rounded-md shadow-sm w-full">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg class="h-3 w-3" viewBox="0 0 24 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.46447 13.4645C2.40215 12.5268 3.67392 12 5 12H13C14.3261 12 15.5979 12.5268 16.5355 13.4645C17.4732 14.4021 18 15.6739 18 17V19C18 19.5523 17.5523 20 17 20C16.4477 20 16 19.5523 16 19V17C16 16.2044 15.6839 15.4413 15.1213 14.8787C14.5587 14.3161 13.7956 14 13 14H5C4.20435 14 3.44129 14.3161 2.87868 14.8787C2.31607 15.4413 2 16.2044 2 17V19C2 19.5523 1.55228 20 1 20C0.447715 20 0 19.5523 0 19V17C0 15.6739 0.526784 14.4021 1.46447 13.4645Z" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 2C7.34315 2 6 3.34315 6 5C6 6.65685 7.34315 8 9 8C10.6569 8 12 6.65685 12 5C12 3.34315 10.6569 2 9 2ZM4 5C4 2.23858 6.23858 0 9 0C11.7614 0 14 2.23858 14 5C14 7.76142 11.7614 10 9 10C6.23858 10 4 7.76142 4 5Z" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.0318 12.88C19.1698 12.3453 19.7153 12.0237 20.25 12.1618C21.3227 12.4387 22.273 13.0641 22.9517 13.9397C23.6304 14.8152 23.9992 15.8914 24 16.9993L24 19C24 19.5523 23.5523 20 23 20C22.4477 20 22 19.5523 22 19L22 17.0007C22 17.0006 22 17.0008 22 17.0007C21.9994 16.3361 21.7782 15.6902 21.371 15.165C20.9638 14.6396 20.3936 14.2644 19.75 14.0982C19.2153 13.9602 18.8937 13.4148 19.0318 12.88Z" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0312 0.881962C15.1682 0.346936 15.713 0.0242632 16.248 0.161251C17.3236 0.436628 18.2768 1.06213 18.9576 1.93914C19.6383 2.81615 20.0078 3.89479 20.0078 5.005C20.0078 6.11521 19.6383 7.19385 18.9576 8.07086C18.2768 8.94787 17.3236 9.57337 16.248 9.84875C15.713 9.98574 15.1682 9.66307 15.0312 9.12804C14.8943 8.59301 15.2169 8.04824 15.752 7.91125C16.3973 7.74603 16.9692 7.37073 17.3777 6.84452C17.7861 6.31831 18.0078 5.67113 18.0078 5.005C18.0078 4.33887 17.7861 3.69169 17.3777 3.16548C16.9692 2.63928 16.3973 2.26398 15.752 2.09875C15.2169 1.96176 14.8943 1.41699 15.0312 0.881962Z" />
                                            </svg>
                                        </div>
                                        <select id="bulk-contact"
                                               class="form-select text-sm block border-2 pl-8 pr-12 w-48 truncate outline-none focus:outline-none focus:shadow-online"
                                               :class="{'border-indigo-500 border-2 text-indigo-700': bulkEdit.contact}"
                                               v-model="bulkEdit.contact">
                                            <option value="" :selected="!bulkEdit.contact">None</option>
                                            <option v-for="(contact,index) in contactFilterOptions" :key="index" :value="contact.id">{{contact.company.name}}</option>
                                        </select>
                                    </div>
                                </div>
                                <!-- Bulk Category -->
                                <div class="mr-4">
                                    <label for="bulk-category" class="form-label text-sm leading-5 font-medium text-gray-600">Category</label>
                                    <div class="mt-1 relative rounded-md shadow-sm w-full" :class="{'text-indigo-700': bulkEdit.category}">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg class="h-3 w-3" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21 6V19H3V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M23 1H1V6H23V1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M10 10H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>
                                        <select id="bulk-category"
                                                class="form-select text-sm block border-2 pl-8 pr-16 w-48"
                                                :class="{'border-indigo-500 border-2': bulkEdit.category}"
                                                v-model="bulkEdit.category">
                                            <option value="" :selected="!bulkEdit.category">None</option>
                                            <option v-for="(cat,index) in categoryFilterOptions" :key="index" :value="cat.id">{{cat.name}}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="relative mr-4">
                                    <label for="bulk-note" class="form-label text-sm leading-5 font-medium text-gray-600">Note</label>
                                    <resizeable-textarea>
                                        <textarea
                                                id="bulk-note"
                                                v-model="bulkEdit.note"
                                                placeholder="Add note.."
                                                class="form-textarea text-sm w-48 block border-2 resize-none mt-1"
                                                :class="{'border-indigo-500 border-2 text-indigo-700': bulkEdit.note.length}"
                                                style="min-height:2.35rem;"
                                                rows="1"></textarea>
                                    </resizeable-textarea>
                                </div>
                            </div>
                            <div class="flex mt-4">
                                <button type="submit" :disabled="bulkEditDisabled" class="px-3 py-2 inline-block rounded bg-indigo-700 text-white font-semibold font-number disabled:opacity-50 disabled:cursor-default">
                                    {{bulkEdit.submitting ? 'Saving..' : `Update ${formatNumber(selected.length)} Debits`}}
                                </button>
                                <p class="ml-6 text-sm text-gray-600 font-italic mt-3">
                                    <strong class="font-bold">Warning</strong>: These changes will overwrite any existing values
                                </p>
                            </div>
                        </fieldset>
                    </form>
                    </transition>
                </div>
            </transition>

            <debits-table :debits="debits" v-model="selected"></debits-table>
        </main>
    </app-layout>
</template>
<script>
    /**
     * TODO Change route when filtering?
     * TODO Should `replace` or `push` route when changing month, filtering, etc?
     * Ideas:
     *  - change month: push
     *  - basic search: push, then replace for each continuous search
     *  - advanced search: push, then replace for each continuous search
     */

    import AppLayout from "../layouts/AppLayout";
    import DebitsTable from "../components/DebitsTable";
    import {mapGetters, mapActions} from 'vuex'
    import {downloadCsv} from "../utils";
    import {formatNumber} from "../utils/numbers";
    import {formatMoney, sumAmounts} from "../utils/money";
    import {firstTransactionDate, lastTransactionDate} from "../utils/transactions";
    import moment from 'moment'
    import {cloneDeep, debounce, isEqual} from 'lodash'
    import DateInput from "../components/utilities/DateInput";
    import CategorySelectDropdown from "../components/forms/CategorySelectDropdown";
    import ContactSelectDropdown from "../components/forms/ContactSelectDropdown";
    import ResizeableTextarea from "../components/forms/ResizeableTextarea";

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
            },
            hasTax: false,
            limit: 100,
        },
        orderBy: 'date',
        order: 'desc',
        type: 'dr',
        deleted: 'exclude',
        category: null,
        accountId: null,
        fileId: null
    };

    export default {
        components: {ResizeableTextarea, ContactSelectDropdown, CategorySelectDropdown, DateInput, AppLayout, DebitsTable },
        data() {
            return {
                month: null,
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
        watch: {
            routeMonth() {
                this.parseMonthFromUrl();
                this.setMonth(this.month);
            },
            dateSearchByMonth() {
                this.resetDateFilter()
            },
            basicSearch() {
                this.resetFilters()
            }
        },
        created() {
            this.parseMonthFromUrl();
            if( ! this.month ) {
                this.updateRouterToMonth(0);
            }
        },
        mounted() {
            this.addShortcutListeners()
        },
        destroyed() {
            this.removeShortcutListeners()
        },
        computed: {
            ...mapGetters({
                query: 'transactions/QUERY',
                months: 'transactions/DEBITS_MONTHS',
                allCount: 'transactions/DEBITS_COUNT',
                allSum: 'transactions/DEBITS_SUM',
                earliestDebitDate: 'transactions/DEBITS_EARLIEST_DATE',
                latestDebitDate: 'transactions/DEBITS_LATEST_DATE',
                allCategories: 'categories/ALL',
                allContacts: 'contacts/ALL'
            }),
            queryTextComputed: {
                get() {
                    return this.filters.query.text;
                },
                set: debounce(function(newVal){
                    this.filters.query.text = newVal
                }, 300)
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
            debits() {
                return this.query(this.queryFilters());
            },
            debitsSum() {
                return sumAmounts(this.debits.map(d => d.data.value));
            },
            earliestDate() {
                return this.debits.reduce( (earliest, transaction) => {
                    const date = moment(transaction.data.date, moment.ISO_8601);
                    if( ! earliest ) {
                        return date;
                    }
                    return date.isBefore(earliest) ? date : earliest;
                }, null)
            },
            latestDate() {
                return this.debits.reduce( (latest, transaction) => {
                    const date = moment(transaction.data.date, moment.ISO_8601);
                    if( ! latest ) {
                        return date;
                    }
                    return date.isAfter(latest) ? date : latest;
                }, null)
            },
            canGoBack() {
                // Months are in desc order
                return this.monthIndex < (this.months.length -1);
            },
            canGoForward() {
                // Months are in desc order
                return this.monthIndex > 0;
            },
            firstDate() {
                return firstTransactionDate(this.debits)
            },
            lastDate() {
                return lastTransactionDate(this.debits)
            },
            routeMonth() {
                // Just used to make the watch easier below
                return this.$route.query.month;
            },
            dateRangeOptions() {
                return {
                    mode: 'range',
                    dateFormat: 'j M y',
                    minDate: this.earliestDebitDate ? new Date(this.earliestDebitDate) : null,
                    maxDate: this.latestDebitDate ? new Date(this.latestDebitDate) : null,
                    showMonths: 2
                }
            },
            categoryFilterOptions() {
                const cats = this.$store.state.categories.all;
                return Object.values(cats).sort( (a,b) => {
                    return (a.name + "").toUpperCase().localeCompare( (b.name + "").toUpperCase() );
                })
            },
            contactFilterOptions() {
                const contacts = this.$store.state.contacts.all;
                return Object.values(contacts).sort( (a,b) => {
                    return (a.company.name + "").toUpperCase().localeCompare( (b.company.name + "").toUpperCase() );
                })
            },
            bulkEditDisabled() {
                const bulkEdit = this.bulkEdit;
                const note = (bulkEdit.note + "").trim();
                return ! bulkEdit.contact && ! bulkEdit.category && ! note.length;
            }
        },
        methods: {
            ...mapActions({
                setCategory: 'transactions/SET_CATEGORY',
                setContact: 'transactions/SET_CONTACT',
                setNote: 'transactions/SET_NOTE'
            }),
            formatNumber,
            formatMoney,
            moment,
            queryFilters() {
                const filters = {...this.filters};
                filters.month = this.filtering ? null : this.month;
                return filters;
            },
            resetFilters() {
                const text = this.filters.query.text;
                const reset = {...defaultFilters };
                reset.query.text = text;
                this.filters = reset;
            },
            resetBasicFilter() {
                this.filters.query.text = "";
                this.$refs.search.focus()
            },
            resetAdvancedSearch() {
                this.filters.query.text = "";
                this.$refs.advancedSearch.focus()
            },
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
                    this.$router.replace({name: 'transactions.debits', query: {month: this.months[index]}})
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
            addShortcutListeners() {
                this._keyDownListener = (e) => {
                    if( this.filtering ) {
                        return;
                    }

                    if( e.target !== document.body ) {
                        return;
                    }

                    if( e.keyCode === 37 ) { // "ArrowLeft"
                        e.preventDefault();
                        this.backMonth()
                    }
                    if( e.keyCode === 39 ) { // "ArrowRight"
                        e.preventDefault();
                        this.forwardMonth()
                    }
                    if( e.keyCode === 191 ) { // the / key
                        e.preventDefault();
                        window.console.log(this.$refs.search.focus())
                    }
                };

                document.addEventListener('keyup', this._keyDownListener)
            },
            removeShortcutListeners() {
                document.removeEventListener('keyup', this._keyDownListener)
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
            resetBulkEdit() {
                this.bulkEdit = {
                    submitting: false,
                    contact: [],
                    category: [],
                    note: ""
                }
            },
            onBulkEditSubmit() {
                debugger // eslint-disable-line
                // Make sure all selected are visible
                const selected = this.selected.filter(id => !!this.debits.find(d => d.id === id));
                if( selected.length !== this.selected.length ) {
                    this.selected = selected;
                    window.alert('The number of debits to change did not match what is on screen. Check again to see if the issue is resolved');
                    return;
                }

                this.bulkEdit.submitting = true;

                selected.forEach(id => {
                    if(this.bulkEdit.contact) {
                        this.setContact({ id, contact: this.bulkEdit.contact })
                    }

                    if(this.bulkEdit.category) {
                        this.setCategory({ id, category: this.bulkEdit.category })
                    }

                    if(this.bulkEdit.note) {
                        this.setNote({ id, note: this.bulkEdit.note })
                    }
                });

                this.bulkEdit.submitting = false;
            },
            download() {
                this.downloading = true;
                const name = window.prompt('What would you like to name the file?', `Debits.csv`) || 'Debits.csv';
                const debits = this.debits.map(d => {
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

                debits.push({
                  Date: '',
                  Description: '',
                  Amount: formatMoney(sumAmounts(this.debits.map(d => d.data.value))),
                  Tax: formatMoney(sumAmounts(this.debits.map(d => d.tax).filter(v => !!v))),
                  Contact: '',
                  Category: '',
                  Note: '',
                })

                downloadCsv(debits, name);
                this.downloading = false;
            }
        }
    }
</script>