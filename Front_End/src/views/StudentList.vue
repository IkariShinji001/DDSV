<template>
  <div class="container">
    <h2 class="title">Danh sách sinh viên lớp {{ className[0].class_name }} - {{ classId }}</h2>
    <section class="header-container">
      <q-input class="search" outlined v-model="search" label="Tìm kiếm theo MSSV hoặc Họ Tên">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-btn class="btn-open-add" @click="openCreateStudent">Thêm sinh viên</q-btn>
    </section>
    <div>
      <p class="total-student">Lớp có {{ numberOfStudent }} sinh viên</p>
    </div>
    <section v-if="students.length !== 0">
      <table>
        <tr>
          <th class="stt">STT</th>
          <th>MSSV</th>
          <th>Họ và tên</th>
          <th>Email</th>
          <th>Chức năng</th>
        </tr>

        <tr v-for="(student, index) in students" :key="index">
          <td class="cl-idex">{{ index + 1 }}</td>
          <td class="cl-id">{{ student.student_id }}</td>
          <td class="cl-name">{{ student.full_name }}</td>
          <td class="cl-email">{{ student.email }}</td>
          <td>
            <q-icon
              class="delete-btn"
              name="delete"
              @click="handleDeleteStudent(student.student_id)"
            ></q-icon>
            <q-icon
              class="update-btn"
              name="manage_accounts"
              @click="openUpdateStudent(student.student_id, student.full_name)"
            ></q-icon>
          </td>
        </tr>
      </table>
    </section>

    <section v-if="students.length === 0 && !search">
      <h2 class="title-noc">Lớp này chưa có sinh viên</h2>
    </section>

    <section>
      <q-dialog v-model="openAdd">
        <q-card style="width: 700px; max-width: 80vw">
          <q-card-section>
            <div class="text-h6">
              Thêm sinh viên vào lớp {{ className[0].class_name }} - {{ classId }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-input class="input" v-model="studentId" label-slot>
              <template v-slot:label>
                <p class="input-label">Mã số sinh viên</p>
              </template>
            </q-input>
            <q-input class="input" v-model="fullName" label-slot>
              <template v-slot:label>
                <p class="input-label">Họ và tên sinh viên</p>
              </template>
            </q-input>
            <q-btn class="btn-add" @click="handleCreateStudent">Thêm sinh viên</q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
    </section>

    <section>
      <q-dialog v-model="openUpdate">
        <q-card style="width: 700px; max-width: 80vw">
          <q-card-section>
            <div class="text-h6">Cập nhật thông tin sinh viên</div>
          </q-card-section>
          <q-card-section>
            <q-input class="input" v-model="studentId" label-slot>
              <template v-slot:label>
                <p class="input-label">Mã số sinh viên</p>
              </template>
            </q-input>
            <q-input class="input" v-model="fullName" label-slot>
              <template v-slot:label>
                <p class="input-label">Họ và tên sinh viên</p>
              </template>
            </q-input>
            <q-select
              label="Lớp chuyên ngành"
              class="input"
              v-model="classIdStudent"
              :options="allClass"
              option-label="class_id"
              option-value="class_id"
              emit-value
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label class="class-select-label">{{ scope.opt.class_id }}</q-item-label>
                    <q-item-label class="class-select-label" caption>{{ scope.opt.class_name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-btn class="btn-add" @click="handleUpdateStudent(studentId, fullName)"
              >Cập Nhật</q-btn
            >
          </q-card-section>
        </q-card>
      </q-dialog>
    </section>
  </div>
</template>

<script>
import { ref, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import MajorClassService from '../services/majorClass.service'
import StudentService from '../services/student.service'
import Student from '../entities/Student'

export default {
  name: 'StudentList',
  setup() {
    const toast = useToast()
    const route = useRoute()
    const majorClassService = new MajorClassService()
    const studentService = new StudentService()

    const openAdd = ref(false)
    const openUpdate = ref(false)
    const className = ref()
    const studentId = ref()
    const fullName = ref()
    const students = ref([])
    const classId = ref()
    const search = ref()
    const numberOfStudent = ref()
    const studentIdBeforeUpdate = ref()
    const allClass = ref()
    const classIdStudent = ref()

    onBeforeMount(async () => {
      try {
        classId.value = route.params.classId
        classIdStudent.value = classId.value
        allClass.value = await majorClassService.getClasses()
        console.log(allClass.value)
        className.value = await majorClassService.getClassById(classId.value)
        students.value = await majorClassService.getStudentsByClassId(classId.value)
        numberOfStudent.value = students.value.length
      } catch (error) {
        console.log(error)
      }
    })

    const openUpdateStudent = async (student_id, full_name) => {
      openUpdate.value = true
      studentId.value = student_id
      fullName.value = full_name
      studentIdBeforeUpdate.value = student_id
    }

    const openCreateStudent = async () => {
      openAdd.value = true
      studentId.value = ''
      fullName.value = ''
    }

    const handleUpdateStudent = async () => {
      const student = new Student(studentId.value, fullName.value, classIdStudent.value)
      console.log(classIdStudent.value)
      const index = students.value.findIndex(
        (student) => student.student_id === studentIdBeforeUpdate.value
      )
      student.generateEmail()
      student.trim()
      try {
        await studentService.update(studentIdBeforeUpdate.value, student)

        if (classIdStudent.value === classId) {
          toast.success('Thông tin đã được cập nhật')
          students.value[index].student_id = studentId.value
          students.value[index].full_name = fullName.value
        } else {
          toast.success('Sinh viên đã chuyển sang lớp ' + classIdStudent.value)
          students.value.splice(index, 1)
        }
      } catch (error) {
        console.log(error)
        if (error.response.status === 400) {
          toast.error(error.response.data.message)
        }
      }
    }

    const handleCreateStudent = async () => {
      if (!studentId.value) {
        toast.warning('Không được để trống MSSV!')
        return
      }
      if (!fullName.value) {
        toast.warning('Không được để trống Họ và Tên!')
        return
      }

      try {
        const newStudent = new Student(studentId.value, fullName.value, classId.value)
        newStudent.generateEmail()
        newStudent.trim()
        const result = await studentService.create(newStudent)
        toast.success(result.message)
        students.value.push({
          student_id: result.student.student_id,
          full_name: result.student.full_name,
          email: result.student.email
        })
        numberOfStudent.value++
        studentId.value = ''
        fullName.value = ''
      } catch (error) {
        if (error.response.status === 400) {
          toast.error('Mã số sinh viên đã tồn tại!!')
        }
      }
    }

    const handleDeleteStudent = async (studentId) => {
      try {
        await studentService.delete(studentId)

        const index = students.value.findIndex((student) => student.class_id === classId)
        students.value.splice(index, 1)
        toast.success('Đã xóa thành công sinh viên ' + studentId)
        numberOfStudent.value--
      } catch (error) {
        console.log(error)
      }
    }

    const handleSearch = async () => {
      console.log(search.value)
      try {
        students.value = await majorClassService.getStudentsByClassId(classId.value, search.value)
      } catch (error) {
        console.log(error)
      }
    }

    watch((seacrh) => {
      console.log('hello')
      handleSearch()
    })

    return {
      openCreateStudent,
      openUpdateStudent,
      handleCreateStudent,
      handleDeleteStudent,
      handleUpdateStudent,
      openUpdate,
      students,
      className,
      classId,
      openAdd,
      studentId,
      fullName,
      search,
      numberOfStudent,
      allClass,
      classIdStudent
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 80vh;
}
.title {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
}

table {
  width: 90%;
  margin: 0 auto;
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;
}

th {
  width: 20%;
  font-size: 20px;
}

td {
  font-size: 18px;
  text-align: center;
  padding: 10px 0;
  font-weight: bolder;
}

tr:nth-child(even) {
  background-color: #88bdbc;
}

tr:nth-child(odd) {
  background-color: #254e58;
  color: white;
}

.stt {
  width: 10%;
}

.delete-btn,
.update-btn {
  font-size: 28px;
  cursor: pointer;
}

.update-btn {
  margin-left: 20px;
}

.delete-btn:hover,
.update-btn:hover {
  color: red;
}

.title-noc {
  text-align: center;
  font-weight: bold;
}

.search {
  width: 75%;
  font-size: 18px;
  background-color: white;
}

.header-container {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  width: 90%;
  margin-bottom: 30px;
}

.btn-open-add {
  background-color: #88bdbc;
  font-weight: bold;
  padding: 0 50px;
  font-size: 16px;
}

.btn-add {
  display: flex;
  margin: 0 auto;
  margin-top: 20px;
  padding: 10px 30px;
  background-color: #88bdbc;
  font-size: 14px;
  font-weight: bold;
}

.input-label {
  font-size: 18px;
}

.input {
  margin: 10px 0;
  font-size: 18px;
}

.total-student {
  font-size: 20px;
  font-weight: bold;
  margin-left: 100px;
}

.class-select-label{
  font-size: 16px;
}
</style>
