<template>
  <div class="container">
    <el-container>
      <!-- Include FrontHeader.vue component -->
      <el-header>
        <front-header />
      </el-header>

      <!-- Include FrontMain.vue component -->
      <el-main>
        <div class="main">
          <front-main />
          <!-- Router outlet -->
          <!-- The component matched by the route will render here -->
          <router-view></router-view>
        </div>
      </el-main>

      <!-- Include FrontFooter.vue component -->
      <el-footer height="40px">
        <front-footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import FrontHeader from "../../components/FrontHeader.vue";
import FrontMain from "../../components/FrontMain.vue";
import FrontFooter from "../../components/FrontFooter.vue";
export default {
  data() {
    return {};
  },
  components: { FrontHeader, FrontMain, FrontFooter },
};
</script>

<!-- <style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .el-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 90%;
    width: 90%;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
    }

    .el-header,
    .el-footer {
      padding: 20px;
      text-align: center;
      background: #409eff;
      color: white;
      transition: background 0.3s ease;

      &:hover {
        background: darken(#409eff, 10%);
      }
    }

    .el-main {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: #fff;
      transition: transform 0.3s ease, background-color 0.3s ease;

      &:hover {
        background-color: #f9f9f9;
      }

      .main {
        width: 80%;
        height: 100%;
        transition: width 0.3s ease;

        &:hover {
          width: 85% !important;
        }
      }
    }
  }
}
</style> -->
