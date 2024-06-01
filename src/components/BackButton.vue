<template>
    <div class="float-start">
        <span class="fa-stack" id="backButton" @click="backToApp">
            <i class="fa-solid fa-circle fa-stack-2x"></i>
            <i class="fa-solid fa-chevron-left fa-stack-1x fa-inverse" @click="back()"></i>
        </span>
    </div>
</template>
<script>
export default {
    setup() {
        const back = () => {
            window.history.back();
        }

        return {
            back,
        }
    }
}
</script>
<style scoped>
.base-page__heading-short .fa-chevron-left {
    font-size: 12px;
}

.base-page__heading i.fa-circle,
.base-page__heading-short i.fa-circle {
    color: #d97706;
    cursor: pointer;
}

.base-page__heading span.fa-stack,
.base-page__heading-short span.fa-stack {
    font-size: 12px;
}

.float-start {
    margin-right: 25px;
}
</style>