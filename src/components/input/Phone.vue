<template>
  <div style="height: 75px">
    <var-input
      clearable
      :placeholder="placeholder || '11位电话号码'"
      :rules="$settings.validators.phone"
      v-model="phone"
      :disabled="disabled"
      @change="$emit('update:phone',phone)"
    />
  </div>
</template>

<script>
  export default {
    name: "Phone",
    props: {
      placeholder: null,
      phone: {},
      disabled:false
    },
    emits: ["update:phone"]
  }
</script>

<style scoped>

</style>