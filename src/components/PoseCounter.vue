<template>
    <div v-html="poseCounterFunction.html" class="container mt-5"></div>
</template>

<script>
import { onBeforeUnmount,onMounted } from "vue";
import poseCounterFunction from "../js/poseCounterFunction";

export default {
    setup() {
        onMounted(async () => await init());

        const init = () => {
            const scripts = poseCounterFunction.scripts;
            scripts.forEach((src) => {
                let ele = document.createElement("script");
                ele.setAttribute("src", src);
                document.head.appendChild(ele);
            });
            let ele = document.createElement("script");
            ele.setAttribute("type", "text/javascript");
            ele.innerHTML = poseCounterFunction.func;
            document.head.appendChild(ele);
        };

        onBeforeUnmount(() => {
            // PoseDataService.updatePose()
            //     .then((response) => {
            //         console.log(response.data);
            //     })
            //     .catch((e) => {
            //         console.log(e);
            //     });
        });

        return {
            poseCounterFunction,
        };
    },
};
</script>

<style></style>
