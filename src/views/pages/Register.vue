<template>
  <div class="bwrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4">
            <CCardBody class="p-4">
              <CForm @submit.prevent="handleRegister">
                <h1>Register</h1>
                <p class="text-body-secondary">Create your account</p>
                <p class="text-danger" v-if="errorMessage">{{ errorMessage }}</p>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput v-model="username" placeholder="Username" autocomplete="username" />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput v-model="email" placeholder="Email" autocomplete="email" />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput v-model="password" type="password" placeholder="Password" autocomplete="new-password" />
                </CInputGroup>

                <div class="d-grid">
                  <CButton color="success" type="submit">Create Account</CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>
<script>
import { registerUser } from '@/hooks/databaseService' // adjust the path based on your project structure
import router from '@/router' // import the router object


export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errorMessage: '',
    }
  },
  methods: {
    async handleRegister() {
      try {
        const userId = await registerUser(this.username, this.email, this.password)
        router.push('/pages/login').catch((err) => console.error(err))

      } catch (error) {
        if (error.message === 'A user with this email already exists') {
          this.errorMessage = error.message
        } else {
          console.error(error)
        }
      }
    },
  },
}
</script>