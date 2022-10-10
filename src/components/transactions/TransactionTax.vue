<template>
    <div class="relative">
      <div v-if="display">

        <div>
          <input
             type="text"
             ref="input"
             :value="value"
             @input="onInputChange"
             placeholder="0.00"
             class="bg-white pr-1 font-gray-700 text-right italic mb-1 w-full outline-none border-b-2 border-transparent transition-all duration-700 ease-linear focus:border-teal-500"
             style="min-width: 50px; max-width: 80px;"
          />

          <p>
            <button
                type="button"
                class="text-blue-500 text-sm hover:underline mr-2"
                @click.stop="clearTax"
            >clear</button>
            <span class="text-gray-500 text-sm">{{percentage}}</span>
          </p>
        </div>

      </div>

      <input v-else type="checkbox" @click.stop="showTax" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
    </div>
</template>
<script>
    import {debounce} from 'lodash'
    import {mapActions} from 'vuex'
    import { money, formatMoney, textToMoney } from '../../utils/money'
    import { toPercentageString } from '../../utils'

    export default {
        props: {
            transaction: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                display: false,
                value: '',
            }
        },
        mounted() {
          if (this.transaction.tax) {
            this.display = true
            this.value = formatMoney(this.transaction.tax)
          }
        },
        computed: {
          percentage() {
            let gross = this.transaction.data.value.amount;
            let nett = gross - this.transaction.tax.amount;
            return toPercentageString( this.transaction.tax.amount / nett )
          }
        },
        methods: {
            ...mapActions({
                setTax: 'transactions/SET_TAX'
            }),
            onInputChange: debounce(function(inputEvent) {
                let tax = null;
                try {
                  tax = textToMoney(inputEvent.target.value)
                } catch(e) {
                  tax = textToMoney("0.00");
                }

                return this.setTax({id: this.transaction.id, tax: tax.toObject()})
                    .then(() => this.value = formatMoney(tax))
            }, 500),
            clearTax() {
              this.setTax({id: this.transaction.id, tax: null})
              this.display = false;
            },
            showTax() {

              let percentage = 0.23;

              // To reverse-engineer the tax amount, need to divide the gross amount by (1 + percentage)
              // to get the net amount, and then multiply by the percentage value to get the tax amount.
              let tax = money(this.transaction.data.value).multiply(percentage/(1+percentage))

              this.setTax({ id: this.transaction.id, tax: tax.toObject() })
                  .then(() => {
                    this.display = true;
                    this.$nextTick(() => this.$refs.input.focus())
                    this.value = formatMoney(tax)
                  });
            }
        }
    }
</script>