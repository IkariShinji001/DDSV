<template>
  <h2 class="h-title">Danh sách lớp chuyên ngành</h2>
  <q-layout class="container" view="lhh lpr fFf">
    <main>
      <q-header class="header">
        <q-input
          class="search-input"
          outlined
          v-model="seacrh"
          label="Tìm kiếm theo mã lớp hoặc tên lớp"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn class="btn-add" @click="open = true">Thêm lớp mới</q-btn>
      </q-header>

      <q-page-container>
        <p class="total-class">Hiện tại có {{ numberOfClass }} lớp chuyên ngành</p>
        <q-page class="wrapper">
          <q-dialog v-model="open">
            <q-card style="width: 700px; max-width: 80vw">
              <q-card-section>
                <div class="text-h6">Thêm lớp mới</div>
              </q-card-section>
              <q-card-section>
                <q-input class="input" v-model="classId" label-slot>
                  <template v-slot:label>
                    <p class="classId-input">Mã lớp</p>
                  </template>
                </q-input>
                <q-input class="input" label="Tên lớp" v-model="className" label-slot>
                  <template v-slot:label>
                    <p class="className-input">Tên lớp</p>
                  </template>
                </q-input>
                <q-btn class="create-class-btn" @click="handleCreateNewClass">Thêm lớp mới</q-btn>
              </q-card-section>
            </q-card>
          </q-dialog>

          <q-card style="width: 95%" class="class-contaier">
            <table style="width: 100%">
              <tr  style="width: 100%" v-for="(mclass, index) in classes" class="row-container">
                <td>
                  <router-link class="class-link" :to="'/class/' + mclass.class_id">
                    <li class="class">
                      {{ index + 1 }} . {{ mclass.class_id }} - {{ mclass.class_name }}
                    </li>
                  </router-link>
                </td>
                <td class="icon-container">
                    <q-icon class="icon" name="settings_applications"> </q-icon>
                    <q-icon class="icon" name="delete" @click="handleDeleteClass(mclass.class_id)"> </q-icon>
                </td>
              </tr>
            </table>
          </q-card>
        </q-page>
      </q-page-container>
    </main>
  </q-layout>
</template>

<script>
import { onBeforeMount, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import MajorClassService from '../services/majorClass.service'
import MajorClass from '../entities/MajorClass'

export default {
  setup() {
    const toast = useToast()
    const open = ref(false)
    const classes = ref([])
    const seacrh = ref()
    const classId = ref()
    const className = ref()
    const numberOfClass = ref()
    const majorClassService = new MajorClassService()

    onBeforeMount(async () => {
      try {
        classes.value = await majorClassService.getClasses()
        numberOfClass.value = classes.value.length
      } catch (error) {
        console.log(error)
      }
    })

    const handleSearch = async () => {
      try {
        classes.value = await majorClassService.getClasses(seacrh.value)
      } catch (error) {
        console.log(error)
      }
    }

    const handleCreateNewClass = async () => {
      console.log(classId.value)
      if (!classId.value) {
        toast.warning('Không được để trống Mã Lớp!!')
        return
      }

      if (!className.value) {
        toast.warning('Không được để trống Tên Lớp!!')
        return
      }

      try {
        const newClass = new MajorClass(classId.value, className.value)
        newClass.trim()

        const result = await majorClassService.create(newClass)
        classes.value.push({ class_id: result[0].class_id, class_name: result[0].class_name })
        toast.success('Đã thêm lớp thành công')
        numberOfClass.value++

        classId.value = ''
        className.value = ''
      } catch (error) {
        if (error.response.status === 400) {
          toast.error(error.response.data.message, { timeout: 2000 })
        }
      }
    }

    const handleDeleteClass = async (classId) => {
      try {
        const index = classes.value.findIndex(classm => classm.class_id === classId);
        await majorClassService.deleteClassById(classId);
        classes.value.splice(index,1);
        toast.success('Xóa thành công lớp ' + classId);
      } catch (error) {
        if(error.response.status === 400){
          toast.error('Không được xóa lớp khi lớp có sinh viên !!');
        }
      }
    }

    watch((seacrh) => {
      handleSearch()
    })

    return {
      open,
      classId,
      seacrh,
      className,
      handleCreateNewClass,
      classes,
      handleSearch,
      numberOfClass,
      handleDeleteClass
    }
  }
}
</script>

<style scoped>
.h-title {
  text-align: center;
  font-size: 35px;
  font-weight: bold;
}
.wrapper {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

ul {
  padding: 0 !important;
}

.class-contaier {
  height: fit-content;
}

a {
  text-decoration: none;
  color: black;
}

a:hover {
  color: white;
}

.class {
  width: 100%;
  font-size: 18px;
  padding: 10px;
  font-weight: bold;
  list-style: none;
}

.class:hover {
  cursor: pointer;
  background-color: #88bdbc;
}

.container {
  width: 90%;
  margin: 0 auto;
}

.input {
  font-size: 18px;
}

.header {
  display: flex;
  justify-content: space-around;
  background-color: transparent !important;
}

.btn-add {
  background-color: #88bdbc;
  padding: 0 50px;
  color: black;
  font-weight: bold;
  font-size: 16px;
}
.search-input {
  font-size: 18px;
  width: 70%;
  background-color: white;
}

.create-class-btn {
  display: flex;
  background-color: #1976d2;
  color: white;
  padding: 10px 30px;
  margin: 20px auto;
}

.classId-input,
.className-input {
  font-size: 18px;
  color: black;
}

.total-class {
  font-size: 18px;
  font-weight: bold;
  margin-left: 50px;
  margin-bottom: -20px;
  margin-top: 12px;
}

.icon-container{
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}
.icon {
  font-size: 27px;
  margin-top: 10px;
}
.icon:hover {
  color: red;
  cursor: pointer;
}
</style>
