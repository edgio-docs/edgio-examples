<template>
  <div class="border-b border-primary-med">
    <div :class="{ container: useContainer }">
      <div
        class="flex flex-row items-center z-10 cursor-pointer"
        @click="toggleExpanded()"
      >
        <strong class="py-3 text-md">{{ heading }}</strong>
        <div
          class="ml-auto transition-all transition-fast ease-in-out"
          :class="{ 'rotate-1/2': isExpanded }"
        >
          <BaseIcon icon="uil:angle-down" size="lg" />
        </div>
      </div>

      <HeightExpansion>
        <div v-show="isExpanded">
          <slot />
        </div>
      </HeightExpansion>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccordionItem',

  props: {
    index: {
      type: Number,
      default: 0,
    },
    heading: {
      type: String,
      default: 'Heading',
    },
    useContainer: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isExpanded: false,
    }
  },

  methods: {
    toggleExpanded() {
      this.isExpanded = !this.isExpanded
    },
  },
}
</script>
