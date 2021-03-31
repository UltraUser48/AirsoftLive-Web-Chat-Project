<template>
  <div style=" background:url('https://wallpaperaccess.com/full/336935.jpg')">
    <div class="jumbotron bg-secondary text-white text-center font-weight-bold">
      <h2 class="lead display-3 font-weight-bold">Airsoft Live</h2>
 
      <p>The best online platform for realtime communication with Airsoft enthusiasts all over the Globe!</p>
      
    </div>

    
    <div class="col-md-6 offset-md-3">
    
     <h2 class="text-center text-warning mb-2 display-5"><i class="fa fa-user"></i> Login</h2>
      <form>
        <div class="form-group">
          <input v-model.trim="email" @input="clearErrors" type="email" name="email" class="form-control" placeholder="Email" required="">
        </div>
        <div class="form-group">
          <input v-model.trim="password" type="password" password="password" class="form-control" placeholder="Password" required>
        </div>
        <button @click.prevent="login" type="submit" class="btn btn-lg btn-primary form-control" v-if="!isLoading">Login</button>
        <button class="btn btn-primary form-control" disabled v-else>Please wait...</button>
        <br/>
        <big class= "text-center text-warning mb-2 display-5 font-weight-bold" ><router-link to="register" tag="button" class="btn btn-warning btn-lg ">Register for free</router-link>
                    <span class="float-right text-warning" @click.prevent="fp">
                        <span v-if="!fpform">Forgot password</span>
                        <span v-else>
                            <i class="fa fa-close text-danger"></i>
                        </span>
                    </span>
                  </big>
        <br/>
        <div class="alert alert-danger" v-if="hasErrors">
          <div v-for="error in errors">{{ error }}</div>
        </div>
      </form>
 <br/>
      <form v-if="fpform">
        <div class="input-group">
          <input v-model.trim="forgot_password" type="email" name="forgot_password" class="form-control" placeholder="Email to send password reset link">
          <button @click.prevent="forgotPassword" class="btn btn-primary">Submit</button>
        </div>
        <br>
     
        <div class="alert alert-info" v-if="loading">
            <div>Please wait...</div>
        </div>
  
        <div class="alert alert-danger" v-if="hasErrors">
          <div v-for="error in errors">{{ error }}</div>
        </div>
      </form>
   
      <div class="text-center mt-4">
        <button @click="loginWithGoogle" class="btn btn-danger">Login with a Google Account</button>
        <br/>
        <br/>

      </div>
    </div>
<div style=" height:500px; width:150%; background:url('https://wallpapercave.com/wp/wp2748750.jpg')">
    <router-link to="/airsoftinfo" tag="button" class="btn btn-dark btn-lg ">What is Airsoft ?</router-link>
  </div>
  <div style=" height:500px; width:150%; background:url('https://www.wallpaperuse.com/wallp/49-490947_m.jpg')">
    <router-link to="/about" tag="button" class="btn btn-dark btn-lg ">About</router-link>
  </div>
   <div style=" height:500px; width:150%; background:url('https://cdn.hipwallpaper.com/i/32/34/epgxOl.jpg')">
    <router-link to="/contact" tag="button" class="btn btn-dark btn-lg ">Contact</router-link>
  </div>
    <div class="jumbotron bg-secondary text-white text-center">
      <h2 class="lead display-3"></h2>
 
      <p>Join the biggest online Airsoft Thread!</p>
      
    </div>
  </div>

</template>


<script>
import auth from 'firebase/auth'
import database from 'firebase/database'
export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      forgot_password: '',
      fpform: false,
      errors: [],
      loading: false,
      usersRef: firebase.database().ref('users')
    }
  },
  computed: {
    hasErrors() {
      return this.errors.length > 0
    }
  },
  methods: {
    login() {
      console.log('login')
      this.errors = []
      if (!this.isFormValid()) {
        this.isLoading = true
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(response => {
          let user = response.user;
          console.log(user)
          this.$store.dispatch('setUser', user)
          this.$router.push('/')
        }).catch(error => {
          this.errors.push(error.message)
          this.isLoading = false
        })
      }
    },
    isFormValid() {
      if (this.email.length > 0 && this.email.length <= 6 && this.password.length > 0 && this.password.length <= 6) {
        return true
      }
      return false
    },
    forgotPassword() {
      console.log('forgot password', this.forgot_password)
      firebase.auth().sendPasswordResetEmail(this.forgot_password)
        .then(success => {
          this.fpform = false
          alert('Check your email for password reset link')
          this.$router.push('/')
        })
        .catch(error => {
          alert(error.message)
        })
    },
    fp() {
      return this.fpform = !this.fpform
    },
    loginWithGoogle() {
  
      this.loading = true
  
      this.errors = []
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((response) => {
  
          this.saveUserToUsersRef(response.user)
        
          this.$store.dispatch('setUser', response.user)
       
          this.$router.push('/')
        })
        .catch(error => {
          this.errors.push(error.message)
         
          this.loading = false
        })
    },
    
    saveUserToUsersRef(user) {
      return this.usersRef.child(user.uid).set({
        name: user.displayName,
        avatar: user.photoURL
      })
    },
    clearErrors() {
        this.errors = []
    }
  }
}
</script>
<style>
.btn,
.jumbotron {
  border-radius: 0px;
}
</style>