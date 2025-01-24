<script setup lang="ts">
import { onBeforeUpdate } from 'vue'

onBeforeUpdate(() => {
  console.log('T beforeUpdate ing')
})
</script>
