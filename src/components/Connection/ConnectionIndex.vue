<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">
      <BackButton />Connections
    </h2>
    <div class="base-page__inner-margin">
      <div class="flex">
        <label for="location-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
        <div class="relative w-full">
          <input type="search" id="location-search"
            class="block p-2.5 mb-3 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-lg"
            placeholder="Search anyone..." @input="keyword = $event.target.value;" :value="keyword" />
          <i :class="{ 'fas fa-times': keyword }" @click="keyword = ''"></i>
          <button type="submit"
            class="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white hover:bg-gray-100"
            style="background-color: rgb(255, 242, 224)">
            <i class="fas fa-search text-gray-500"></i>
            <span class="sr-only">Search</span>
          </button>
        </div>
      </div>

      <div class="flex flex-wrap text-sm font-medium text-center border-b border-gray-200" style="overflow-x: auto;">
        <div class="me-2" style="min-width: max-content">
          <a v-for="status in statuses" :key="status" href="#" aria-current="page" class="inline-block p-4 rounded-t-lg"
            :class="activeTab == status
              ? 'text-amber-600 bg-amber-100 active'
              : 'hover:text-amber-600 hover:bg-orange-50'
              " @click="activeTab = status">{{ status }} &nbsp; <span :class="badgeNumberClass(status)">{{
                getBadgeNumbers(status) }}</span></a>
        </div>
      </div>
      <!--tab displays -->
      <div>
        <template v-if="userTypes[activeTab]?.length">
          <div v-for="user in filteredUsers" :key="user?.id" class="card-bar">
            <div class="w-full">
              <div
                class="border border-gray-100 bg-white rounded-lg p-4 flex flex-col justify-between leading-normal hover:bg-amber-50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <img class="w-10 h-10 rounded-full mr-4" :src="user.image == ''
                      ? '/images/placeholderImg.jpg'
                      : user.image
                      " :alt="user.name" />
                    <div class="text-sm">
                      <p class="text-gray-900 leading-none text-base font-semibold mb-1">
                        {{ user.name == "" ? "Badminton User" : user.name }}
                      </p>
                      <p class="text-gray-600 text-xs">
                        {{ user.email }}
                      </p>
                    </div>
                  </div>
                  <button class="primary-button" @click="changeStatus(activeTab, user.id)">
                    {{ getDisplayWord(activeTab) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="isLoading">
          <lottie-animation path="images/loading.json" :width="150" :height="150" />
        </template>
        <template v-else>
          <lottie-animation path="images/no_data_found.json" :width="350" :height="350" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineAsyncComponent, onMounted, reactive, ref } from "vue";
import UserService from "@/js/services/user.js";
import { useStore } from "vuex";
import getDateFromTimestamp from "@/js/services/date.js";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";

export default {
  components: {
    LottieAnimation,
    BackButton: defineAsyncComponent(() => import("@/components/BackButton.vue")),
  },
  setup() {
    const store = useStore();
    const statuses = [
      "connect", //all available users
      "requesting", //users that I requested to connect
      "requests", //users that requested to connect me
      "follower", //users that follow me
      "following", //users that I follow
    ];
    const isLoading = ref(true);
    const activeTab = ref(statuses[0]);
    const userDetails = ref(null);
    const userTypes = reactive({
      connect: [],
      requesting: [],
      requests: [],
      follower: [],
      following: [],
    });
    const keyword = ref("");

    const date = computed(() => {
      return (timestamp) => {
        return getDateFromTimestamp(timestamp);
      };
    });

    const getBadgeNumbers = (status) => {
      if(!userTypes) return '';
      const num = userTypes[status]?.length;
      if (status == "following" || status == "follower") return '';
      return num > 0 ? num : '';
    }

    const badgeNumberClass = (status) => {
      const num = userTypes[status]?.length && !(status == "following" || status == "follower");
      return num > 0 ? 'bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full' : '';
    }

    const getDisplayWord = (status) => {
      switch (status) {
        case "connect":
          return "Connect";
        case "requesting":
          return "Cancel Request";
        case "requests":
          return "Accept";
        case "follower":
          return "Remove";
        case "following":
          return "Unfollow";
        default:
          return "Connect";
      }
    };

    const changeStatus = (activeTab, targetUserId) => {
      // to unfollow or remove follower, we need to change the status to connect
      if (activeTab == "follower" || activeTab == "following") {
        console.log({
          userId: userDetails.value?.id,
          targetUserId,
          newStatus: "",
          oldStatus: activeTab,
        });
        UserService.updateConnects({
          userId: userDetails.value?.id,
          targetUserId,
          newStatus: "",
          oldStatus: activeTab,
        }).then((response) => {
          console.log(response);
          fetchUserConnections();
        });
        return;
      }

      // to cancel request, we need to change the status to connect
      if (activeTab == "requesting") {
        console.log({
          userId: userDetails.value?.id,
          targetUserId,
          newStatus: "",
          oldStatus: activeTab,
        });
        UserService.updateConnects({
          userId: userDetails.value?.id,
          targetUserId,
          newStatus: "",
          oldStatus: activeTab,
        }).then((response) => {
          console.log(response);
          fetchUserConnections();
        });
        return;
      }

      // to accept request, we need to change the status to connect
      const oldStatusIndex = statuses.indexOf(activeTab);
      const newStatus = statuses[oldStatusIndex + 1];
      console.log({
        userId: userDetails.value?.id,
        targetUserId,
        newStatus: newStatus,
        oldStatus: activeTab,
      });
      UserService.updateConnects({
        userId: userDetails.value.id,
        targetUserId,
        newStatus,
        oldStatus: activeTab,
      }).then((response) => {
        console.log(response);
        fetchUserConnections();
      });
    };

    const filteredUsers = computed(() => {
      if (userTypes[activeTab.value]?.length == 0) return [];
      if (keyword.value == "") return userTypes[activeTab.value];
      return userTypes[activeTab.value].filter(user => user.name.toLowerCase().includes(keyword.value.toLowerCase()) || user.email.toLowerCase().includes(keyword.value.toLowerCase()));
    });

    const fetchUserConnections = async () => {
      await UserService.getConnects(userDetails.value?.id).then((response) => {
        const { connect, requesting, requests, follower, following } =
          response.data;
        userTypes.connect = connect;
        userTypes.requesting = requesting;
        userTypes.requests = requests;
        userTypes.follower = follower;
        userTypes.following = following;
        isLoading.value = false;
      });
    }

    onMounted(async () => {
      userDetails.value = await store.getters.getCurrentUserDetails;
      console.log({ userDetails: userDetails.value?.id }, { state: store.getters.getCurrentUserDetails })
      await fetchUserConnections();
    });

    return {
      activeTab,
      statuses,
      changeStatus,
      userTypes,
      getDisplayWord,
      date,
      isLoading,
      getBadgeNumbers,
      badgeNumberClass,
      keyword, 
      filteredUsers
    };
  },
};
</script>

<style scoped>
a[href] {
  text-transform: capitalize;

  @media screen and (max-width: 640px) {
    padding-inline: 10px;
    font-size: 13px;
  }
}

img {
  object-fit: cover;
  object-position: center;
}

input[type="search"] {
  border: 0;
}

.card-bar {
  margin-top: 1rem;

  @media screen and (max-width: 640px) {
    margin-top: 0.5rem;
  }
}

input[type="search"] {
  box-shadow: none;
}

.fas.fa-times {
  right: 50px;
  color: white;
  background: lightgray;
  padding: 5px;
  border-radius: 100%;
  font-size: 10px;
  top: 40%;
  transform: translateY(-50%);
  position: absolute;
}
</style>
