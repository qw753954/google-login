<template>
  <div class="container">
    <div>
      <div class="btn-box">
        <button class="login-btn" @click="loginGoogle">
          <img src="/assets/images/logo.png" class="icon" alt="Google icon" />
          登入！
        </button>

        <div class="render-btn" ref="renderEl"></div>
      </div>

      <div class="card" v-if="loginUser">
        <div class="card-header">
          <img :src="loginUser?.picture" alt="avatar" />
        </div>
        <div class="card-body">
          <p><span class="title">會員名稱：</span>{{ loginUser?.name }}</p>
          <p><span class="title">會員信箱：</span>{{ loginUser?.email }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
type TGoogleIdentityRes = {
  credential: string;
  select_by: string;
  state?: string; // only exists when click "使用 Google 帳戶登入"(google renderButton api) button to log in.
};

type TCredentialData = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
};

const config = useRuntimeConfig();
const loginUser = ref<TCredentialData>();
const renderEl = ref<HTMLElement | null>(null);

const loginGoogle = () => {
  /** 觸發彈出 Google 的登入彈出視窗 */
  google.accounts.id.prompt();
};

const parseJwtToken = (token?: string) => {
  if (!token) return "";

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

const handleCredentialResponse = (res?: TGoogleIdentityRes) => {
  // credential: 以 base64 編碼的 JSON Web Token (JWT) 字串形式呈現，需解碼
  loginUser.value = parseJwtToken(res?.credential);
  console.log(loginUser);
};

onMounted(() => {
  /**
   * 初始化 Google Identity Services (GIS) 的身份驗證功能
   * 並將指定 client_id 註冊到 SDK，讓 Google 知道這個應用程式的身份
   */
  google.accounts.id.initialize({
    client_id: config.public.googleClientId,
    callback: handleCredentialResponse,
  });

  /** 顯示「使用 Google 帳戶登入」按鈕 */
  google.accounts.id.renderButton(
    renderEl.value,
    { theme: "outline", size: "large" } // customization attributes
  );
});
</script>

<style lang="scss">
@import "assets/scss/all.scss";

.btn-box {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 80px;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;

  .icon {
    height: 50px;
  }
}

.card {
  background: #f5f5f5;
  padding: 24px 20px;
  border-radius: 24px;
  min-width: 280px;
  margin: 0 auto;

  &-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;

    img {
      display: block;
      margin-bottom: 8px;
    }
  }

  &-body {
    display: grid;
    gap: 12px;

    .title {
      font-weight: bold;
    }
  }
}
</style>
