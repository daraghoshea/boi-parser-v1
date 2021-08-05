<template>
    <section class="p-8">
        <p>{{transactions.length}} transactions found.</p>
        <table class="transactions-table w-full">
            <thead>
                <tr>
                    <th class="p-2 text-left">Date</th>
                    <th class="p-2 text-left">Desc</th>
                    <th class="p-2 text-right">Out</th>
                    <th class="p-2 text-right">In</th>
                    <th class="p-2 text-right">Balance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="p-3 bg-gray-100 font-bold text-left border-gray-400 border-l" colspan="2">Opening Balance</td>
                    <td class="p-3 pl-6 bg-gray-100 font-bold text-right border-gray-400 border-l"></td>
                    <td class="p-3 pl-6 bg-gray-100 font-bold text-right border-gray-400 border-l"></td>
                    <td class="p-3 pl-6 bg-gray-100 font-bold text-right border-gray-400 border-l border-r"></td>
                </tr>
            </tbody>
            <tbody>
                <tr v-for="(transaction, i) in transactions" :key="i">
                    <td class="p-3 text-left border-gray-400 border-l">
                        {{transaction.data.date}}
                    </td>
                    <td class="p-3 text-left">{{transaction.data.desc}}</td>
                    <td class="p-3 pl-6 text-right border-gray-400 border-l">
                        <span v-if="transaction.data.type === 'dr'">
                            {{formatMoney(transaction.data.value.amount)}}
                        </span>
                    </td>
                    <td class="p-3 pl-6 text-right border-gray-400 border-l">
                        <span v-if="transaction.data.type === 'cr'">
                            {{formatMoney(transaction.data.value.amount)}}
                        </span>
                    </td>
                    <td class="p-3 pl-6 text-right border-gray-400 border-l border-r">

                    </td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td class="p-3 bg-gray-100 font-bold text-left border-gray-400 border-l" colspan="2">Closing Balance</td>
                    <td class="p-3 pl-6 bg-gray-100 font-bold text-right border-gray-400 border-l"></td>
                    <td class="p-3 pl-6 bg-gray-100 font-bold text-right border-gray-400 border-l"></td>
                    <td class="p-3 pl-6 bg-gray-100 font-bold text-right border-gray-400 border-l border-r"></td>
                </tr>
            </tbody>
        </table>

    </section>
</template>

<script>
import { money } from "../utils";

export default {
    props: {
        transactions: Array
    },
    data() {
        return {

        }
    },
    methods: {
        formatMoney(value) {
            return money(value).toFormat("0,0.00");
        }
    }
}
</script>