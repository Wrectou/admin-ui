<template>
  <!-- 标题组件 -->
  <p class="question-title" v-if="questionTitleObj.title">
    <span class="fraction" v-if="questionTitleObj.fraction">({{questionTitleObj.fraction}}分)</span>
    <div class="title">{{questionTitleObj.title}}</div>
    <div :class="['collect', questionTitleObj.isCollect?'check':'']" @click="changeCollect">
      <el-icon :size="24"><star-filled /></el-icon>
    </div>
  </p>
</template>

<script setup name="QuestionTitle">

  const props = defineProps({
    questionTitleObj: {
      type: Object,
      default: {
        fraction: '',
        title: '',
        isCollect: false
      }
    }
  })

  const emit = defineEmits(['changeCollectTitle'])

  const changeCollect = () => emit('changeCollectTitle')

</script>

<style lang="scss" scoped>
.question-title{
  display: flex;
  align-items: center;
  .fraction{
    margin: 0 10px 0 0;
    color: rgb(64, 158, 255);
  }
  .title{
    flex: 1;
    font-size: 20px;
  }
  .collect{
    color: #999;
    cursor: pointer;
  }
  .collect.check{
    color: rgba(250, 212, 0, 1);
  }
}
</style>
