<template>
    <section>
        <header class="pb-2 mb-6 border-gray-400 border-b flex items-center">
            <slot name="header">
                <h1>Transactions</h1>
            </slot>
            <nav class="flex ml-auto">
                <router-link :to="{name: 'transactions.debits'}" exact class="text-gray-600 hover:text-gray-900 font-bold" active-class="text-gray-900">Debits</router-link>
                <router-link :to="{name: 'transactions.crebits'}" class="text-gray-600 hover:text-gray-900 font-bold ml-3" active-class="text-gray-900">Credits</router-link>
                <router-link :to="{name: 'transactions.categories'}" class="text-gray-600 hover:text-gray-900 font-bold ml-3" active-class="text-gray-900">Categories</router-link>
            </nav>
        </header>

        <slot />
    </section>
</template>