<template>
  <FormSelect
    v-model="result"
    :options="options"
    :disabled="disabled"
    label="User"
    :loading="loading"
    :optionValue="primaryKey"
    optionLabel="name"
  />
</template>

<script>
import SelectMixin from './selectMixin'

export default {
  mixins: [SelectMixin],
  /**
   * The data object for this component.
   * @typedef {Object} Data
   * @property {string} vuex_action - The Vuex action to call.
   * @property {string} vuex_getter - The Vuex getter to call.
   * @property {string} primaryKey - The primary key for the options.
   * @return {Data} The data object.
   */
  data: () => ({
    vuex_action: 'getUsersList',
    vuex_getter: 'users',
    primaryKey: 'user_id'
  })
}
</script>
