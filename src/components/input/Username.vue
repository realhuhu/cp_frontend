<template>
  <div style="height: 75px">
    <var-input
      clearable
      :placeholder="placeholder || '用户名'"
      :rules="this.$settings.validators.username"
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