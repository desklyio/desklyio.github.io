<template>
  <div>
    <slot/>
    <svg style="display:none" xmlns="http://www.w3.org/2000/svg">
      <filter id="liquid-glass" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence
            type="fractalNoise"
            baseFrequency="0.003 0.004"
            numOctaves="2"
            seed="3"
            result="turbulence" />

        <!-- Slightly warp the image -->
        <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="200"
            xChannelSelector="R"
            yChannelSelector="G" />
        <feGaussianBlur stdDeviation="0.5" />
      </filter>
    </svg>
  </div>
</template>
<script setup lang="ts">
</script>
