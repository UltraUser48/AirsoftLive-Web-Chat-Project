<template>
    
 <div style="background:url('https://wallpaperaccess.com/full/1385796.jpg')">
    <div class="jumbotron bg-secondary text-white text-center font-weight-bold">
      <h2 class="lead display-3 font-weight-bold">Airsoft Live</h2>
 
     <p>The best online platform for realtime communication with Airsoft enthusiasts all over the Globe!</p>
      
    </div>
        <div class="row">
            <div class="col-md-6 offset-md-3">
                     <h2 class="text-center text-warning mb-2 display-5"><i class="fa fa-user"></i> Register</h2>
                <form>
                  <div class="form-group">
                    <input v-model.trim="name" @input="clearErrors" type="text" name="name" class="form-control" placeholder="Name" required>
                  </div>

                  <div class="form-group">
                    <input v-model.trim="email" @input="clearErrors" type="email" name="email" class="form-control" placeholder="Email" required>
                  </div>

                  <div class="form-group">
                    <input v-model.trim="password" type="password" password="password" class="form-control" placeholder="Password" required>
                  </div>

                  <div class="form-group">
                    <input v-model.trim="password_confirmation" type="password" name="password_confirmation" class="form-control" placeholder="Repeat password" required>
                  </div>

                  <button @click.prevent="register" type="submit" class="btn btn-primary btn-lg form-control" v-if="!isLoading">Register</button>
                  <button class="btn btn-primary form-control" disabled v-else>Please wait...</button>

                  <big class="form-text text-warning font-weight-bold">Have an Account ? <router-link to="login">Login</router-link>
                </big>

                    <br>

                  <div class="alert alert-danger" v-if="hasErrors">
                      <div v-for="error in errors">{{ error }}</div>
                  </div>
                </form>
            </div>
        </div>


    </div>

</template>

<script>
import firebase from 'firebase'
import md5 from 'md5'
    export default {
        name: 'register',
        data() {
            return {
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                errors: [],
                usersRef: firebase.database().ref('users'),
                isLoading: false
            }
        },
        computed: {
            hasErrors() {
                return this.errors.length > 0
            }
        },
        methods: {
            register() {
              
                this.errors = []
             
                if(this.isFormValid()) {
                  
                    this.isLoading = true
                    firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                    .then(response => {
                        console.log(response)
                     
                        let user = response.user;
                        user.updateProfile({
                                displayName: this.name,
                                photoURL: "http://www.gravatar.com/avatar/"+md5(user.email)+"?d=identicon"
                            })
                        .then(() => {
                         
                            this.saveUserToUsersRef(user)
                            .then(() => {
                          
                                this.$store.dispatch("setUser", user)
                                this.$router.push('/')
                            })
                        },
                        error => {
                            console.log(error)
                            this.errors.push(error.message)
                          
                            this.isLoading = false
                        })
                    }) 
                    .catch(error => {
                        console.log(error)
                        this.errors.push(error.message)
                       
                        this.isLoading = false
                    })
                }
            },
           
            saveUserToUsersRef(user){
                return this.usersRef.child(user.uid).set({
                    name: user.displayName,
                    avatar: user.photoURL
                })
            },
            isEmpty () {
                if(this.name.length == 0 || this.email.length == 0 || this.password.length == 0 || this.password_confirmation.length == 0){
                    return true;
                }
                return false;
            },
            passwordValid () {
                if(this.password.length < 6 || this.password_confirmation.length < 6){
                    return false;
                }
                if(this.password !== this.password_confirmation){
                    return false;
                }
                return true;
            },
            isFormValid(){
                if(this.isEmpty()){
                    this.errors.push('Please complete all fields')
                    return false
                }
                if(!this.passwordValid()){
                    this.errors.push('Incorrect password')
                    return false
                }
                return true
            },
            clearErrors() {
                this.errors = []
            }
        }
    }
</script>