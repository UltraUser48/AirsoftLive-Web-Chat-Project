<template>
    <div style=" background:url('https://i.pinimg.com/736x/36/9a/c5/369ac54de18468bd17e78a7066651d07.jpg')">

        <h2 class="text-light">#Airsoft Live Chat Platform</h2>
        <hr style="border: 2px solid #333;">

        <span>
            <img class="rounded-circle mr-2" height="30" :src="currentUser.photoURL" />
            <span class="text-light">{{ currentUser.displayName }}</span> 
        </span>

        <br/>
        <br/>

        <button @click="logout" class="btn btn-outline-danger">Logout</button>

        <br/>
        <br/>

        <channels></channels>

        <br/>
        <br/>

        <users></users>

    </div>
</template>

<script>
import auth from 'firebase/auth'
import {mapGetters} from 'vuex'
import Channels from './Channels'
import Users from './Users'
import database from 'firebase/database'
    export default {
        name: 'sidebar',
        components: {Channels, Users},
        data() {
            return {
                presenceRef: firebase.database().ref('presence')
            }
        },
        computed: {
            ...mapGetters(['currentUser'])
        },
        methods: {
            logout() {
                this.presenceRef.child(this.currentUser.uid).remove()
                firebase.auth().signOut()
                this.$store.dispatch('setUser', null)
                this.$router.push('/login')
            }
        }
    }
</script>