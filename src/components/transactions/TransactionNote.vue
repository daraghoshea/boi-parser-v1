<template>
    <div class="relative">
        <resizeable-textarea>
            <textarea
                ref="textarea"
                :value="transaction.data.note"
                placeholder="Add note.."
                @input="updateNote(transaction.id, $event.target.value)"
                @click.stop="() => {}"
                class="resize-none w-full bg-transparent font-gray-700 italic pb-1 w-full outline-none border-b-2 border-transparent transition-all duration-700 ease-linear focus:border-teal-500"
                :class="{highlight: saving}"
                style="min-width: 115px"
                rows="1"></textarea>
        </resizeable-textarea>
        <slot name="saved-message">
            <transition name="fade">
                <svg v-if="showSaved" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="h-3 w-3 absolute bg-white mt-1 opacity-50 right-0 text-teal-700 top-0"
                ><polyline points="20 6 9 17 4 12"></polyline></svg>
            </transition>
        </slot>
    </div>
</template>
<script>
    import ResizeableTextarea from "../forms/ResizeableTextarea";
    import {debounce} from 'lodash'
    import {mapActions} from 'vuex'

    export default {
        components: { ResizeableTextarea },
        props: {
            transaction: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                saving: false,
                showSaved: false
            }
        },
        methods: {
            ...mapActions({
                setNote: 'transactions/SET_NOTE'
            }),
            updateNote: debounce(function(id, note) {
                this.saving = true;
                return this.setNote({id, note})
                    .then(() => {
                        this.saving = false;
                        this.saved();
                    })
            }, 500),
            saved() {
                this.showSaved = true;
                setTimeout(() => {
                    this.showSaved = false
                }, 1500)
            }
        }
    }
</script>

<style scoped>
    textarea {
        transition: all 500ms ease-in-out;
    }
    textarea.highlight {
        @apply border-teal-500 bg-teal-100;
    }
</style>