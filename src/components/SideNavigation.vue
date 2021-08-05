<template>
    <div class="-mb-0 -mb-16 block bg-gray-800 inset-0 h-auto lg:overflow-y-visible lg:static no-print z-90">
        <div class="h-full lg:bg-transparent lg:block lg:h-auto lg:relative lg:sticky overflow-y-auto scrolling-touch">

            <div class="border-b border-gray-700 flex h-16 items-center px-3">
                <a href="/" class="inline-flex items-center lg:mr-4 text-gray-400">
                    <svg class="h-6 w-6 mr-3 text-teal-700" fill="currentColor" viewBox="0 0 20 22" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3982 0.0826934C11.8054 0.259462 12.0473 0.683531 11.9923 1.12403L11.1328 8H19C19.388 8 19.741 8.22446 19.9056 8.57584C20.0702 8.92722 20.0166 9.3421 19.7682 9.64018L9.76822 21.6402C9.48402 21.9812 9.00902 22.0941 8.6018 21.9173C8.19459 21.7405 7.95266 21.3165 8.00772 20.876L8.86721 14H0.999997C0.611979 14 0.258987 13.7755 0.0944075 13.4242C-0.0701723 13.0728 -0.0166272 12.6579 0.231776 12.3598L10.2318 0.35981C10.516 0.0187764 10.991 -0.0940753 11.3982 0.0826934ZM3.13504 12H10C10.2868 12 10.5598 12.1232 10.7497 12.3382C10.9395 12.5532 11.0279 12.8394 10.9923 13.124L10.4153 17.7395L16.865 10H10C9.71317 10 9.44014 9.87683 9.25032 9.6618C9.06049 9.44677 8.97214 9.16058 9.00772 8.87596L9.58466 4.26045L3.13504 12Z" />
                    </svg>
                    <span class="hidden md:inline-block font-bold">Tidy Books</span>
                </a>

                <slot name="top" />
            </div>

            <nav class="px-3 py-6 overflow-y-auto text-base lg:sticky">

                <router-link class="flex items-center px-2 -mx-2 mb-2 py-1 hover:text-teal-500 font-medium text-gray-300 font-bold" active-class="text-teal-500" to="/files">
                    <svg class="h-4 w-4 mr-3" viewBox="0 0 18 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.87868 0.87868C1.44129 0.31607 2.20435 0 3 0H10C10.2652 0 10.5196 0.105357 10.7071 0.292893L17.7071 7.29289C17.8946 7.48043 18 7.73478 18 8V19C18 19.7957 17.6839 20.5587 17.1213 21.1213C16.5587 21.6839 15.7957 22 15 22H3C2.20435 22 1.44129 21.6839 0.87868 21.1213C0.31607 20.5587 0 19.7957 0 19V3C0 2.20435 0.31607 1.44129 0.87868 0.87868ZM3 2C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20H15C15.2652 20 15.5196 19.8946 15.7071 19.7071C15.8946 19.5196 16 19.2652 16 19V8.41421L9.58579 2H3Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C10.5523 0 11 0.447715 11 1V7H17C17.5523 7 18 7.44772 18 8C18 8.55228 17.5523 9 17 9H10C9.44772 9 9 8.55228 9 8V1C9 0.447715 9.44772 0 10 0Z" />
                    </svg>
                    Files
                </router-link>

                <router-link class="flex items-center px-2 -mx-2 mb-2 py-1 hover:text-teal-500 font-medium text-gray-300 font-bold" active-class="text-teal-500" to="/accounts">
                    <svg class="h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5C9 4.44772 9.44772 4 10 4Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.83989 6.5442C7.36132 6.07017 8.04979 5.81818 8.75 5.81818H12.5C13.0523 5.81818 13.5 6.26589 13.5 6.81818C13.5 7.37046 13.0523 7.81818 12.5 7.81818H8.75C8.52196 7.81818 8.32018 7.90141 8.18524 8.02408C8.05346 8.14388 8 8.28479 8 8.40909C8 8.53338 8.05346 8.67429 8.18524 8.79409C8.32018 8.91676 8.52196 8.99999 8.75 8.99999H11.25C11.9502 8.99999 12.6387 9.25199 13.1601 9.72602C13.6847 10.2029 14 10.8713 14 11.5909C14 12.3105 13.6847 12.9789 13.1601 13.4558C12.6387 13.9298 11.9502 14.1818 11.25 14.1818H7C6.44772 14.1818 6 13.7341 6 13.1818C6 12.6295 6.44772 12.1818 7 12.1818H11.25C11.478 12.1818 11.6798 12.0986 11.8148 11.9759C11.9465 11.8561 12 11.7152 12 11.5909C12 11.4666 11.9465 11.3257 11.8148 11.2059C11.6798 11.0832 11.478 11 11.25 11H8.75C8.04979 11 7.36132 10.748 6.83989 10.274C6.31529 9.79705 6 9.12866 6 8.40909C6 7.68951 6.31529 7.02112 6.83989 6.5442Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 2C2.44772 2 2 2.44772 2 3V17C2 17.5523 2.44772 18 3 18H17C17.5523 18 18 17.5523 18 17V3C18 2.44772 17.5523 2 17 2H3ZM0 3C0 1.34315 1.34315 0 3 0H17C18.6569 0 20 1.34315 20 3V17C20 18.6569 18.6569 20 17 20H3C1.34315 20 0 18.6569 0 17V3Z" />
                    </svg>
                    Banking
                </router-link>

                <div class="list-reset ml-7 mb-4">
                    <router-link exact class="block mb-1 hover:text-teal-500 font-medium text-gray-300 font-bold" active-class="text-teal-500" to="/accounts">
                        Bank Accounts
                    </router-link>
                    <router-link class="block mb-1 hover:text-teal-500 font-medium text-gray-300 font-bold" active-class="text-teal-500" :to="{name: 'transactions.debits'}">
                        Expenditure
                    </router-link>
                    <router-link class="block mb-1 hover:text-teal-500 font-medium text-gray-300 font-bold" active-class="text-teal-500" :to="{name: 'transactions.credits'}">
                        Income
                    </router-link>
                    <router-link class="block mb-1 hover:text-teal-500 font-medium text-gray-300 font-bold" active-class="text-teal-500" :to="{name: 'transactions.categories'}">
                        Categories
                    </router-link>
                </div>

                <router-link class="flex items-center px-2 -mx-2 mb-2 py-1 hover:text-teal-500 font-medium text-gray-300 font-bold" active-class="text-teal-500" to="/invoices">
                    <svg class="h-4 w-4 mr-3" viewBox="0 0 18 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.87868 0.87868C1.44129 0.31607 2.20435 0 3 0H11C11.2652 0 11.5196 0.105357 11.7071 0.292893L17.7071 6.29289C17.8946 6.48043 18 6.73478 18 7V19C18 19.7957 17.6839 20.5587 17.1213 21.1213C16.5587 21.6839 15.7957 22 15 22H3C2.20435 22 1.44129 21.6839 0.87868 21.1213C0.31607 20.5587 0 19.7957 0 19V3C0 2.20435 0.31607 1.44129 0.87868 0.87868ZM3 2C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20H15C15.2652 20 15.5196 19.8946 15.7071 19.7071C15.8946 19.5196 16 19.2652 16 19V7.41421L10.5858 2H3Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11 0C11.5523 0 12 0.447715 12 1V6H17C17.5523 6 18 6.44772 18 7C18 7.55228 17.5523 8 17 8H11C10.4477 8 10 7.55228 10 7V1C10 0.447715 10.4477 0 11 0Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 12C4 11.4477 4.44772 11 5 11H13C13.5523 11 14 11.4477 14 12C14 12.5523 13.5523 13 13 13H5C4.44772 13 4 12.5523 4 12Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 16C4 15.4477 4.44772 15 5 15H13C13.5523 15 14 15.4477 14 16C14 16.5523 13.5523 17 13 17H5C4.44772 17 4 16.5523 4 16Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 8C4 7.44772 4.44772 7 5 7H7C7.55228 7 8 7.44772 8 8C8 8.55228 7.55228 9 7 9H5C4.44772 9 4 8.55228 4 8Z" />
                    </svg>
                    Invoices
                </router-link>

                <router-link class="flex items-center px-2 -mx-2 mb-2 py-1 hover:text-teal-500 font-medium text-gray-300 font-bold" active-class="text-teal-500" to="/contacts">
                    <svg class="h-4 w-4 mr-3" viewBox="0 0 24 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.46447 13.4645C2.40215 12.5268 3.67392 12 5 12H13C14.3261 12 15.5979 12.5268 16.5355 13.4645C17.4732 14.4021 18 15.6739 18 17V19C18 19.5523 17.5523 20 17 20C16.4477 20 16 19.5523 16 19V17C16 16.2044 15.6839 15.4413 15.1213 14.8787C14.5587 14.3161 13.7956 14 13 14H5C4.20435 14 3.44129 14.3161 2.87868 14.8787C2.31607 15.4413 2 16.2044 2 17V19C2 19.5523 1.55228 20 1 20C0.447715 20 0 19.5523 0 19V17C0 15.6739 0.526784 14.4021 1.46447 13.4645Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9 2C7.34315 2 6 3.34315 6 5C6 6.65685 7.34315 8 9 8C10.6569 8 12 6.65685 12 5C12 3.34315 10.6569 2 9 2ZM4 5C4 2.23858 6.23858 0 9 0C11.7614 0 14 2.23858 14 5C14 7.76142 11.7614 10 9 10C6.23858 10 4 7.76142 4 5Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.0318 12.88C19.1698 12.3453 19.7153 12.0237 20.25 12.1618C21.3227 12.4387 22.273 13.0641 22.9517 13.9397C23.6304 14.8152 23.9992 15.8914 24 16.9993L24 19C24 19.5523 23.5523 20 23 20C22.4477 20 22 19.5523 22 19L22 17.0007C22 17.0006 22 17.0008 22 17.0007C21.9994 16.3361 21.7782 15.6902 21.371 15.165C20.9638 14.6396 20.3936 14.2644 19.75 14.0982C19.2153 13.9602 18.8937 13.4148 19.0318 12.88Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0312 0.881962C15.1682 0.346936 15.713 0.0242632 16.248 0.161251C17.3236 0.436628 18.2768 1.06213 18.9576 1.93914C19.6383 2.81615 20.0078 3.89479 20.0078 5.005C20.0078 6.11521 19.6383 7.19385 18.9576 8.07086C18.2768 8.94787 17.3236 9.57337 16.248 9.84875C15.713 9.98574 15.1682 9.66307 15.0312 9.12804C14.8943 8.59301 15.2169 8.04824 15.752 7.91125C16.3973 7.74603 16.9692 7.37073 17.3777 6.84452C17.7861 6.31831 18.0078 5.67113 18.0078 5.005C18.0078 4.33887 17.7861 3.69169 17.3777 3.16548C16.9692 2.63928 16.3973 2.26398 15.752 2.09875C15.2169 1.96176 14.8943 1.41699 15.0312 0.881962Z" />
                    </svg>
                    Contacts
                </router-link>

            </nav>
        </div>
    </div>
</template>