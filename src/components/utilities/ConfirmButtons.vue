<template>
    <confirm is="fieldset" :disabled="disabled">
        <div slot-scope="{check, checking, cancel}" v-bind="$attrs">
            <!-- Initial -->
            <slot>
                <button type="button" v-if="!checking" @click="check" class="px-3 py-2 rounded bg-indigo-700 text-white" :class="[disabled ? 'opacity-50' : 'hover:bg-indigo-500']">
                    {{btn}}
                </button>
            </slot>
            <!-- Confirm -->
            <slot name="checking" v-if="checking">
                <button type="button" @click="cancel" class="px-3 py-2 rounded bg-white border border-indigo-700 text-indigo-700 mr-4" :class="[disabled ? 'opacity-50' : 'hover:border-indigo-900 hover:text-indigo-900']">
                    {{cancelBtn}}
                </button>
                <button type="button" @click="confirm" class="px-3 py-2 rounded bg-indigo-700 text-white" :class="[disabled ? 'opacity-50' : 'hover:bg-indigo-500']">
                    {{confirmBtn}}
                </button>
            </slot>
        </div>
    </confirm>
</template>

<script>
    import Confirm from "./Confirm";
    export default {
        components: {Confirm},
        props: {
            confirm: {
                type: Function,
                default: function() {
                    /** Dummy to show how a wait for processing looks */
                    this.confirming = true;
                    setTimeout(() => {
                        this.confirming = false
                    }, 500)
                }
            },
            btn: {
                type: String,
                default: 'Save'
            },
            cancelBtn: {
                type: String,
                default: 'Cancel'
            },
            confirmBtn: {
                type: String,
                default: 'Yes'
            }
        },
        computed: {
            disabled() {

            }
        },
        data() {
            return {
                confirming: false
            }
        },
        methods: {

        }
    }
</script>