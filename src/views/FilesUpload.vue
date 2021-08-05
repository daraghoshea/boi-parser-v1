<template>
    <main class="h-full flex items-center justify-center">
        <section class="p-6 bg-gray-100">
            <pdf-input class="text-center" @uploaded="onUpload"></pdf-input>
            <p class="text-gray-500 text-center pt-6">
                You can select more than one file at a time.
            </p>
        </section>
    </main>
</template>

<script>
    import PdfInput from "../components/forms/PdfInput";
    import {mapActions} from 'vuex'
    export default {
        components: {PdfInput},
        methods: {
            ...mapActions({
                addMultiple: 'files/ADD_MULTIPLE'
            }),
            onUpload(files) {
                this.addMultiple( { files } );

                this.$router.push('/files');
            }
        }
    }
</script>