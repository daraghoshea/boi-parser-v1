<template>
  <div>
    <input type="file" ref="fileInput"
           class="fileinput" name="fileinput" id="fileinput"
           accept="application/pdf" multiple
           @change="onChange">
    <label for="fileinput"
           class="py-2 px-4 rounded-full inline-block text-white bg-indigo-600 hover:bg-indigo-700 font-bold cursor-pointer"
    >Upload PDF Statements</label>
  </div>
</template>

<script>
  export default {
    name: 'PdfInput',
    methods: {
      onChange(evt) {
        this.$emit( 'uploaded', Array.from(evt.target.files) );
      }
    }
  }
</script>

<style>
  .fileinput {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
</style>