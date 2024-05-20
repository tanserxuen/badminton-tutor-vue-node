<!-- <template>
  <div>
    <div v-html="poseCounterFunction.html" class="container mt-5"></div>
    <input type="file" name="" id=""/>
    <input type="file" name="" id=""/>
    <button @click="generateImageDifference">generateImageDifference</button>
  </div>
</template>

<script>
import { onBeforeUnmount, onMounted } from "vue";
import poseCounterFunction from "../js/poseCounterFunction";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default {
  setup() {
    onMounted(async () => {
      await init();
    });

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

    const genAI = new GoogleGenerativeAI(
      "AIzaSyCUX_w3rZur1j6Xe70BiMiy8T856inLDo0"
    );

    async function fileToGenerativePart(file) {
      const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(file);
      });
      return {
        inlineData: {
          data: await base64EncodedDataPromise,
          mimeType: file.type,
        },
      };
    }

    async function generateImageDifference() {
      // For text-and-images input (multimodal), use the gemini-pro-vision model
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

      const prompt = "What's different between these pictures?";

      const fileInputEl = document.querySelector("input[type=file]");
      const imageParts = await Promise.all(
        [...fileInputEl.files].map(fileToGenerativePart)
      );

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      console.log(text);
    }

    return {
      poseCounterFunction,
    //   model,
      //   generateOutput,
      generateImageDifference
    };
  },
};
</script>

<style></style> -->
