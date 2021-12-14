<template>
    <div class="about">
        <v-header />
        <v-sidebar />
        <div class="content-box" :class="{ 'content-collapse': collapse }">
            <v-tags></v-tags>
            <div class="content">
                content
            </div>
        </div>
    </div>
</template>
<script>

import vHeader from "../components/Header.vue";
import vSidebar from "../components/Sidebar.vue";
export default {
    components: {
        vHeader,
        vSidebar
    },

};
</script>
