<template>
    <div class="flex">

        <transition name="slide">
            <side-navigation v-if="showingSidebar" class="flex-grow" style="min-width: 210px"></side-navigation>
        </transition>

        <article class="lg:max-h-full lg:overflow-visible lg:static min-h-screen w-full" :class="{'border-l-4 border-teal-500': !showingSidebar}">

            <header class="h-16 px-6 border-gray-300 border-b flex items-center no-print">
                <button type="button" @click="toggleSidebar" class="appearance-none focus:outline-none outline-none text-teal-500 mr-4">

                    <svg v-if="showingSidebar" id="hide-sidebar-svg" class="h-4 w-4 transition-transform duration-500 ease-in-out hover:pl-1" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 11L1 6L6 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M13 11L8 6L13 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                    <svg v-else id="show-sidebar-svg" class="h-4 w-4 transition-transform duration-500 ease-in-out group-hover:right-px" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 11L13 6L8 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M1 11L6 6L1 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>

                <slot name="header">
                    <h1>Page Title</h1>
                </slot>
            </header>

            <div class="pt-6 pb-16 w-full">
                <div class="mb-6 px-6 mx-auto">
                    <slot>
                        <router-view></router-view>
                    </slot>
                </div>
            </div>

        </article>

    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import SideNavigation from '../components/SideNavigation';
    export default {
        name: 'app-layout',
        components: {SideNavigation},
        computed: {
            ...mapGetters({
                showingSidebar: 'app/SHOW_SIDEBAR'
            })
        },
        methods: {
            ...mapMutations({
                toggleSidebar: 'app/TOGGLE_SIDEBAR'
            })
        }
    }
</script>

<style scoped>
    /* durations and timing functions.              */
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active below version 2.1.8 */ {
        transform: translateX(-100%);
        opacity: 0;
    }

    #hide-sidebar-svg, #show-sidebar-svg {

    }
    #hide-sidebar-svg:hover {
        transform: translateX(-5px);
    }

    #show-sidebar-svg:hover {
        transform: translateX(5px);
    }
</style>