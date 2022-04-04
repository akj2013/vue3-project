<template>
  <div>
  <!-- Subject -->
  <div class="col-6">
    <div class="form-group">
      <label>{{ labelSubject }}</label>
      <!--
        :value에서는 props에서 받아온 값을 사용만 하지, 바인딩 되어 있지 않기 때문에
        onInput 이벤트를 발생시키도록 한다.
      -->
      <input :value="subject" @input="onInput" type="text" class="form-control">
      <div v-if="error" class="text-red">
        {{error}}
      </div>
    </div>
  </div>
  <!-- Completed -->
  <div v-if="editing" class="col-6">
    <div class="form-group">
      <label>{{ labelCompleted }}</label>
      <div>
        <!-- class 바인딩 -->
        <!-- type이 button이면 form에 대한 submit을 하지 않는다. @click.stop으로도 안 먹힌다. -->
        <button class="btn" :class="completed ? 'btn-success' : 'btn-danger'"
          type="button" 
          @click="onClickCompleted"
        >
          {{ completed ? 'Completed' : 'Incompleted'}}
        </button>
      </div>
    </div>
  </div>
  <!-- Body -->
  <div class="col-12">
    <div class="form-group">
      <label>{{ labelBody }}</label>
      <textarea :value="body" @input="onInputBody" class="form-control" cols="30" rows="10"></textarea>
    </div>
  </div>
  </div>
</template>

<script>
// import { getCurrentInstance } from 'vue'; // emit 사용 시 setup 파라미터 없이 쓸 수 있다.
export default {
  props: {
    labelSubject: {
      type: String,
      required: true
    },
    labelCompleted: {
      type: String,
      required: true
    },
    labelBody: {
      type: String,
      required: true
    },
    error: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    editing: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const onInput = (e) => {
      emit('update:subject', e.target.value);
    };

    const onInputBody = (e) => {
      console.log("body : " + e.target.value);
      emit('update:body', e.target.value);
    };

    const onClickCompleted = (e) => {
      emit('toggle-TodoStatus');
    };

    return {
      onInput,
      onInputBody,
      onClickCompleted,
    }
  }
}
</script>

<style scoped>
.text-red {
  color: red;
}
</style>