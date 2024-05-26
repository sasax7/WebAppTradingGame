<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p class="text-body-secondary">Sign In to your account</p>
                  <p class="text-danger" v-if="errorMessage">{{ errorMessage }}</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput placeholder="Username" autocomplete="username" v-model="username" />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                      v-model="password"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="primary" class="px-4" @click="handleLogin"> Login </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0"> Forgot password? </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </p>
                  <CButton color="light" variant="outline" class="mt-3" @click="handleRegister">
                    Register Now!
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { loginUser } from '@/hooks/databaseService'
import router from '@/router' // adjust the path based on your project structure
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    }
  },
  methods: {
    handleRegister() {
      router.push({ name: 'Register' }).catch((err) => console.error(err))
    },
    async handleLogin() {
      try {
        const result = await loginUser(this.username, this.password)
        console.log(result)
        // handle successful login (e.g., redirect to another page)
        Cookies.set('userId', result.id) // save user ID as a cookie
        await router.push('/dashboard').catch((err) => console.error(err))
      } catch (error) {
        console.error(error)
        // handle login error (e.g., show error message)
        this.errorMessage = 'Username or password is wrong' // add this line
      }
    },
  },
}
</script>
