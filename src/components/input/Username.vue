<template>
  <div style="height: 75px">
    <var-input
      clearable
      :placeholder="placeholder || '一卡通号'"
      :rules="this.$settings.validators.card"
      v-model="username"
      @change="$emit('update:username',username)"
    />
  </div>
</template>

<script>
  export default {
    name: "username",
    props: {
      placeholder: null,
      username: String
    },
    emits: ["update:username"]
  }
</script>

<style scoped>

</style>